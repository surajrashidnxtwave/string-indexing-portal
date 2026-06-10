// ════════════════════════════════════════════════════════════════════
// ADAPTIVE PRACTICE SESSION (constrained CAT)
// 12 items · blueprint: Recall 2, Read 3, Debug 2, Approach 2, Implement 3
// Difficulty adapts via IRT; level coverage guaranteed by the blueprint.
// ════════════════════════════════════════════════════════════════════

const Practice = (() => {

  let state = null;

  function freshState() {
    return {
      theta: 0,
      se: 1,
      responses: [],        // { item, correct, answerGiven, thetaAfter, seAfter }
      usedIds: new Set(QUICK_CHECK_IDS),  // quick-check items excluded from pool
      quota: { ...PRACTICE_BLUEPRINT },
      totalItems: Object.values(PRACTICE_BLUEPRINT).reduce((x, y) => x + y, 0),
      current: null,
      answered: false,
      finished: false,
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────

  function normalize(str) {
    return (str || "").toLowerCase().replace(/\s+/g, "").replace(/["']/g, "");
  }

  function gradeText(item, answer) {
    const norm = normalize(answer);
    return item.accepted.some(acc => normalize(acc) === norm);
  }

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const LEVEL_COLORS = {
    Recall: "#5B9BD5", Read: "#2EAE85", Debug: "#D9A036",
    Approach: "#D4537E", Implement: "#8B7CF6",
  };

  // ── Session flow ─────────────────────────────────────────────────

  function start() {
    state = freshState();
    next();
  }

  function next() {
    const item = IRT.selectNext(state.theta, ITEM_BANK, state.usedIds, state.quota);
    if (!item || state.responses.length >= state.totalItems) {
      finish();
      return;
    }
    state.current = item;
    state.answered = false;
    renderQuestion();
  }

  function submit(answerPayload) {
    if (state.answered || !state.current) return;
    const item = state.current;

    let correct;
    if (item.type === "mcq") correct = answerPayload === item.correct;
    else correct = gradeText(item, answerPayload);

    state.usedIds.add(item.id);
    state.quota[item.level] -= 1;

    state.responses.push({ item, correct, answerGiven: answerPayload, thetaAfter: 0, seAfter: 0 });

    const est = IRT.estimateAbility(state.responses.map(r => ({ a: r.item.a, b: r.item.b, correct: r.correct })));
    state.theta = est.theta;
    state.se = est.se;
    const last = state.responses[state.responses.length - 1];
    last.thetaAfter = est.theta;
    last.seAfter = est.se;

    state.answered = true;
    renderFeedback(correct, answerPayload);
  }

  function finish() {
    state.finished = true;
    renderReport();
  }

  // ── Rendering ────────────────────────────────────────────────────

  function container() { return document.getElementById("practice-root"); }

  function abilityMeterHTML() {
    const pct = IRT.masteryScore(state.theta);
    const answered = state.responses.length;
    return `
      <div class="ability-bar-wrap">
        <div class="ability-bar-head">
          <span>Question ${Math.min(answered + 1, state.totalItems)} of ${state.totalItems}</span>
          <span>Ability estimate: <strong>θ = ${state.theta.toFixed(2)}</strong> <span class="se-note">± ${state.se.toFixed(2)}</span></span>
        </div>
        <div class="ability-bar"><div class="ability-fill" style="width:${pct}%"></div></div>
      </div>`;
  }

  function renderIntro() {
    container().innerHTML = `
      <div class="practice-intro">
        <div class="practice-badge">Adaptive practice · IRT-driven</div>
        <h2>String Indexing &amp; Slicing — Practice</h2>
        <p class="intro-lead">12 questions that <em>adapt to you</em>. Answer correctly and the questions get harder; struggle and they ease off. The engine estimates your ability after every answer using Item Response Theory.</p>
        <div class="intro-grid">
          <div class="intro-cell"><div class="intro-num">12</div><div>questions</div></div>
          <div class="intro-cell"><div class="intro-num">5</div><div>cognitive levels</div></div>
          <div class="intro-cell"><div class="intro-num">~25</div><div>minutes</div></div>
        </div>
        <p class="intro-note">Levels covered: Recall ·  Read · Debug · Approach · Implement — difficulty adjusts automatically.</p>
        <button class="btn-primary" onclick="Practice.start()">Start practice</button>
      </div>`;
  }

  function renderQuestion() {
    const item = state.current;
    const lvlColor = LEVEL_COLORS[item.level];

    let bodyHTML = "";
    if (item.code) bodyHTML += `<pre class="q-code">${esc(item.code)}</pre>`;

    let answerHTML = "";
    if (item.type === "mcq") {
      answerHTML = `<div class="opts">` + item.options.map((opt, i) =>
        `<button class="opt" onclick="Practice.submit(${i})"><span class="opt-key">${"ABCD"[i]}</span><span>${esc(opt)}</span></button>`
      ).join("") + `</div>`;
    } else {
      answerHTML = `
        <div class="text-answer">
          <input type="text" id="text-input" class="code-input" placeholder="${esc(item.placeholder || "your answer")}"
                 autocomplete="off" spellcheck="false"
                 onkeydown="if(event.key==='Enter')Practice.submitText()">
          <button class="btn-primary" onclick="Practice.submitText()">Submit</button>
        </div>`;
    }

    container().innerHTML = `
      ${abilityMeterHTML()}
      <div class="q-card">
        <div class="q-meta">
          <span class="q-level" style="--lvl:${lvlColor}">${item.level}</span>
          <span class="q-diff q-diff-${item.difficulty.toLowerCase()}">${item.difficulty}</span>
        </div>
        <div class="q-text">${esc(item.question)}</div>
        ${bodyHTML}
        ${answerHTML}
      </div>`;

    const input = document.getElementById("text-input");
    if (input) input.focus();
  }

  function submitText() {
    const input = document.getElementById("text-input");
    if (input) submit(input.value);
  }

  function renderFeedback(correct, answerGiven) {
    const item = state.current;
    const isLast = state.responses.length >= state.totalItems;

    let yourAnswer = "";
    if (item.type === "mcq") yourAnswer = item.options[answerGiven] !== undefined ? item.options[answerGiven] : "—";
    else yourAnswer = answerGiven || "—";

    let correctAnswer = item.type === "mcq" ? item.options[item.correct] : item.accepted[0];

    container().innerHTML = `
      ${abilityMeterHTML()}
      <div class="q-card feedback ${correct ? "fb-correct" : "fb-wrong"}">
        <div class="fb-verdict">${correct ? "✓ Correct" : "✗ Not quite"}</div>
        ${correct ? "" : `<div class="fb-row"><span class="fb-label">Your answer</span><code>${esc(String(yourAnswer))}</code></div>
        <div class="fb-row"><span class="fb-label">Correct answer</span><code>${esc(String(correctAnswer))}</code></div>`}
        <div class="fb-expl">${esc(item.explanation)}</div>
        <div class="fb-theta">Ability updated: θ = ${state.theta.toFixed(2)} <span class="se-note">(± ${state.se.toFixed(2)})</span></div>
        <button class="btn-primary" onclick="Practice.next()">${isLast ? "See results" : "Next question"}</button>
      </div>`;
  }

  function renderReport() {
    const band = IRT.masteryBand(state.theta);
    const score = IRT.masteryScore(state.theta);
    const nCorrect = state.responses.filter(r => r.correct).length;

    // Per-level breakdown
    const levels = Object.keys(PRACTICE_BLUEPRINT);
    const byLevel = levels.map(lv => {
      const rs = state.responses.filter(r => r.item.level === lv);
      const c = rs.filter(r => r.correct).length;
      return { lv, total: rs.length, correct: c };
    });

    // θ trajectory sparkline (SVG)
    const W = 560, H = 80, PAD = 6;
    const pts = [{ x: PAD, y: H / 2 }].concat(state.responses.map((r, i) => ({
      x: PAD + ((i + 1) / state.responses.length) * (W - 2 * PAD),
      y: H / 2 - (Math.max(-2, Math.min(2, r.thetaAfter)) / 2) * (H / 2 - PAD),
    })));
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const dots = state.responses.map((r, i) => {
      const p = pts[i + 1];
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${r.correct ? "#2EAE85" : "#D85A5A"}"/>`;
    }).join("");

    container().innerHTML = `
      <div class="report">
        <div class="practice-badge">Session complete</div>
        <h2>Your results</h2>

        <div class="report-hero">
          <div class="report-score">
            <div class="score-num">${score}</div>
            <div class="score-label">mastery score</div>
          </div>
          <div class="report-band">
            <div class="band-label">${band.label}</div>
            <div class="band-desc">${band.desc}</div>
            <div class="band-stats">θ = ${state.theta.toFixed(2)} ± ${state.se.toFixed(2)} &nbsp;·&nbsp; ${nCorrect}/${state.responses.length} correct</div>
          </div>
        </div>

        <h3>Ability trajectory</h3>
        <p class="traj-note">Your estimated ability after each question. Green dots = correct, red = incorrect. The line settling means the engine has homed in on your level.</p>
        <svg class="traj" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
          <line x1="${PAD}" y1="${H / 2}" x2="${W - PAD}" y2="${H / 2}" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="4 4"/>
          <path d="${path}" fill="none" stroke="#5B9BD5" stroke-width="2"/>
          ${dots}
        </svg>

        <h3>By cognitive level</h3>
        <div class="level-rows">
          ${byLevel.map(b => `
            <div class="level-row">
              <span class="level-name" style="--lvl:${LEVEL_COLORS[b.lv]}">${b.lv}</span>
              <div class="level-track"><div class="level-fill" style="width:${b.total ? (b.correct / b.total) * 100 : 0}%;background:${LEVEL_COLORS[b.lv]}"></div></div>
              <span class="level-count">${b.correct}/${b.total}</span>
            </div>`).join("")}
        </div>

        <h3>Question review</h3>
        <div class="review-list">
          ${state.responses.map((r, i) => `
            <details class="review-item ${r.correct ? "rv-correct" : "rv-wrong"}">
              <summary>
                <span class="rv-mark">${r.correct ? "✓" : "✗"}</span>
                <span class="rv-num">Q${i + 1}</span>
                <span class="rv-level" style="--lvl:${LEVEL_COLORS[r.item.level]}">${r.item.level} · ${r.item.difficulty}</span>
                <span class="rv-q">${esc(r.item.question.slice(0, 70))}${r.item.question.length > 70 ? "…" : ""}</span>
              </summary>
              <div class="rv-body">
                ${r.item.code ? `<pre class="q-code">${esc(r.item.code)}</pre>` : ""}
                <div class="fb-expl">${esc(r.item.explanation)}</div>
              </div>
            </details>`).join("")}
        </div>

        <div class="report-actions">
          <button class="btn-secondary" onclick="Practice.renderIntro()">Practice again</button>
          <button class="btn-primary" onclick="App.goToId('flashcards')">Continue to flashcards →</button>
        </div>
      </div>`;
  }

  return { renderIntro, start, submit, submitText, next };
})();
