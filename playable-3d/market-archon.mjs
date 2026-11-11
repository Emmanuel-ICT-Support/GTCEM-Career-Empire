// Reuse the Market's existing modal and pause/focus lifecycle.
export function createMarketArchon({ dialog, show, lobbyUrl }) {
  if (!lobbyUrl) throw new TypeError("A Careers Archon lobby URL is required.");
  const lobby = new URL(lobbyUrl, dialog.ownerDocument.baseURI);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(lobby.hostname);
  if ((lobby.protocol !== 'https:' && !(local && lobby.protocol === 'http:')) ||
      lobby.username || lobby.password || lobby.search || lobby.hash) {
    throw new TypeError('Configure a Careers Archon lobby URL without credentials, query or fragment.');
  }

  let frame;
  function removeFrame() {
    frame?.remove();
    frame = undefined;
  }
  dialog.addEventListener('cancel', removeFrame);
  dialog.addEventListener('close', () => {
    if (!dialog.open) removeFrame();
  });

  function openLobby(back, label = 'Back to Arcade Games') {
    removeFrame();
    show('Careers Archon', 'Join or reserve a game with your group. You can return to your Market visit at any time.', [
      [label, () => { removeFrame(); back(); }]
    ]);
    frame = dialog.ownerDocument.createElement('iframe');
    frame.title = 'Careers Archon game lobby';
    frame.referrerPolicy = 'no-referrer';
    frame.style.cssText = 'display:block;width:100%;height:65dvh;border:0';
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
