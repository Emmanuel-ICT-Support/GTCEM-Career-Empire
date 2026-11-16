const choices = [
  ['mara', 'Mara’s Noodle Bar', 'Walk to Mara’s stall and try an idea on shift.'],
  ['archon', 'Career Archon', 'Speak up with a plan during a team match.'],
  ['notes', 'Notes', 'Explore examples and check your understanding.'],
  ['portfolio', 'Portfolio Builder', 'Use STAR to explain something you did and what changed.']
];

const marketImage = new URL('./market-trial.jpg', import.meta.url);
const maraPortrait = new URL('./mara-portrait.png', import.meta.url);

export function mountMarketEntrance(container, { routes, onClose, portfolioHref, stage = 'initiative', onBack, onStart }) {
  const isMara = stage === 'mara';
  const document = container.ownerDocument;
  const spread = document.createElement('div');
  spread.className = 'ce-market-entrance';
  spread.dataset.marketStage = isMara ? 'mara' : 'initiative';
  spread.innerHTML = `
    <section class="ce-market-picklist" aria-labelledby="market-dialog-title">
      <h2 id="market-dialog-title" tabindex="-1">Sunday Markets</h2>
      <h3>${isMara ? 'Your next move' : 'Choose how to explore initiative'}</h3>
      <div class="ce-market-routes"></div>
      <button class="ce-market-leave" type="button">${isMara ? 'Back to Initiative options' : 'Back to the Market'}</button>
    </section>
    <section class="ce-market-guide" aria-labelledby="ce-initiative-title">
      <header class="ce-market-masthead">
        
        <h3 id="ce-initiative-title">${isMara ? 'See a need, make a difference' : 'Initiative'}</h3>
        <p>${isMara ? 'Mara has a lunch-rush problem. Notice what is happening, share a useful idea and agree on a first step.' : 'Initiative means noticing a need, thinking of a better way and acting proactively. Believe your idea can help: use self-motivation and good judgement, communicate appropriately, and check with the right person when a change affects others or goes beyond your role.'}</p>
        ${isMara ? '' : '<p><strong>Small, thoughtful changes can build confidence, trust, opportunities and a sense of fulfilment.</strong></p>'}
      </header>
      <figure class="ce-market-hero">
        <div class="ce-market-scene">
          <img class="ce-market-trial" width="1280" height="720" alt="Customers approach Juniper Kitchen as Mara’s crew trials separate signs for ordering and pickup.">
        </div>
        <figcaption>
          <img class="ce-market-mara" width="400" height="400" alt="">
          <div>
            <h4>The lunch rush is here</h4>
            <p>Prepaid customers are joining the walk-up queue. What could you do before the line gets longer?</p>
          </div>
        </figcaption>
      </figure>
      ${isMara ? `
      <section class="ce-market-first-step" aria-labelledby="ce-market-first-step-title">
        <h4 id="ce-market-first-step-title">How would you help Mara?</h4>
        <ol role="list">
          <li><strong>Notice a need</strong><span>Who is waiting in the wrong line?</span></li>
          <li><strong>Believe change is possible</strong><span>What small change could help people find pickup?</span></li>
          <li><strong>Back your contribution</strong><span>What idea could you bring to the crew?</span></li>
          <li><strong>Communicate with care</strong><span>Listen to customers, then explain your idea to Mara.</span></li>
          <li><strong>Take the first step</strong><span>Agree on a small trial with Mara. Check what changes.</span></li>
        </ol>
      </section>
      ` : ''}
      <div class="ce-market-content">
        <section aria-labelledby="ce-initiative-ways">
          <h4 id="ce-initiative-ways">Five ways to show initiative</h4>
          <ol class="ce-market-ways" role="list">
            <li><strong>Be proactive</strong>Spot the mixed queue and check what arriving customers need.</li>
            <li><strong>Identify ways to improve current work practices</strong>Suggest trying a prepaid pickup sign where customers can see it.</li>
            <li><strong>Vocalise your opinions</strong>Tell Mara why the queue is confusing, share your idea and listen.</li>
            <li><strong>Help fellow workers</strong>Offer to restock bags while Sam packs orders.</li>
            <li><strong>Seek more responsibilities</strong>Ask Mara to show you how to run pickup, then offer to take a turn.</li>
          </ol>
        </section>
        <section class="ce-market-benefits" aria-labelledby="ce-initiative-benefits">
          <h4 id="ce-initiative-benefits">Why initiative helps</h4>
          <ul role="list">
            <li><strong>Empowerment and recognition</strong> Mara gives you a say in the trial and acknowledges your contribution.</li>
            <li><strong>Efficiency</strong> Clear signs can cut waiting time and free the crew to pack and serve orders.</li>
            <li><strong>Work opportunities</strong> A useful contribution can open chances for training, new duties and more fulfilling work over time.</li>
          </ul>
        </section>
      </div>
      <p class="ce-market-evidence"><strong>For your portfolio</strong> What did you notice, what did you do, and what changed?</p>
    </section>`;
  spread.querySelector('.ce-market-trial').src = marketImage.href;
  spread.querySelector('.ce-market-mara').src = maraPortrait.href;
  const list = spread.querySelector('.ce-market-routes');
  for (const [id, label, description] of choices) {
    const isLink = id === 'portfolio' && portfolioHref;
    const choice = document.createElement(isLink ? 'a' : 'button');
    choice.className = 'ce-market-choice';
    choice.dataset.marketRoute = id;
    if (isLink) {
      const base = new URL(container.ownerDocument.baseURI);
      const target = new URL(portfolioHref, base);
      if (target.origin !== base.origin || target.pathname !== new URL('../dashboards/student.html', base).pathname) throw new TypeError('Portfolio opener requires the same-origin Career Empire dashboard');
      choice.href = target.href;
      choice.target = '_blank';
      choice.rel = 'opener';
    } else {
      choice.type = 'button';
      choice.addEventListener('click', id === 'mara' && isMara ? onStart : routes[id]);
    }
    const title = document.createElement('strong');
    title.textContent = id === 'archon' && routes.archonAvailable !== true ? 'Archon Game — coming soon' : id === 'mara' && isMara ? 'Head over to have a chat with Mara' : label;
    const detail = document.createElement('span');
    detail.textContent = id === 'archon' && routes.archonAvailable !== true ? 'Online matches are not available yet. Check availability or return to the Market.' : id === 'mara' && isMara ? 'Explore the Markets and meet Mara at Juniper Kitchen.' : description;
    choice.append(title, detail);
    list.append(choice);
  }
  spread.querySelector('.ce-market-leave').addEventListener('click', isMara ? onBack : onClose);
  container.replaceChildren(spread);
  return spread.querySelector('#market-dialog-title');
}
