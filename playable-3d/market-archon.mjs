// Reuse the Market's existing modal and pause/focus lifecycle.
export function createMarketArchon({ dialog, show, lobbyUrl }) {
  if (!lobbyUrl) throw new TypeError("A Careers Archon lobby URL is required.");
  const lobby = new URL(lobbyUrl, dialog.ownerDocument.baseURI);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(lobby.hostname);
  if ((lobby.protocol !== 'https:' && !(local && lobby.protocol === 'http:')) ||
      lobby.username || lobby.password || lobby.search || lobby.hash) {
    throw new TypeError('Configure a Careers Archon lobby URL without credentials, query or fragment.');
  }

  const document = dialog.ownerDocument;
  if (!document.querySelector('[data-ce-archon-wide-style]')) {
    const style = document.createElement('style');
    style.dataset.ceArchonWideStyle = '1';
    style.textContent = `
      #market-dialog.market-archon[open]{box-sizing:border-box;display:grid;
        grid-template-columns:minmax(0,1fr) auto auto;grid-template-rows:auto minmax(0,1fr);
        gap:8px;width:calc(100vw - 24px);max-width:none;height:calc(100dvh - 24px);
        max-height:none;margin:auto;padding:12px;overflow:hidden}
      #market-dialog.market-archon>.market-kicker,
      #market-dialog.market-archon>.market-body{display:none}
      #market-dialog.market-archon>#market-dialog-title{grid-area:1/1;margin:0;font-size:1.15rem;line-height:1.2}
      #market-dialog.market-archon>.market-choices{grid-area:1/2;margin:0;display:flex;gap:6px}
      #market-dialog.market-archon>.market-close{grid-area:1/3;margin:0}
      #market-dialog.market-archon>.market-choices button,
      #market-dialog.market-archon>.market-close{padding:8px 12px}
      #market-dialog.market-archon>.market-archon-frame{grid-column:1/-1;grid-row:2;
        display:block;min-width:0;min-height:0;width:100%;height:100%;border:0}
      @media(max-width:640px){
        #market-dialog.market-archon[open]{width:100vw;height:100dvh;padding:6px;
          grid-template-columns:minmax(0,1fr) auto;border-radius:0;gap:6px}
        #market-dialog.market-archon>#market-dialog-title{display:none}
        #market-dialog.market-archon>.market-choices{grid-area:1/1}
        #market-dialog.market-archon>.market-close{grid-area:1/2}
        #market-dialog.market-archon>.market-choices button,
        #market-dialog.market-archon>.market-close{font-size:.85rem;padding:8px}
      }`;
    document.head.append(style);
  }

  let frame;
  function removeFrame() {
    frame?.remove();
    frame = undefined;
    dialog.classList.remove('market-archon');
  }
  dialog.addEventListener('cancel', removeFrame);
  dialog.addEventListener('close', () => {
    if (!dialog.open) removeFrame();
  });

  function openLobby(back, label = 'Back to Arcade Games') {
    removeFrame();
    show('Careers Archon · test release', 'For Tania’s testing; full browser acceptance is still in progress. An adjudicator creates a Game ID and two players join; no teacher setup is needed. You can return to your Market visit at any time.', [
      [label, () => { removeFrame(); back(); }]
    ]);
    dialog.classList.add('market-archon');
    frame = dialog.ownerDocument.createElement('iframe');
    frame.className = 'market-archon-frame';
    frame.title = 'Careers Archon game lobby';
    frame.referrerPolicy = 'no-referrer';
    frame.src = lobby.href;
    dialog.append(frame);
  }

  function arcadeChoice(returnToChoices) {
    function openArcade() {
      show('Arcade Games', 'Choose a game or return to the Market choices.', [
        ['Archon Engine', () => openLobby(openArcade)],
        ['Back to Market choices', returnToChoices]
      ]);
    }
    return ['Arcade Games', openArcade];
  };
  arcadeChoice.openLobby = back => openLobby(back, 'Back to Market choices');
  return arcadeChoice;
}
