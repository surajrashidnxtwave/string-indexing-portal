// ════════════════════════════════════════════════════════════════════
// IRT ENGINE — 2-Parameter Logistic (2PL) model
//
//   P(correct | θ) = 1 / (1 + e^(-a(θ - b)))
//
//   θ  — learner ability (latent trait)
//   b  — item difficulty
//   a  — item discrimination
//
// Ability estimation: EAP (Expected A Posteriori) with N(0,1) prior,
// numerically integrated over a θ grid. Robust even for all-correct /
// all-incorrect response patterns (unlike MLE).
//
// Item selection: maximum Fisher information at current θ̂, subject to
// the content blueprint (level quotas from the MA practice spec).
// ════════════════════════════════════════════════════════════════════

const IRT = (() => {

  // θ grid for numerical integration: -4 to +4 in steps of 0.1
  const GRID = [];
  for (let t = -4; t <= 4.0001; t += 0.1) GRID.push(Math.round(t * 10) / 10);

  /** Probability of a correct response under 2PL */
  function pCorrect(theta, a, b) {
    return 1 / (1 + Math.exp(-a * (theta - b)));
  }

  /** Fisher information of an item at ability θ (2PL): a²·P·(1−P) */
  function information(theta, a, b) {
    const p = pCorrect(theta, a, b);
    return a * a * p * (1 - p);
  }

  /**
   * EAP ability estimate from a response history.
   * responses: [{ a, b, correct: bool }]
   * returns { theta, se }
   */
  function estimateAbility(responses) {
    if (responses.length === 0) return { theta: 0, se: 1 };

    // posterior(θ) ∝ prior(θ) · Π likelihood
    const posterior = GRID.map(t => {
      let L = Math.exp(-(t * t) / 2); // N(0,1) prior, unnormalized
      for (const r of responses) {
        const p = pCorrect(t, r.a, r.b);
        L *= r.correct ? p : (1 - p);
      }
      return L;
    });

    const sum = posterior.reduce((x, y) => x + y, 0);
    if (sum === 0) return { theta: 0, se: 1 };

    const theta = GRID.reduce((acc, t, i) => acc + t * posterior[i], 0) / sum;
    const variance = GRID.reduce((acc, t, i) => acc + (t - theta) ** 2 * posterior[i], 0) / sum;

    return { theta, se: Math.sqrt(variance) };
  }

  /**
   * Select the next item: max information at θ̂ among items whose level
   * still has blueprint quota. Top-2 randomesque to vary sessions slightly.
   * Returns an item or null when the blueprint is exhausted.
   */
  function selectNext(theta, bank, usedIds, quotaRemaining) {
    const candidates = bank.filter(item =>
      !usedIds.has(item.id) && (quotaRemaining[item.level] || 0) > 0
    );
    if (candidates.length === 0) return null;

    candidates.sort((x, y) => information(theta, y.a, y.b) - information(theta, x.a, x.b));

    // 70% best item, 30% second-best (exposure control / variety)
    if (candidates.length > 1 && Math.random() > 0.7) return candidates[1];
    return candidates[0];
  }

  /** Map θ to a 0–100 mastery score (logistic squash centred at 0) */
  function masteryScore(theta) {
    return Math.round(100 / (1 + Math.exp(-1.2 * theta)));
  }

  /** Map θ to a mastery band label */
  function masteryBand(theta) {
    if (theta < -1.0) return { label: "Beginning",  desc: "Core ideas are still forming — revisit the concept videos and cheatsheet." };
    if (theta <  0.0) return { label: "Developing", desc: "Foundations are in place — more practice will lock in the patterns." };
    if (theta <  1.0) return { label: "Proficient", desc: "Solid command of indexing and slicing — ready to move on." };
    return               { label: "Advanced",   desc: "Excellent — you handle even the trickiest slice patterns with ease." };
  }

  return { pCorrect, information, estimateAbility, selectNext, masteryScore, masteryBand, GRID };
})();
