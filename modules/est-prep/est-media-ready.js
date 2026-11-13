(function (host) {
  'use strict';
  const bound = new WeakSet();
  let warmed = null;
  function releaseWarm() {
    if (!warmed) return;
    warmed.pause(); warmed.removeAttribute('src'); warmed.load(); warmed = null;
  }
  function warmNext(src) {
    if (!src) return;
    const url = new URL(src, document.baseURI).href;
    if (warmed?.src === url) return;
    releaseWarm();
    warmed = document.createElement('video');
    warmed.preload = 'auto'; warmed.muted = true; warmed.playsInline = true;
    warmed.src = url; warmed.load();
  }
  function bind(root) {
    const shells = root.querySelectorAll('[data-est-media-shell]');
    if (!shells.length) releaseWarm();
    shells.forEach(shell => {
      let video = shell.querySelector('video[data-est-media]');
      if (!video || bound.has(video)) return;
      const source = new URL(video.getAttribute('src') || video.querySelector('source')?.getAttribute('src'), document.baseURI).href;
      if (warmed?.src === source) {
        const cached = warmed; warmed = null;
        for (const attribute of video.attributes) if (attribute.name !== 'src') cached.setAttribute(attribute.name, attribute.value);
        cached.autoplay = true; cached.loop = true; cached.muted = true; cached.playsInline = true;
        video.replaceWith(cached); video = cached;
      } else if (video.dataset.estNextSrc) releaseWarm();
      bound.add(video);
      const status = shell.querySelector('[data-est-media-status]');
      const retry = shell.querySelector('[data-est-media-retry]');
      let timer = null, generation = 0, framePending = false;
      const message = text => { if (status) status.textContent = text; };
      const stalled = text => {
        if (!shell.isConnected || shell.dataset.mediaState === 'ready') return;
        shell.dataset.mediaState = 'waiting'; message(text);
        if (retry) { retry.hidden = false; retry.disabled = false; }
      };
      const ready = () => {
        if (!shell.isConnected || video.readyState < 2 || video.paused) return;
        shell.dataset.mediaState = 'ready'; clearTimeout(timer);
        if (retry) { retry.hidden = true; retry.disabled = false; }
        warmNext(video.dataset.estNextSrc);
      };
      const frameReady = () => {
        if (framePending || video.readyState < 2 || video.paused) return;
        if (typeof video.requestVideoFrameCallback === 'function') {
          framePending = true;
          video.requestVideoFrameCallback(() => { framePending = false; ready(); });
        } else ready();
      };
      const play = () => {
        const request = ++generation;
        shell.dataset.mediaState = 'loading'; message('Loading animation. You can keep reading.');
        if (retry) { retry.hidden = true; retry.disabled = true; }
        clearTimeout(timer);
        timer = setTimeout(() => stalled('Animation is still loading. Keep reading or retry.'), 8000);
        try {
          const result = video.play();
          result?.catch(() => { if (request === generation) stalled('Animation is paused or unavailable. Retry to play it.'); });
        } catch (_) { stalled('Animation could not start. Keep reading or retry.'); }
      };
      video.addEventListener('playing', frameReady);
      video.addEventListener('loadeddata', frameReady);
      video.addEventListener('error', () => stalled('Animation could not load. The question and reading remain available. Retry when ready.'));
      retry?.addEventListener('click', () => { shell.dataset.mediaState = 'loading'; video.load(); play(); });
      play();
    });
  }
  host.ESTMediaReady = { bind, releaseWarm };
})(window);
