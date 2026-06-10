// ════════════════════════════════════════════════════════════════════
// ITEM BANK — kp_001: apply programming basics to access and extract
// text using string indexing and slicing
// Generated per Mastery Agent content specs (run 20260604_172930)
// 27 items: Recall 6 · Read 6 · Debug 5 · Approach 4 · Implement 6
//
// IRT parameters (2PL):
//   b (difficulty) = levelOffset + difficultyOffset + jitter
//     levels:  Recall -0.8 · Read -0.4 · Debug 0.0 · Approach +0.3 · Implement +0.6
//     difficulty: Easy -0.6 · Medium 0.0 · Hard +0.6
//   a (discrimination): 0.9 – 1.6
//
// type: "mcq" (options + correct index) | "text" (free input + accepted answers)
// ════════════════════════════════════════════════════════════════════

const ITEM_BANK = [

  // ── RECALL · EASY · MCQ ×3 ─────────────────────────────────────────
  {
    id: "R-E-1", level: "Recall", difficulty: "Easy", type: "mcq",
    a: 1.1, b: -1.45,
    question: "In Python, what is an 'index'?",
    options: [
      "The position of a character in a string, starting from 0",
      "The length of a string",
      "A function that searches for substrings",
      "The number of words in a string"
    ],
    correct: 0,
    explanation: "An index is the position number of a character. Python uses 0-based indexing — the first character is at index 0."
  },
  {
    id: "R-E-2", level: "Recall", difficulty: "Easy", type: "mcq",
    a: 1.2, b: -1.35,
    question: "What is the index of the FIRST character in any Python string?",
    options: ["1", "0", "-1", "It depends on the string"],
    correct: 1,
    explanation: "Python indexing always starts at 0. The first character of every string is at index 0 — never 1."
  },
  {
    id: "R-E-3", level: "Recall", difficulty: "Easy", type: "mcq",
    a: 1.0, b: -1.40,
    question: "Which syntax accesses a single character of the string s?",
    options: ["s(2)", "s{2}", "s[2]", "s.2"],
    correct: 2,
    explanation: "Square brackets are Python's access operator for sequences: s[2] gives the character at index 2."
  },

  // ── RECALL · MEDIUM · MCQ ×2 ───────────────────────────────────────
  {
    id: "R-M-1", level: "Recall", difficulty: "Medium", type: "mcq",
    a: 1.3, b: -0.85,
    question: "What does the negative index -1 refer to in a Python string?",
    options: [
      "The first character",
      "An invalid index — negative numbers raise an error",
      "The last character of the string",
      "The character before the string starts"
    ],
    correct: 2,
    explanation: "Negative indices count from the end: -1 is the last character, -2 is second-to-last, and so on."
  },
  {
    id: "R-M-2", level: "Recall", difficulty: "Medium", type: "mcq",
    a: 1.2, b: -0.75,
    question: "In the slice s[start:stop], which characters are included?",
    options: [
      "From start through stop, both included",
      "From start up to but NOT including stop",
      "From start+1 through stop",
      "Exactly the characters at start and stop"
    ],
    correct: 1,
    explanation: "The stop index is exclusive. s[1:4] returns indices 1, 2, 3 — the character at index 4 is not included."
  },

  // ── RECALL · HARD · FILL ×1 ────────────────────────────────────────
  {
    id: "R-H-1", level: "Recall", difficulty: "Hard", type: "text",
    a: 1.4, b: -0.25,
    question: "Complete the code to extract characters from index 2 to 5 (exclusive) from string s:",
    code: "s = 'hello'\nresult = s[____]",
    placeholder: "fill the blank, e.g. 1:3",
    accepted: ["2:5"],
    explanation: "Slice notation is start:stop where stop is exclusive — s[2:5] gives indices 2, 3, 4."
  },

  // ── READ · EASY · MCQ ×3 ───────────────────────────────────────────
  {
    id: "D-E-1", level: "Read", difficulty: "Easy", type: "mcq",
    a: 1.1, b: -1.05,
    question: "What is the output of the following code?",
    code: "s = 'python'\nprint(s[0])",
    options: ["python", "p", "y", "Error"],
    correct: 1,
    explanation: "Index 0 is the first character — 'p'."
  },
  {
    id: "D-E-2", level: "Read", difficulty: "Easy", type: "mcq",
    a: 1.0, b: -0.95,
    question: "What is the output of the following code?",
    code: "s = 'hello'\nprint(s[4])",
    options: ["l", "o", "h", "Error"],
    correct: 1,
    explanation: "Counting from zero: h=0, e=1, l=2, l=3, o=4. Index 4 is 'o'."
  },
  {
    id: "D-E-3", level: "Read", difficulty: "Easy", type: "mcq",
    a: 1.2, b: -1.00,
    question: "What is the output of the following code?",
    code: "s = 'cat'\nprint(s[1])",
    options: ["c", "a", "t", "ca"],
    correct: 1,
    explanation: "Index 1 is the second character — 'a'. (c=0, a=1, t=2)"
  },

  // ── READ · MEDIUM · MCQ ×2 ─────────────────────────────────────────
  {
    id: "D-M-1", level: "Read", difficulty: "Medium", type: "mcq",
    a: 1.4, b: -0.40,
    question: "What is the output of the following code?",
    code: "s = 'abcdef'\nprint(s[1:5:2])",
    options: ["bd", "bdf", "bcde", "ace"],
    correct: 0,
    explanation: "Start at index 1 ('b'), stop before 5, step by 2 → indices 1 and 3 → 'bd'."
  },
  {
    id: "D-M-2", level: "Read", difficulty: "Medium", type: "mcq",
    a: 1.3, b: -0.35,
    question: "What is the output of the following code?",
    code: "s = 'python'\nprint(s[2:5])",
    options: ["tho", "thon", "yth", "ytho"],
    correct: 0,
    explanation: "Indices 2, 3, 4 (stop 5 is exclusive) → 't', 'h', 'o' → 'tho'."
  },

  // ── READ · HARD · TEXT (predict output) ×1 ─────────────────────────
  {
    id: "D-H-1", level: "Read", difficulty: "Hard", type: "text",
    a: 1.5, b: 0.25,
    question: "Predict the output of this code:",
    code: "s = 'programming'\nprint(s[-5:-1])",
    placeholder: "type the exact output",
    accepted: ["ammi"],
    explanation: "-5 is 'a' (index 6), -1 is 'g' (index 10, exclusive). So s[-5:-1] = s[6:10] = 'ammi'."
  },

  // ── DEBUG · EASY · MCQ ×2 ──────────────────────────────────────────
  {
    id: "B-E-1", level: "Debug", difficulty: "Easy", type: "mcq",
    a: 1.1, b: -0.65,
    question: "What is wrong with this code?",
    code: "s = 'hello'\nprint(s[5])",
    options: [
      "Nothing — it prints 'o'",
      "Index 5 is out of bounds; 'hello' has indices 0–4",
      "Strings cannot be indexed with print()",
      "The quotes should be double quotes"
    ],
    correct: 1,
    explanation: "'hello' has 5 characters at indices 0–4. Index 5 doesn't exist → IndexError."
  },
  {
    id: "B-E-2", level: "Debug", difficulty: "Easy", type: "mcq",
    a: 1.0, b: -0.55,
    question: "What is wrong with this code?",
    code: "s = 'hi'\nprint(s[-3])",
    options: [
      "Nothing — it prints 'h'",
      "Negative indices are not allowed in Python",
      "Index -3 is out of bounds; 'hi' only has indices -1 and -2",
      "It prints an empty string"
    ],
    correct: 2,
    explanation: "'hi' has 2 characters: valid negative indices are -1 ('i') and -2 ('h'). -3 is out of range → IndexError."
  },

  // ── DEBUG · MEDIUM · TEXT (fix the code) ×2 ────────────────────────
  {
    id: "B-M-1", level: "Debug", difficulty: "Medium", type: "text",
    a: 1.4, b: 0.05,
    question: "Fix the slice so it extracts every OTHER character starting from index 1 (expected result: 'bdf'):",
    code: "s = 'abcdef'\nresult = s[1:6:3]   # Bug: gives 'be', should give 'bdf'",
    placeholder: "write the corrected slice, e.g. s[1:4]",
    accepted: ["s[1:6:2]", "s[1::2]", "1:6:2", "1::2"],
    explanation: "The step should be 2, not 3. s[1::2] takes indices 1, 3, 5 → 'bdf'."
  },
  {
    id: "B-M-2", level: "Debug", difficulty: "Medium", type: "text",
    a: 1.3, b: 0.10,
    question: "The programmer wants the first three characters ('hel') but gets 'el'. Fix the slice:",
    code: "s = 'hello'\nresult = s[1:3]   # Bug: gives 'el', should give 'hel'",
    placeholder: "write the corrected slice",
    accepted: ["s[0:3]", "s[:3]", "0:3", ":3"],
    explanation: "First three characters are indices 0, 1, 2 → s[0:3] or the shorthand s[:3]."
  },

  // ── DEBUG · HARD · TEXT (fix the code) ×1 ──────────────────────────
  {
    id: "B-H-1", level: "Debug", difficulty: "Hard", type: "text",
    a: 1.5, b: 0.70,
    question: "Fix the code so it reverses the whole string (expected: 'olleh'):",
    code: "s = 'hello'\nresult = s[0::-1]   # Bug: produces 'h' only",
    placeholder: "write the corrected slice",
    accepted: ["s[::-1]", "::-1"],
    explanation: "s[0::-1] starts at index 0 and goes backwards — only 'h'. Omit start and stop entirely: s[::-1] reverses the whole string."
  },

  // ── APPROACH · EASY · MCQ ×2 (approach selection) ──────────────────
  {
    id: "A-E-1", level: "Approach", difficulty: "Easy", type: "mcq",
    a: 1.1, b: -0.35,
    question: "You have s = 'hello world' and need to extract 'world'. Which plan is correct?",
    options: [
      "'world' starts at index 6 — use s[6:11] or s[6:]",
      "'world' starts at index 5 — use s[5:10]",
      "Use s[-5:-1] to get the last five characters",
      "Split the string in half with s[:len(s)/2]"
    ],
    correct: 0,
    explanation: "Count the indices: 'h'=0 … space=5, 'w'=6. 'world' spans indices 6–10, so s[6:11], or simply s[6:] since it runs to the end."
  },
  {
    id: "A-E-2", level: "Approach", difficulty: "Easy", type: "mcq",
    a: 1.0, b: -0.25,
    question: "You need the domain from an email like 'user@example.com' — but different emails have different lengths. What's the right FIRST step?",
    options: [
      "Hardcode s[5:] since '@' is at index 4 in this example",
      "Find the position of '@' with s.index('@'), then slice from the character after it",
      "Always take the last 11 characters with s[-11:]",
      "Reverse the string and take the first part"
    ],
    correct: 1,
    explanation: "Because the username length varies, you must locate '@' dynamically: i = s.index('@'), then s[i+1:] gives the domain for any email."
  },

  // ── APPROACH · MEDIUM · MCQ ×1 ─────────────────────────────────────
  {
    id: "A-M-1", level: "Approach", difficulty: "Medium", type: "mcq",
    a: 1.3, b: 0.30,
    question: "Plan: extract every THIRD character, starting from the SECOND character of the string. Which slice does this?",
    options: ["s[2::3]", "s[1::3]", "s[1:3]", "s[3::1]"],
    correct: 1,
    explanation: "The second character is at index 1 (zero-based!). Start there, step by 3 → s[1::3]."
  },

  // ── APPROACH · HARD · MCQ ×1 ───────────────────────────────────────
  {
    id: "A-H-1", level: "Approach", difficulty: "Hard", type: "mcq",
    a: 1.5, b: 0.90,
    question: "You must extract the substring between the FIRST 'a' and the LAST 'z' in a string (positions unknown in advance). Which approach is correct?",
    options: [
      "start = s.find('a'); end = s.rfind('z'); result = s[start:end+1]",
      "start = s.find('a'); end = s.find('z'); result = s[start:end]",
      "result = s['a':'z'] — Python slices accept characters",
      "Loop through the string and concatenate characters between 'a' and 'z' alphabetically"
    ],
    correct: 0,
    explanation: "find() gets the first 'a', rfind() gets the last 'z'. Since stop is exclusive, end+1 includes the 'z' itself."
  },

  // ── IMPLEMENT · EASY · TEXT (write code) ×3 ────────────────────────
  {
    id: "I-E-1", level: "Implement", difficulty: "Easy", type: "text",
    a: 1.1, b: -0.10,
    question: "Complete the function so it returns the first 3 characters of s:",
    code: "def get_first_three(s):\n    return ____",
    placeholder: "fill the blank",
    accepted: ["s[:3]", "s[0:3]"],
    explanation: "s[:3] (or s[0:3]) slices from the start up to index 3, exclusive — exactly 3 characters."
  },
  {
    id: "I-E-2", level: "Implement", difficulty: "Easy", type: "text",
    a: 1.0, b: 0.00,
    question: "Complete the function so it returns the LAST character of s (must work for any length):",
    code: "def get_last(s):\n    return ____",
    placeholder: "fill the blank",
    accepted: ["s[-1]"],
    explanation: "s[-1] always gives the last character regardless of string length — that's the power of negative indexing."
  },
  {
    id: "I-E-3", level: "Implement", difficulty: "Easy", type: "text",
    a: 1.2, b: -0.05,
    question: "Complete the function so it returns the first character of s:",
    code: "def get_first(s):\n    return ____",
    placeholder: "fill the blank",
    accepted: ["s[0]"],
    explanation: "The first character is always at index 0."
  },

  // ── IMPLEMENT · MEDIUM · TEXT ×2 ───────────────────────────────────
  {
    id: "I-M-1", level: "Implement", difficulty: "Medium", type: "text",
    a: 1.4, b: 0.55,
    question: "Complete the function so it returns every other character of s, starting from the first:",
    code: "def every_other(s):\n    return ____",
    placeholder: "fill the blank",
    accepted: ["s[::2]", "s[0::2]"],
    explanation: "s[::2] starts at 0 (default), runs to the end (default), stepping by 2 — every other character."
  },
  {
    id: "I-M-2", level: "Implement", difficulty: "Medium", type: "text",
    a: 1.3, b: 0.65,
    question: "Complete the function so it returns the last 3 characters of s:",
    code: "def get_last_three(s):\n    return ____",
    placeholder: "fill the blank",
    accepted: ["s[-3:]"],
    explanation: "s[-3:] starts at the third-from-last character and runs to the end — the last 3 characters of any string."
  },

  // ── IMPLEMENT · HARD · TEXT ×1 ─────────────────────────────────────
  {
    id: "I-H-1", level: "Implement", difficulty: "Hard", type: "text",
    a: 1.6, b: 1.20,
    question: "Complete the function so it returns s reversed, using slicing only:",
    code: "def reverse_string(s):\n    return ____",
    placeholder: "fill the blank",
    accepted: ["s[::-1]"],
    explanation: "s[::-1] — empty start and stop cover the whole string; step -1 walks backwards. The classic Python reversal."
  },

];

// Blueprint from the MA practice_spec: 12 questions
// Level quotas enforced; difficulty floats adaptively via IRT.
const PRACTICE_BLUEPRINT = {
  Recall: 2,
  Read: 3,
  Debug: 2,
  Approach: 2,
  Implement: 3,
};

// In-video popup questions now handle immediate retrieval practice
// (PED-024), so no items are reserved — the full 27-item bank is
// available to the adaptive practice session.
const QUICK_CHECK_IDS = [];
