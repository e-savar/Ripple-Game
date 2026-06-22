// solver.js

function cloneState(state) {
    const out = {};
    for (const k in state) out[k] = state[k];
    return out;
  }
  
  function stateKey(state, labels) {
    return labels.map(l => state[l]).join(",");
  }
  function bfsDist(source, LABELS, EDGES) {
    const dist = {};
    LABELS.forEach(l => dist[l] = null);
  
    const q = [source];
    dist[source] = 0;
  
    while (q.length) {
      const u = q.shift();
      for (const v of EDGES[u]) {
        if (dist[v] === null) {
          dist[v] = dist[u] + 1;
          q.push(v);
        }
      }
    }
    return dist;
  }
  // simulate ripple (must mirror your logic)
  function applyInjection(state, labels, edges, node, value) {
    const dist = {};
    labels.forEach(l => dist[l] = null);
  
    const q = [node];
    dist[node] = 0;
  
    while (q.length) {
      const u = q.shift();
      for (const v of edges[u]) {
        if (dist[v] === null) {
          dist[v] = dist[u] + 1;
          q.push(v);
        }
      }
    }
  
    for (const n of labels) {
      if (dist[n] !== null && dist[n] <= value) {
        const contrib = Math.max(value - dist[n], 0);
        state[n] += contrib;
      }
    }
  }
  
  function isSolved(state, target, labels) {
    return labels.every(l => state[l] === target[l]);
  }
  
  // BFS search for minimum moves
  function computeOptimalInjections(LABELS, EDGES, target) {
    const K = 80;
    const MAX_DEPTH = 10;
  
    function clone(s){ return structuredClone(s); }
  
    function score(state){
      let e = 0;
      for (const n of LABELS) {
        e += Math.abs(state[n] - target[n]);
      }
      return e;
    }
  
    let beam = [{
      state: Object.fromEntries(LABELS.map(l => [l, 0])),
      moves: 0
    }];
  
    for (let depth = 0; depth < MAX_DEPTH; depth++) {
      const nextBeam = [];
  
      for (const item of beam) {
        for (const node of LABELS) {
          for (const value of [1,2,3]) {
            const next = clone(item.state);
            applyInjection(next, LABELS, EDGES, node, value);
  
            nextBeam.push({
              state: next,
              moves: item.moves + 1,
              score: score(next)
            });
          }
        }
      }
  
      nextBeam.sort((a,b) => a.score - b.score);
      beam = nextBeam.slice(0, K);
  
      if (beam[0].score === 0) return beam[0].moves;
    }
  
    return beam[0].moves;
  }
 