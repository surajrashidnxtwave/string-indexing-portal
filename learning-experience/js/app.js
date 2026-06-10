// ════════════════════════════════════════════════════════════════════
// LEARNING EXPERIENCE APP — v2
// Arc (revised after sequencing review):
//   1 motivation · 2 concept explainer · 3 worked examples ·
//   4 adaptive practice · 5 flashcards · 6 recap · 7 cheatsheet
//
// Changes from v1:
//  · Standalone quick-check removed — replaced by IN-VIDEO popup
//    questions (PED-024 Predict-then-Reveal, PED-003 Retrieval Practice)
//  · Cheatsheet moved to end as revision artifact + always available
//    via a persistent drawer (just-in-time reference during practice)
//  · Motivation video has NO popups (PED-003 boundary condition:
//    retrieval needs prior exposure — video 1 teaches no syntax)
// ════════════════════════════════════════════════════════════════════

const App = (() => {

  const STEPS = [
    { id: "motivation", label: "Why strings matter", kind: "video" },
    { id: "concept", label: "Indexes & slices explained", kind: "video" },
    { id: "worked", label: "Worked examples", kind: "video2" },
    { id: "practice", label: "Adaptive practice", kind: "practice" },
    { id: "flashcards", label: "Flashcards", kind: "flashcards" },
    { id: "recap", label: "Recap", kind: "video-recap" },
    { id: "cheatsheet", label: "Cheatsheet (keep this!)", kind: "cheatsheet" },
  ];

  const VIDEOS = {
    motivation: [{ key: "motivation", file: "videos/M1_T1_V01_motivation.mp4", title: "Why strings matter", dur: "~3 min" }],
    concept: [{ key: "concept", file: "videos/M1_T1_V02_concept_explainer.mp4", title: "Indexes and slices — the full picture", dur: "~3 min" }],
    worked: [
      { key: "worked3a", file: "videos/M1_T1_V03a_worked_indexing.mp4", title: "Worked example — accessing characters by index", dur: "~2 min" },
      { key: "worked3b", file: "videos/M1_T1_V03b_worked_slicing.mp4", title: "Worked example — slicing substrings", dur: "~2 min" },
    ],
    recap: [{ key: "recap", file: "videos/M1_T1_V04_recap.mp4", title: "Recap — key takeaways", dur: "~2 min" }],
  };

  // ── In-video questions (PED-024 Predict-then-Reveal) ─────────────
  // `at` = fraction of video duration (0–1), so cues work regardless
  // of the actual length of your generated video.
  // No entry for "motivation" — deliberately question-free (see header).
  const VIDEO_QUESTIONS = {
    concept: [
      {
        at: 0.40,
        question: "Quick check — s = 'python'. What does s[3] give?",
        options: ["t", "h", "o"],
        correct: 1,
        explanation: "Count from zero: p=0, y=1, t=2, h=3. Index 3 is 'h'.",
      },
      {
        at: 0.75,
        question: "Predict: what does s[1:4] return for s = 'python'?",
        options: ["yth", "ytho", "pyt"],
        correct: 0,
        explanation: "Indices 1, 2, 3 — the stop index (4) is exclusive. 'y', 't', 'h' → 'yth'.",
      },
    ],
    worked3a: [
      {
        at: 0.60,
        question: "Predict: word = 'programming'. What does word[-1] give?",
        options: ["p", "g", "an error"],
        correct: 1,
        explanation: "-1 is always the last character, regardless of string length — here, 'g'.",
      },
    ],
    worked3b: [
      {
        at: 0.60,
        question: "Predict: email = 'ada@python.org'. What does email[4:] give?",
        options: ["python.org", "ada", "@python.org"],
        correct: 0,
        explanation: "Start at index 4 ('p'), run to the end (stop blank) → 'python.org'.",
      },
    ],
    recap: [
      {
        at: 0.50,
        question: "s = 'hello'. What happens when you run s[0] = 'H'?",
        options: ["s becomes 'Hello'", "TypeError — strings are immutable", "Nothing"],
        correct: 1,
        explanation: "Strings can't be changed in place. To 'modify' one, build a new string: 'H' + s[1:].",
      },
    ],
  };

  let currentStep = 0;
  let completed = new Set();
  const firedCues = {};      // videoKey -> Set of fired cue indices

  // ── Persistence (graceful) ───────────────────────────────────────
  function saveProgress() {
    try { localStorage.setItem("sis-progress", JSON.stringify([...completed])); } catch (e) { /* in-memory only */ }
  }
  function loadProgress() {
    try {
      const raw = localStorage.getItem("sis-progress");
      if (raw) completed = new Set(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }

  // ── Navigation ───────────────────────────────────────────────────
  function goTo(i) {
    currentStep = Math.max(0, Math.min(STEPS.length - 1, i));
    render();
  }

  function goToId(id) {
    const i = STEPS.findIndex(s => s.id === id);
    if (i >= 0) goTo(i);
  }

  function markComplete(i, advance = true) {
    completed.add(STEPS[i].id);
    saveProgress();
    if (advance && i < STEPS.length - 1) goTo(i + 1);
    else render();
  }

  // ── Rendering ────────────────────────────────────────────────────
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function render() {
    renderSidebar();
    renderStep();
    window.scrollTo({ top: 0 });
  }

  function renderSidebar() {
    const nav = document.getElementById("arc-nav");
    nav.innerHTML = STEPS.map((s, i) => `
      <button class="nav-step ${i === currentStep ? "active" : ""} ${completed.has(s.id) ? "done" : ""}"
              onclick="App.goTo(${i})">
        <span class="nav-dot">${completed.has(s.id) ? "✓" : i + 1}</span>
        <span class="nav-label">${s.label}</span>
      </button>`).join("");

    const pct = Math.round((completed.size / STEPS.length) * 100);
    document.getElementById("arc-progress-fill").style.width = pct + "%";
    document.getElementById("arc-progress-label").textContent = pct + "% complete";
  }

  // ── Video block with popup-question machinery ─────────────────────
  function videoBlock(v) {
    const qs = VIDEO_QUESTIONS[v.key] || [];
    return `
      <div class="video-wrap" data-vkey="${v.key}">
        <div class="video-stage">
          <video controls preload="metadata"
                 oncanplay="this.closest('.video-wrap').classList.add('has-video')"
                 ontimeupdate="App.videoTick(this, '${v.key}')">
            <source src="${v.file}" type="video/mp4">
          </video>
          <div class="vq-overlay" id="vq-${v.key}"></div>
        </div>
        <div class="video-fallback">
          <div class="vf-icon">▶</div>
          <div class="vf-title">${esc(v.title)}</div>
          <div class="vf-note">Video not found. Drop your NotebookLM export into the <code>videos/</code> folder as:<br><code>${v.file.split("/")[1]}</code></div>
          ${qs.length ? `
            <div class="vf-questions">
              <div class="vf-q-head">This video's checkpoint question${qs.length > 1 ? "s" : ""} (shown as in-video popups once the file is added):</div>
              ${qs.map((q, qi) => inlineQuestionHTML(v.key, qi, q)).join("")}
            </div>` : ""}
        </div>
        <div class="video-caption">
          ${esc(v.title)} · ${v.dur}
          ${qs.length ? `<span class="vq-badge">${qs.length} in-video question${qs.length > 1 ? "s" : ""}</span>` : ""}
        </div>
      </div>`;
  }

  // Inline (fallback) version of a video question — same content,
  // rendered beneath the placeholder when the video file is missing.
  function inlineQuestionHTML(vkey, qi, q) {
    return `
      <div class="vq-inline" id="vqi-${vkey}-${qi}">
        <div class="vq-q">${esc(q.question)}</div>
        <div class="vq-opts">
          ${q.options.map((o, oi) =>
            `<button class="vq-opt" onclick="App.answerInline('${vkey}', ${qi}, ${oi})">${esc(o)}</button>`).join("")}
        </div>
        <div class="vq-fb" id="vqi-fb-${vkey}-${qi}"></div>
      </div>`;
  }

  function answerInline(vkey, qi, oi) {
    const q = VIDEO_QUESTIONS[vkey][qi];
    const box = document.getElementById(`vqi-${vkey}-${qi}`);
    const fb = document.getElementById(`vqi-fb-${vkey}-${qi}`);
    const correct = oi === q.correct;
    box.querySelectorAll(".vq-opt").forEach((b, j) => {
      b.disabled = true;
      if (j === q.correct) b.classList.add("vq-right");
      else if (j === oi) b.classList.add("vq-wrong");
    });
    fb.innerHTML = `<div class="${correct ? "vq-fb-right" : "vq-fb-wrong"}">${correct ? "✓ Correct." : "✗ Not quite."} ${esc(q.explanation)}</div>`;
  }

  // Popup machinery: fires when playback crosses a cue fraction.
  function videoTick(videoEl, vkey) {
    const qs = VIDEO_QUESTIONS[vkey];
    if (!qs || !videoEl.duration) return;
    if (!firedCues[vkey]) firedCues[vkey] = new Set();

    const frac = videoEl.currentTime / videoEl.duration;
    qs.forEach((q, qi) => {
      if (!firedCues[vkey].has(qi) && frac >= q.at) {
        firedCues[vkey].add(qi);
        videoEl.pause();
        showOverlayQuestion(vkey, qi, videoEl);
      }
    });
  }

  function showOverlayQuestion(vkey, qi, videoEl) {
    const q = VIDEO_QUESTIONS[vkey][qi];
    const overlay = document.getElementById(`vq-${vkey}`);
    overlay.classList.add("on");
    overlay.innerHTML = `
      <div class="vq-card">
        <div class="vq-kicker">Quick prediction</div>
        <div class="vq-q">${esc(q.question)}</div>
        <div class="vq-opts">
          ${q.options.map((o, oi) =>
            `<button class="vq-opt" onclick="App.answerOverlay('${vkey}', ${qi}, ${oi})">${esc(o)}</button>`).join("")}
        </div>
        <div class="vq-fb" id="vq-fb-${vkey}-${qi}"></div>
      </div>`;
  }

  function answerOverlay(vkey, qi, oi) {
    const q = VIDEO_QUESTIONS[vkey][qi];
    const overlay = document.getElementById(`vq-${vkey}`);
    const fb = document.getElementById(`vq-fb-${vkey}-${qi}`);
    const correct = oi === q.correct;
    overlay.querySelectorAll(".vq-opt").forEach((b, j) => {
      b.disabled = true;
      if (j === q.correct) b.classList.add("vq-right");
      else if (j === oi) b.classList.add("vq-wrong");
    });
    fb.innerHTML = `
      <div class="${correct ? "vq-fb-right" : "vq-fb-wrong"}">${correct ? "✓ Correct." : "✗ Not quite."} ${esc(q.explanation)}</div>
      <button class="btn-primary vq-resume" onclick="App.resumeVideo('${vkey}')">Continue watching ▶</button>`;
  }

  function resumeVideo(vkey) {
    const wrap = document.querySelector(`.video-wrap[data-vkey="${vkey}"]`);
    const overlay = document.getElementById(`vq-${vkey}`);
    overlay.classList.remove("on");
    overlay.innerHTML = "";
    const video = wrap.querySelector("video");
    if (video) video.play();
  }

  // ── Step rendering ────────────────────────────────────────────────
  function renderStep() {
    const main = document.getElementById("step-content");
    const step = STEPS[currentStep];

    switch (step.kind) {

      case "video":
      case "video-recap": {
        const vids = step.id === "recap" ? VIDEOS.recap : VIDEOS[step.id];
        const hasQs = vids.some(v => (VIDEO_QUESTIONS[v.key] || []).length);
        main.innerHTML = `
          <div class="step-head">
            <div class="step-kicker">Step ${currentStep + 1} · Video</div>
            <h2>${step.label}</h2>
            ${hasQs ? `<p class="step-lead">This video pauses at key moments to ask you a quick prediction — answer, see why, keep watching.</p>` : ""}
          </div>
          ${vids.map(videoBlock).join("")}
          ${step.id === "recap" ? `
            <div class="recap-points">
              <h3>The five takeaways</h3>
              <ol>
                <li>Every character has an index, starting at <strong>0</strong>. <code>s[0]</code> is first, <code>s[-1]</code> is last.</li>
                <li>Square brackets give access — one number, one character.</li>
                <li>A colon gives a range: <code>s[start:stop]</code> — and the <strong>stop is exclusive</strong>.</li>
                <li>Slicing is safe — out-of-bounds slices never crash.</li>
                <li>Strings are <strong>immutable</strong> — slicing returns a new string, never modifies the original.</li>
              </ol>
            </div>` : ""}
          <button class="btn-primary step-done-btn" onclick="App.markComplete(${currentStep})">Mark complete & continue →</button>`;
        break;
      }

      case "video2": {
        main.innerHTML = `
          <div class="step-head">
            <div class="step-kicker">Step ${currentStep + 1} · Worked examples</div>
            <h2>${step.label}</h2>
            <p class="step-lead">Watch an expert solve two real problems. Notice the habit: <em>map the index grid before writing any code.</em> Each video pauses once to ask you to predict — that moment of prediction is where the learning sticks.</p>
          </div>
          ${VIDEOS.worked.map(videoBlock).join("")}
          <button class="btn-primary step-done-btn" onclick="App.markComplete(${currentStep})">Mark complete & continue →</button>`;
        break;
      }

      case "practice": {
        main.innerHTML = `
          <div class="step-head">
            <div class="step-kicker">Step ${currentStep + 1} · Practice session</div>
          </div>
          <div class="practice-hint">Stuck on syntax? The <strong>cheatsheet</strong> is one click away — bottom-right corner. Using a reference is a skill, not a cheat.</div>
          <div id="practice-root"></div>`;
        Practice.renderIntro();
        break;
      }

      case "flashcards": {
        completed.add("practice"); saveProgress(); renderSidebar();
        renderFlashcards(main);
        break;
      }

      case "cheatsheet": {
        renderCheatsheet(main);
        break;
      }
    }
  }

  // ── Cheatsheet (content shared by step + drawer) ─────────────────
  function cheatsheetCardsHTML() {
    return `
      <div class="cs-grid2">
        <section class="cs-card">
          <h3>Indexing</h3>
          <pre class="q-code">s = "python"

s[0]    # 'p'  — first character
s[2]    # 't'
s[5]    # 'n'  — last (length−1)</pre>
          <div class="cs-note">Indices start at <strong>0</strong>. For a string of length n, valid indices are 0 to n−1.</div>
        </section>

        <section class="cs-card">
          <h3>Negative indexing</h3>
          <pre class="q-code">s = "python"

s[-1]   # 'n'  — last character
s[-2]   # 'o'  — second to last
s[-6]   # 'p'  — same as s[0]</pre>
          <div class="cs-note">Count backwards from the end, starting at −1. Works on strings of any length.</div>
        </section>

        <section class="cs-card">
          <h3>Slicing</h3>
          <pre class="q-code">s[start:stop]       # stop EXCLUSIVE
s[1:4]    # 'yth' — indices 1,2,3
s[:3]     # 'pyt' — from start
s[3:]     # 'hon' — to end
s[:]      # 'python' — full copy</pre>
          <div class="cs-note">Slice length = stop − start. Leave either side blank for the default.</div>
        </section>

        <section class="cs-card">
          <h3>Step</h3>
          <pre class="q-code">s[start:stop:step]

s[::2]    # 'pto'    — every 2nd
s[1::2]   # 'yhn'    — every 2nd, from 1
s[::-1]   # 'nohtyp' — REVERSED</pre>
          <div class="cs-note">A negative step walks backwards. <code>s[::-1]</code> is the canonical one-line reversal.</div>
        </section>

        <section class="cs-card">
          <h3>Common patterns</h3>
          <pre class="q-code">s[:3]      # first 3 characters
s[-3:]     # last 3 characters
s[1:-1]    # strip first &amp; last
s[::-1]    # reverse
s[i:i+n]   # n chars from index i</pre>
        </section>

        <section class="cs-card">
          <h3>Edge cases &amp; gotchas</h3>
          <pre class="q-code">s = "python"   # length 6

s[10]      # ✗ IndexError!
s[2:100]   # ✓ 'thon' — slices are safe
s[4:2]     # ✓ ''     — empty, no error
s[0] = "P" # ✗ TypeError — immutable!
"P"+s[1:]  # ✓ build a new string</pre>
          <div class="cs-note"><strong>Indexing</strong> out of bounds crashes; <strong>slicing</strong> out of bounds doesn't. Strings can never be modified in place.</div>
        </section>
      </div>`;
  }

  function renderCheatsheet(main) {
    main.innerHTML = `
      <div class="step-head">
        <div class="step-kicker">Step ${currentStep + 1} · Your revision reference</div>
        <h2>String Indexing &amp; Slicing — Cheatsheet</h2>
        <p class="step-lead">This is your take-away artifact. Bookmark it, print it, come back to it whenever you need a quick syntax check. It's also available anytime from the button in the corner.</p>
      </div>
      ${cheatsheetCardsHTML()}
      <button class="btn-primary step-done-btn" onclick="App.markComplete(${currentStep}, false)">Finish topic ✓</button>`;
  }

  // ── Cheatsheet drawer (always available) ─────────────────────────
  function toggleDrawer() {
    document.getElementById("cs-drawer").classList.toggle("open");
    document.getElementById("cs-drawer-backdrop").classList.toggle("on");
  }

  function initDrawer() {
    const drawer = document.createElement("div");
    drawer.innerHTML = `
      <button class="cs-fab" onclick="App.toggleDrawer()" title="Open cheatsheet">≡ Cheatsheet</button>
      <div class="cs-drawer-backdrop" id="cs-drawer-backdrop" onclick="App.toggleDrawer()"></div>
      <aside class="cs-drawer" id="cs-drawer">
        <div class="cs-drawer-head">
          <strong>Quick reference</strong>
          <button class="cs-drawer-close" onclick="App.toggleDrawer()">✕</button>
        </div>
        <div class="cs-drawer-body">${cheatsheetCardsHTML()}</div>
      </aside>`;
    document.body.appendChild(drawer);
  }

  // ── Flashcards ───────────────────────────────────────────────────
  const FLASHCARDS = [
    { front: "index", back: "The position number of a character in a string. Zero-based: the first character is at index 0." },
    { front: "slice", back: "A substring extracted with s[start:stop] — includes start, excludes stop." },
    { front: "negative index", back: "Counts from the end of the string. s[-1] is the last character, s[-2] second-to-last." },
    { front: "step", back: "The third slice parameter: s[start:stop:step]. Controls the jump between characters. Negative step walks backwards." },
    { front: "immutable", back: "Cannot be changed in place. Strings are immutable — indexing and slicing always return NEW strings." },
    { front: "s = 'slice'\ns[1:4] → ?", back: "'lic' — indices 1, 2, 3. The stop index (4) is exclusive.", mono: true },
    { front: "s = 'slice'\ns[::-1] → ?", back: "'ecils' — step −1 reverses the whole string.", mono: true },
    { front: "s = 'slice'\ns[-2] → ?", back: "'c' — second character from the end.", mono: true },
  ];

  let fcIndex = 0, fcFlipped = false;

  function renderFlashcards(main) {
    const card = FLASHCARDS[fcIndex];
    main.innerHTML = `
      <div class="step-head">
        <div class="step-kicker">Step ${currentStep + 1} · Flashcards · ${fcIndex + 1} of ${FLASHCARDS.length}</div>
        <h2>Vocabulary &amp; code prediction</h2>
        <p class="step-lead">Click the card to flip it. Say the answer out loud before flipping — retrieval is the point.</p>
      </div>

      <div class="fc-stage">
        <div class="fc-card ${fcFlipped ? "flipped" : ""}" onclick="App.fcFlip()">
          <div class="fc-face fc-front ${card.mono ? "fc-mono" : ""}">${esc(card.front)}</div>
          <div class="fc-face fc-back">${esc(card.back)}</div>
        </div>
      </div>

      <div class="fc-controls">
        <button class="btn-secondary" onclick="App.fcPrev()" ${fcIndex === 0 ? "disabled" : ""}>← Prev</button>
        <span class="fc-dots">${FLASHCARDS.map((_, i) => `<span class="fc-dot ${i === fcIndex ? "on" : ""}"></span>`).join("")}</span>
        <button class="btn-secondary" onclick="App.fcNext()" ${fcIndex === FLASHCARDS.length - 1 ? "disabled" : ""}>Next →</button>
      </div>

      <button class="btn-primary step-done-btn" onclick="App.markComplete(${currentStep})">Mark complete & continue →</button>`;
  }

  function fcFlip() { fcFlipped = !fcFlipped; renderStep(); }
  function fcNext() { if (fcIndex < FLASHCARDS.length - 1) { fcIndex++; fcFlipped = false; renderStep(); } }
  function fcPrev() { if (fcIndex > 0) { fcIndex--; fcFlipped = false; renderStep(); } }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    loadProgress();
    initDrawer();
    render();
  }

  return {
    init, goTo, goToId, markComplete, toggleDrawer,
    videoTick, answerOverlay, answerInline, resumeVideo,
    fcFlip, fcNext, fcPrev,
  };
})();

document.addEventListener("DOMContentLoaded", App.init);
