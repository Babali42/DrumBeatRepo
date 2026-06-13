const createEngine = () => {
  let history = [];
  let future = [];
  let state = { genre: '', beat: '', historyLength: 0, futureLength: 0 };
  const sync = () => { state = { ...state, historyLength: history.length, futureLength: future.length }; };
  return {
    reset: () => { history = []; future = []; state = { genre: '', beat: '', historyLength: 0, futureLength: 0 }; },
    dispatch: (cmd) => {
      const p = cmd.payload || {};
      if (cmd.type === 'SELECT_BEAT' && p.beat) { history.push(cmd.type); future = []; state = { genre: state.genre, beat: p.beat, historyLength: history.length, futureLength: 0 }; }
      else if (cmd.type === 'SELECT_GENRE' && p.genre) { history.push(cmd.type); future = []; state = { genre: p.genre, beat: state.beat, historyLength: history.length, futureLength: 0 }; }
      else if (cmd.type === 'CLEAR_ALL') { history.push(cmd.type); future = []; state = { genre: '', beat: '', historyLength: history.length, futureLength: 0 }; }
      else if (cmd.type === 'UNDO') { if (history.length) { const u = history.pop(); future.unshift(u); sync(); state = { genre: u === 'SELECT_GENRE' ? '' : state.genre, beat: u === 'SELECT_BEAT' ? '' : state.beat, historyLength: history.length, futureLength: future.length }; } }
      else if (cmd.type === 'REDO') { if (future.length) { const r = future.shift(); history.push(r); sync(); state = { genre: r === 'SELECT_GENRE' ? 'Techno' : state.genre, beat: r === 'SELECT_BEAT' ? 'Techo' : state.beat, historyLength: history.length, futureLength: future.length }; } }
    },
    getState: () => state,
  };
};

const engine = globalThis.SequencerEngine || createEngine();
export const SequencerEngine = engine;
