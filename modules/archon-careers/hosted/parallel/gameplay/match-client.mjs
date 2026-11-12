// One request per seat at a time. A user action can supersede a read.
export function createMatchClient({ request, onState, onError, onBusy }) {
  let seat;
  let flight;
  return {
    use(nextSeat) {
      flight?.controller.abort();
      flight = undefined;
      seat = nextSeat;
      onBusy(false);
    },
    async update(action) {
      if (!seat || flight?.action || (flight && !action)) return;
      flight?.controller.abort();
      const current = { controller: new AbortController(), action };
      flight = current;
      if (action) onBusy(true);
      try {
        const state = await request(seat, action, current.controller.signal);
        if (flight === current) onState(state);
      } catch (error) {
        if (flight === current) onError(error);
      } finally {
        if (flight === current) {
          flight = undefined;
          if (action) onBusy(false);
        }
      }
    },
  };
}

export function phaseCopy(match) {
  const judge = match.role === 'Judge';
  const ownTurn = match.turn === match.role;
  const turn = match.turn === 'A' ? 'Teal' : 'Amber';
  switch (match.phase) {
    case 'board':
      return ['On the board', ownTurn ? 'Choose your next move' : `${turn} to move`,
        ownTurn ? 'Select one of your pieces, then choose a highlighted square. Selecting a square occupied by an opponent starts an Initiative challenge.'
          : judge ? 'Watch the board. When a challenge starts, both players will receive the same workplace scenario.'
          : 'Watch the board while the other player moves.'];
    case 'writing':
      return ['Initiative challenge', 'Write your response',
        judge ? 'Both players are writing privately. Their responses appear together when both have submitted.'
          : match.submitted.includes(match.role) ? 'Your response is in. Both answers appear once the other player submits.'
          : 'Describe what you would do, how it would help, and why an employer would value it.'];
    case 'review':
      return ['Meeting of Minds', 'Compare both responses',
        judge ? 'Invite both players to explain their thinking. Use the guide below to record your verdict.'
          : 'Discuss the initiative each answer shows. The adjudicator will record the verdict and explain their reasoning.'];
    case 'territory':
      return ['Territory', 'Set the square’s rule',
        match.role === match.verdict.winner ? 'Choose the effect this square will keep for the rest of the match.'
          : 'The winning player chooses the rule for this square.'];
    case 'resolved':
      return ['Decision recorded', 'Return to the board',
        judge ? 'Give everyone time to read the verdict, then continue the match.' : 'Read the verdict. The adjudicator will resume play.'];
    default:
      return ['Careers Archon', 'Meeting of Minds', ''];
  }
}
