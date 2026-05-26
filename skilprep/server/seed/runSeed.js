require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Field = require('../src/models/Field');
const Problem = require('../src/models/Problem');
const TestCase = require('../src/models/TestCase');
const Submission = require('../src/models/Submission');
const Comment = require('../src/models/Comment');
const Community = require('../src/models/Community');
const CommunityTest = require('../src/models/CommunityTest');
const CommunitySubmission = require('../src/models/CommunitySubmission');
const CommunityResource = require('../src/models/CommunityResource');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Field.deleteMany({}),
    Problem.deleteMany({}),
    TestCase.deleteMany({}),
    Submission.deleteMany({}),
    Comment.deleteMany({}),
    Community.deleteMany({}),
    CommunityTest.deleteMany({}),
    CommunitySubmission.deleteMany({}),
    CommunityResource.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Create presentation users
  const seededUsers = await User.insertMany([
    {
      username: 'admin',
      email: 'admin@skilprep.local',
      passwordHash: await bcrypt.hash('admin123', 12),
      role: 'admin',
      bio: 'Platform administrator account for demos',
      avatar: 'https://api.dicebear.com/8.x/bottts/svg?seed=admin',
    },
    {
      username: 'alice_dev',
      email: 'alice@skilprep.local',
      passwordHash: await bcrypt.hash('demo1234', 12),
      role: 'user',
      bio: 'Competitive programmer focusing on algorithms',
      avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=alice',
    },
    {
      username: 'bob_math',
      email: 'bob@skilprep.local',
      passwordHash: await bcrypt.hash('demo1234', 12),
      role: 'user',
      bio: 'Math enthusiast and puzzle lover',
      avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=bob',
    },
    {
      username: 'charlie_science',
      email: 'charlie@skilprep.local',
      passwordHash: await bcrypt.hash('demo1234', 12),
      role: 'user',
      bio: 'Science quiz specialist',
      avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=charlie',
    },
    {
      username: 'diana_logic',
      email: 'diana@skilprep.local',
      passwordHash: await bcrypt.hash('demo1234', 12),
      role: 'user',
      bio: 'Pattern recognition and logic puzzle solver',
      avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=diana',
    },
    {
      username: 'eva_rookie',
      email: 'eva@skilprep.local',
      passwordHash: await bcrypt.hash('demo1234', 12),
      role: 'user',
      bio: 'New learner account for onboarding demo',
      avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=eva',
    },
  ]);
  const [admin, alice, bob, charlie, diana, eva] = seededUsers;
  console.log('Created presentation users (admin + 5 learners)');

  // Create fields
  const fields = await Field.insertMany([
    {
      slug: 'coding',
      name: 'Coding (DSA)',
      description: 'Data structures, algorithms, and system design challenges',
      icon: '{ }',
      color: '#3B82F6',
      solverType: 'code',
      config: { supportedLanguages: ['python', 'javascript', 'cpp', 'java'], defaultLanguage: 'python', timeoutMs: 5000, memoryLimitMb: 256 },
      sortOrder: 1,
    },
    {
      slug: 'math',
      name: 'Mathematics',
      description: 'Algebra, calculus, number theory, and more',
      icon: '∑',
      color: '#8B5CF6',
      solverType: 'math',
      config: { allowLatex: true, tolerance: 0.001 },
      sortOrder: 2,
    },
    {
      slug: 'science',
      name: 'Science',
      description: 'Physics, chemistry, biology questions',
      icon: '⚛',
      color: '#10B981',
      solverType: 'mcq',
      config: { allowMultipleCorrect: false },
      sortOrder: 3,
    },
    {
      slug: 'logic',
      name: 'Logic & Puzzles',
      description: 'Brain teasers, logical reasoning, and puzzles',
      icon: '◈',
      color: '#F59E0B',
      solverType: 'short_answer',
      config: { maxAttempts: 0 },
      sortOrder: 4,
    },
    {
      slug: 'general-knowledge',
      name: 'General Knowledge',
      description: 'History, geography, literature, and trivia',
      icon: '?',
      color: '#EF4444',
      solverType: 'mcq',
      config: { allowMultipleCorrect: false },
      sortOrder: 5,
    },
  ]);
  console.log(`Created ${fields.length} fields`);

  const [coding, math, science, logic, gk] = fields;

  // ===== CODING PROBLEMS =====
  const codingProblems = await Problem.insertMany([
    {
      title: 'Two Sum',
      slug: 'two-sum',
      field: coding._id,
      difficulty: 'easy',
      tags: ['arrays', 'hash-map'],
      description: '## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n### Example\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```\n\n### Constraints\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9',
      content: {
        starterCode: {
          python: 'def two_sum(nums, target):\n    # Your code here\n    pass\n\n# Read input\nimport json, sys\ndata = sys.stdin.read().split("\\n")\nnums = json.loads(data[0])\ntarget = int(data[1])\nprint(json.dumps(two_sum(nums, target)))',
          javascript: 'function twoSum(nums, target) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", l => lines.push(l));\nrl.on("close", () => {\n    const nums = JSON.parse(lines[0]);\n    const target = parseInt(lines[1]);\n    console.log(JSON.stringify(twoSum(nums, target)));\n});',
        },
        constraints: '2 <= nums.length <= 10^4',
        examples: [
          { input: '[2,7,11,15]\n9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
        ],
      },
      baseScore: 10,
      authorId: admin._id,
    },
    {
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      field: coding._id,
      difficulty: 'easy',
      tags: ['stack', 'string'],
      description: '## Valid Parentheses\n\nGiven a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nA string is valid if:\n- Open brackets are closed by the same type of brackets.\n- Open brackets are closed in the correct order.\n\n### Example\n```\nInput: s = "()[]{}"\nOutput: true\n```\n\n### Constraints\n- 1 <= s.length <= 10^4',
      content: {
        starterCode: {
          python: 'def is_valid(s):\n    # Your code here\n    pass\n\nimport sys\ns = sys.stdin.read().strip()\nprint(str(is_valid(s)).lower())',
          javascript: 'function isValid(s) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", s => {\n    console.log(isValid(s.trim()));\n    rl.close();\n});',
        },
        constraints: '1 <= s.length <= 10^4',
        examples: [
          { input: '()[]{}\n', output: 'true', explanation: 'All brackets are matched' },
          { input: '(]\n', output: 'false', explanation: 'Mismatched brackets' },
        ],
      },
      baseScore: 10,
      authorId: admin._id,
    },
    {
      title: 'Merge Two Sorted Lists',
      slug: 'merge-two-sorted-lists',
      field: coding._id,
      difficulty: 'medium',
      tags: ['linked-list', 'recursion'],
      description: '## Merge Two Sorted Lists\n\nGiven two sorted arrays, merge them into one sorted array.\n\n### Example\n```\nInput: [1,2,4] and [1,3,4]\nOutput: [1,1,2,3,4,4]\n```\n\n### Constraints\n- 0 <= list length <= 50',
      content: {
        starterCode: {
          python: 'def merge_sorted(list1, list2):\n    # Your code here\n    pass\n\nimport json, sys\ndata = sys.stdin.read().split("\\n")\nlist1 = json.loads(data[0])\nlist2 = json.loads(data[1])\nprint(json.dumps(merge_sorted(list1, list2)))',
          javascript: 'function mergeSorted(list1, list2) {\n    // Your code here\n}\n\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", l => lines.push(l));\nrl.on("close", () => {\n    console.log(JSON.stringify(mergeSorted(JSON.parse(lines[0]), JSON.parse(lines[1]))));\n});',
        },
        constraints: '0 <= list length <= 50',
        examples: [
          { input: '[1,2,4]\n[1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merge and sort' },
        ],
      },
      baseScore: 20,
      authorId: admin._id,
    },
  ]);

  // Test cases for coding problems
  await TestCase.insertMany([
    // Two Sum
    { problem: codingProblems[0]._id, input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isSample: true, sortOrder: 0 },
    { problem: codingProblems[0]._id, input: '[3,2,4]\n6', expectedOutput: '[1,2]', isSample: false, sortOrder: 1 },
    { problem: codingProblems[0]._id, input: '[3,3]\n6', expectedOutput: '[0,1]', isSample: false, sortOrder: 2 },
    // Valid Parentheses
    { problem: codingProblems[1]._id, input: '()[]{}', expectedOutput: 'true', isSample: true, sortOrder: 0 },
    { problem: codingProblems[1]._id, input: '(]', expectedOutput: 'false', isSample: true, sortOrder: 1 },
    { problem: codingProblems[1]._id, input: '([{}])', expectedOutput: 'true', isSample: false, sortOrder: 2 },
    { problem: codingProblems[1]._id, input: '', expectedOutput: 'true', isSample: false, sortOrder: 3 },
    // Merge Two Sorted Lists
    { problem: codingProblems[2]._id, input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]', isSample: true, sortOrder: 0 },
    { problem: codingProblems[2]._id, input: '[]\n[]', expectedOutput: '[]', isSample: false, sortOrder: 1 },
    { problem: codingProblems[2]._id, input: '[]\n[0]', expectedOutput: '[0]', isSample: false, sortOrder: 2 },
  ]);

  // ===== MATH PROBLEMS =====
  const mathProblems = await Problem.insertMany([
    {
      title: 'Solve Quadratic Equation',
      slug: 'solve-quadratic',
      field: math._id,
      difficulty: 'easy',
      tags: ['algebra', 'quadratic'],
      description: '## Solve Quadratic Equation\n\nFind the positive root of the equation:\n\n**x² - 5x + 6 = 0**\n\nEnter the larger root.',
      content: { correctAnswer: '3', answerType: 'numeric', hints: ['Factor the equation', 'x² - 5x + 6 = (x-2)(x-3)'] },
      baseScore: 10,
      authorId: admin._id,
    },
    {
      title: 'Arithmetic Series Sum',
      slug: 'arithmetic-series-sum',
      field: math._id,
      difficulty: 'medium',
      tags: ['series', 'arithmetic'],
      description: '## Arithmetic Series Sum\n\nFind the sum of the first 100 natural numbers.\n\nUse the formula: S = n(n+1)/2',
      content: { correctAnswer: '5050', answerType: 'numeric', hints: ['S = 100 × 101 / 2'] },
      baseScore: 20,
      authorId: admin._id,
    },
    {
      title: 'Derivative of x³',
      slug: 'derivative-x-cubed',
      field: math._id,
      difficulty: 'easy',
      tags: ['calculus', 'derivatives'],
      description: '## Derivative\n\nWhat is the derivative of f(x) = x³ ?\n\nEnter the coefficient and power in the form: `ax^b` (e.g., `3x^2`)',
      content: { correctAnswer: '3x^2', answerType: 'expression', acceptableAnswers: ['3x^2', '3x²', '3*x^2'] },
      baseScore: 10,
      authorId: admin._id,
    },
  ]);

  // ===== SCIENCE PROBLEMS =====
  const scienceProblems = await Problem.insertMany([
    {
      title: "Newton's Second Law",
      slug: 'newtons-second-law',
      field: science._id,
      difficulty: 'easy',
      tags: ['physics', 'mechanics'],
      description: "## Newton's Second Law\n\nWhich equation correctly represents Newton's Second Law of Motion?",
      content: {
        choices: [
          { label: 'A', text: 'F = mv' },
          { label: 'B', text: 'F = ma' },
          { label: 'C', text: 'F = mg' },
          { label: 'D', text: 'F = mv²/r' },
        ],
        correctChoices: [1],
        explanation: "Newton's Second Law states that Force equals mass times acceleration (F = ma).",
      },
      baseScore: 10,
      authorId: admin._id,
    },
    {
      title: 'Chemical Bonding',
      slug: 'chemical-bonding',
      field: science._id,
      difficulty: 'medium',
      tags: ['chemistry', 'bonding'],
      description: '## Chemical Bonding\n\nWhat type of bond is formed when electrons are shared between two atoms?',
      content: {
        choices: [
          { label: 'A', text: 'Ionic bond' },
          { label: 'B', text: 'Metallic bond' },
          { label: 'C', text: 'Covalent bond' },
          { label: 'D', text: 'Hydrogen bond' },
        ],
        correctChoices: [2],
        explanation: 'A covalent bond is formed when two atoms share one or more pairs of electrons.',
      },
      baseScore: 20,
      authorId: admin._id,
    },
    {
      title: 'DNA Structure',
      slug: 'dna-structure',
      field: science._id,
      difficulty: 'hard',
      tags: ['biology', 'genetics'],
      description: '## DNA Structure\n\nIn DNA, adenine (A) pairs with which nucleotide base?',
      content: {
        choices: [
          { label: 'A', text: 'Cytosine (C)' },
          { label: 'B', text: 'Guanine (G)' },
          { label: 'C', text: 'Thymine (T)' },
          { label: 'D', text: 'Uracil (U)' },
        ],
        correctChoices: [2],
        explanation: 'In DNA, Adenine (A) always pairs with Thymine (T) through two hydrogen bonds. In RNA, A pairs with Uracil (U).',
      },
      baseScore: 30,
      authorId: admin._id,
    },
  ]);

  // ===== LOGIC PROBLEMS =====
  const logicProblems = await Problem.insertMany([
    {
      title: 'Next in Sequence',
      slug: 'next-in-sequence',
      field: logic._id,
      difficulty: 'easy',
      tags: ['sequence', 'pattern'],
      description: '## Next in Sequence\n\nWhat is the next number in this sequence?\n\n**2, 6, 12, 20, 30, ?**\n\nEnter just the number.',
      content: { acceptableAnswers: ['42'], caseSensitive: false, explanation: 'The differences are 4, 6, 8, 10, 12. Each difference increases by 2. So 30 + 12 = 42.' },
      baseScore: 10,
      authorId: admin._id,
    },
    {
      title: 'River Crossing',
      slug: 'river-crossing',
      field: logic._id,
      difficulty: 'medium',
      tags: ['puzzle', 'classic'],
      description: '## River Crossing Puzzle\n\nA farmer needs to cross a river with a fox, a chicken, and a bag of grain. The boat can only carry the farmer and one item. If left alone, the fox will eat the chicken, and the chicken will eat the grain.\n\nWhat should the farmer take across FIRST?\n\nAnswer: chicken, fox, or grain',
      content: { acceptableAnswers: ['chicken', 'the chicken', 'hen'], caseSensitive: false, explanation: 'The farmer must take the chicken first, because the fox won\'t eat the grain.' },
      baseScore: 20,
      authorId: admin._id,
    },
    {
      title: 'Light Switches',
      slug: 'light-switches',
      field: logic._id,
      difficulty: 'hard',
      tags: ['puzzle', 'lateral-thinking'],
      description: '## Light Switches\n\nYou are outside a room with 3 light switches. One controls a bulb inside the room. You can flip switches as many times as you want, but you can only enter the room once.\n\nHow many switches do you need to flip to determine which switch controls the bulb?\n\nEnter just the number.',
      content: { acceptableAnswers: ['2', 'two'], caseSensitive: false, explanation: 'Turn switch 1 ON for a few minutes, then turn it OFF and turn switch 2 ON. Enter the room: if the bulb is on, it\'s switch 2. If off and warm, it\'s switch 1. If off and cold, it\'s switch 3.' },
      baseScore: 30,
      authorId: admin._id,
    },
  ]);

  // ===== GENERAL KNOWLEDGE =====
  const gkProblems = await Problem.insertMany([
    {
      title: 'World Capitals',
      slug: 'world-capitals',
      field: gk._id,
      difficulty: 'easy',
      tags: ['geography', 'capitals'],
      description: '## World Capitals\n\nWhat is the capital of Australia?',
      content: {
        choices: [
          { label: 'A', text: 'Sydney' },
          { label: 'B', text: 'Melbourne' },
          { label: 'C', text: 'Canberra' },
          { label: 'D', text: 'Perth' },
        ],
        correctChoices: [2],
        explanation: 'Canberra is the capital of Australia, not Sydney or Melbourne as many people assume.',
      },
      baseScore: 10,
      authorId: admin._id,
    },
    {
      title: 'Nobel Prize in Physics',
      slug: 'nobel-physics',
      field: gk._id,
      difficulty: 'medium',
      tags: ['science', 'history', 'nobel'],
      description: '## Nobel Prize\n\nWho received the Nobel Prize in Physics for the discovery of the photoelectric effect?',
      content: {
        choices: [
          { label: 'A', text: 'Niels Bohr' },
          { label: 'B', text: 'Albert Einstein' },
          { label: 'C', text: 'Max Planck' },
          { label: 'D', text: 'Werner Heisenberg' },
        ],
        correctChoices: [1],
        explanation: 'Albert Einstein received the 1921 Nobel Prize in Physics for his explanation of the photoelectric effect.',
      },
      baseScore: 20,
      authorId: admin._id,
    },
    {
      title: 'Ancient Civilizations',
      slug: 'ancient-civilizations',
      field: gk._id,
      difficulty: 'hard',
      tags: ['history', 'ancient'],
      description: '## Ancient Civilizations\n\nWhich ancient civilization built the city of Machu Picchu?',
      content: {
        choices: [
          { label: 'A', text: 'Aztec' },
          { label: 'B', text: 'Maya' },
          { label: 'C', text: 'Inca' },
          { label: 'D', text: 'Olmec' },
        ],
        correctChoices: [2],
        explanation: 'Machu Picchu was built by the Inca civilization in the 15th century, located in modern-day Peru.',
      },
      baseScore: 30,
      authorId: admin._id,
    },
  ]);

  const totalProblems = await Problem.countDocuments();
  const allProblems = [
    ...codingProblems,
    ...mathProblems,
    ...scienceProblems,
    ...logicProblems,
    ...gkProblems,
  ];

  const problemBySlug = new Map(allProblems.map((problem) => [problem.slug, problem]));

  const submissions = await Submission.insertMany([
    {
      user: alice._id,
      problem: problemBySlug.get('two-sum')._id,
      field: coding._id,
      answer: { language: 'python', code: 'print([0,1])' },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 18,
    },
    {
      user: alice._id,
      problem: problemBySlug.get('valid-parentheses')._id,
      field: coding._id,
      answer: { language: 'javascript', code: 'console.log(true)' },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 29,
    },
    {
      user: alice._id,
      problem: problemBySlug.get('merge-two-sorted-lists')._id,
      field: coding._id,
      answer: { language: 'python', code: 'print([1,1,2,3,4,4])' },
      kind: 'submission',
      status: 'accepted',
      score: 20,
      executionTimeMs: 34,
    },
    {
      user: bob._id,
      problem: problemBySlug.get('solve-quadratic')._id,
      field: math._id,
      answer: { value: '3' },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 0,
    },
    {
      user: bob._id,
      problem: problemBySlug.get('arithmetic-series-sum')._id,
      field: math._id,
      answer: { value: '5050' },
      kind: 'submission',
      status: 'accepted',
      score: 20,
      executionTimeMs: 0,
    },
    {
      user: bob._id,
      problem: problemBySlug.get('derivative-x-cubed')._id,
      field: math._id,
      answer: { value: '3x^2' },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 0,
    },
    {
      user: charlie._id,
      problem: problemBySlug.get('newtons-second-law')._id,
      field: science._id,
      answer: { choices: [1] },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 0,
    },
    {
      user: charlie._id,
      problem: problemBySlug.get('chemical-bonding')._id,
      field: science._id,
      answer: { choices: [2] },
      kind: 'submission',
      status: 'accepted',
      score: 20,
      executionTimeMs: 0,
    },
    {
      user: diana._id,
      problem: problemBySlug.get('next-in-sequence')._id,
      field: logic._id,
      answer: { value: '42' },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 0,
    },
    {
      user: diana._id,
      problem: problemBySlug.get('river-crossing')._id,
      field: logic._id,
      answer: { value: 'chicken' },
      kind: 'submission',
      status: 'accepted',
      score: 20,
      executionTimeMs: 0,
    },
    {
      user: diana._id,
      problem: problemBySlug.get('light-switches')._id,
      field: logic._id,
      answer: { value: '2' },
      kind: 'submission',
      status: 'accepted',
      score: 30,
      executionTimeMs: 0,
    },
    {
      user: eva._id,
      problem: problemBySlug.get('world-capitals')._id,
      field: gk._id,
      answer: { choices: [0] },
      kind: 'submission',
      status: 'wrong_answer',
      score: 0,
      executionTimeMs: 0,
    },
    {
      user: eva._id,
      problem: problemBySlug.get('world-capitals')._id,
      field: gk._id,
      answer: { choices: [2] },
      kind: 'submission',
      status: 'accepted',
      score: 10,
      executionTimeMs: 0,
    },
    {
      user: admin._id,
      problem: problemBySlug.get('nobel-physics')._id,
      field: gk._id,
      answer: { choices: [1] },
      kind: 'submission',
      status: 'accepted',
      score: 20,
      executionTimeMs: 0,
    },
  ]);

  await Comment.insertMany([
    {
      problem: problemBySlug.get('two-sum')._id,
      author: alice._id,
      body: 'Great warm-up problem. Hash map solution works in linear time.',
      upvotes: 2,
      downvotes: 0,
      upvotedBy: [bob._id, eva._id],
      downvotedBy: [],
    },
    {
      problem: problemBySlug.get('two-sum')._id,
      author: bob._id,
      body: 'I started with brute force and then optimized to O(n).',
      upvotes: 1,
      downvotes: 0,
      upvotedBy: [alice._id],
      downvotedBy: [],
    },
    {
      problem: problemBySlug.get('solve-quadratic')._id,
      author: bob._id,
      body: 'Factoring makes this one straightforward.',
      upvotes: 2,
      downvotes: 0,
      upvotedBy: [charlie._id, diana._id],
      downvotedBy: [],
    },
    {
      problem: problemBySlug.get('newtons-second-law')._id,
      author: charlie._id,
      body: 'Mnemonic: Force equals mass times acceleration, always.',
      upvotes: 3,
      downvotes: 0,
      upvotedBy: [alice._id, bob._id, eva._id],
      downvotedBy: [],
    },
    {
      problem: problemBySlug.get('river-crossing')._id,
      author: diana._id,
      body: 'Classic puzzle, the chicken must cross first.',
      upvotes: 1,
      downvotes: 0,
      upvotedBy: [eva._id],
      downvotedBy: [],
    },
  ]);

  const community = await Community.create({
    slug: 'skilprep-founders-circle',
    name: 'SkilPrep Founders Circle',
    description: 'Demo community for tests, shared files, notes, and private result review.',
    owner: admin._id,
    members: [admin._id, alice._id, bob._id, charlie._id, diana._id, eva._id],
    isPublic: false,
    settings: {
      resultVisibility: 'members_only',
      allowFileSharing: true,
      allowNotes: true,
    },
  });

  const communityTest = await CommunityTest.create({
    community: community._id,
    title: 'Week 1 Diagnostic Test',
    description: 'Introductory community assessment for the first cohort.',
    prompt: 'Explain your approach to solving Two Sum and include one optimization idea.',
    createdBy: admin._id,
    isPublished: true,
  });

  await CommunityResource.insertMany([
    {
      community: community._id,
      kind: 'note',
      title: 'How we grade community tests',
      body: 'Creator/admin can review every answer. Students only see their own result in the dashboard.',
      sharedBy: admin._id,
    },
    {
      community: community._id,
      kind: 'file',
      title: 'Study plan PDF',
      body: 'Shared reference sheet for algorithms and practice schedule.',
      fileName: 'study-plan.pdf',
      fileUrl: 'https://example.com/study-plan.pdf',
      sharedBy: alice._id,
    },
  ]);

  await CommunitySubmission.insertMany([
    {
      community: community._id,
      communityTest: communityTest._id,
      user: alice._id,
      answer: 'I would use a hash map to store complements and reduce the search to O(n).',
      score: 94,
      feedback: 'Clear and correct. Good mention of the optimization.',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      status: 'reviewed',
    },
    {
      community: community._id,
      communityTest: communityTest._id,
      user: bob._id,
      answer: 'Brute force first, then improve with a lookup table for complements.',
      score: 88,
      feedback: 'Solid explanation.',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      status: 'reviewed',
    },
    {
      community: community._id,
      communityTest: communityTest._id,
      user: charlie._id,
      answer: 'Check each pair and use a faster data structure when scaling up.',
      score: 82,
      feedback: 'Good start, be more specific about the data structure.',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      status: 'reviewed',
    },
  ]);

  const userStatsPlan = [
    {
      user: alice,
      stats: {
        totalSolved: 3,
        totalScore: 40,
        currentStreak: 4,
        longestStreak: 7,
        lastSolveDate: new Date(),
        byField: {
          coding: { solved: 3, score: 40 },
        },
      },
    },
    {
      user: bob,
      stats: {
        totalSolved: 3,
        totalScore: 40,
        currentStreak: 3,
        longestStreak: 5,
        lastSolveDate: new Date(),
        byField: {
          math: { solved: 3, score: 40 },
        },
      },
    },
    {
      user: charlie,
      stats: {
        totalSolved: 2,
        totalScore: 30,
        currentStreak: 2,
        longestStreak: 2,
        lastSolveDate: new Date(),
        byField: {
          science: { solved: 2, score: 30 },
        },
      },
    },
    {
      user: diana,
      stats: {
        totalSolved: 3,
        totalScore: 60,
        currentStreak: 5,
        longestStreak: 6,
        lastSolveDate: new Date(),
        byField: {
          logic: { solved: 3, score: 60 },
        },
      },
    },
    {
      user: eva,
      stats: {
        totalSolved: 1,
        totalScore: 10,
        currentStreak: 1,
        longestStreak: 1,
        lastSolveDate: new Date(),
        byField: {
          'general-knowledge': { solved: 1, score: 10 },
        },
      },
    },
    {
      user: admin,
      stats: {
        totalSolved: 1,
        totalScore: 20,
        currentStreak: 1,
        longestStreak: 1,
        lastSolveDate: new Date(),
        byField: {
          'general-knowledge': { solved: 1, score: 20 },
        },
      },
    },
  ];

  await Promise.all(
    userStatsPlan.map(({ user, stats }) =>
      User.updateOne(
        { _id: user._id },
        {
          $set: {
            stats: {
              ...stats,
              byField: new Map(Object.entries(stats.byField)),
            },
          },
        }
      )
    )
  );

  const attemptsByProblem = new Map();
  const acceptedByProblem = new Map();
  for (const submission of submissions) {
    const problemId = submission.problem.toString();
    attemptsByProblem.set(problemId, (attemptsByProblem.get(problemId) || 0) + 1);
    if (submission.status === 'accepted') {
      acceptedByProblem.set(problemId, (acceptedByProblem.get(problemId) || 0) + 1);
    }
  }

  await Promise.all(
    allProblems.map((problem) =>
      Problem.updateOne(
        { _id: problem._id },
        {
          $set: {
            attemptCount: attemptsByProblem.get(problem._id.toString()) || 0,
            solveCount: acceptedByProblem.get(problem._id.toString()) || 0,
          },
        }
      )
    )
  );

  const presentationReport = {
    generatedAt: new Date().toISOString(),
    mongoDatabase: mongoose.connection.name,
    counts: {
      users: await User.countDocuments(),
      fields: await Field.countDocuments(),
      problems: await Problem.countDocuments(),
      testCases: await TestCase.countDocuments(),
      submissions: await Submission.countDocuments(),
      comments: await Comment.countDocuments(),
      communities: await Community.countDocuments(),
      communityTests: await CommunityTest.countDocuments(),
      communitySubmissions: await CommunitySubmission.countDocuments(),
      communityResources: await CommunityResource.countDocuments(),
    },
    loginCredentials: [
      { role: 'admin', username: admin.username, email: admin.email, password: 'admin123', userId: admin._id.toString() },
      { role: 'user', username: alice.username, email: alice.email, password: 'demo1234', userId: alice._id.toString() },
      { role: 'user', username: bob.username, email: bob.email, password: 'demo1234', userId: bob._id.toString() },
      { role: 'user', username: charlie.username, email: charlie.email, password: 'demo1234', userId: charlie._id.toString() },
      { role: 'user', username: diana.username, email: diana.email, password: 'demo1234', userId: diana._id.toString() },
      { role: 'user', username: eva.username, email: eva.email, password: 'demo1234', userId: eva._id.toString() },
    ],
    keyFieldIds: fields.map((field) => ({ slug: field.slug, id: field._id.toString() })),
    keyProblemIds: allProblems.map((problem) => ({ slug: problem.slug, id: problem._id.toString(), field: problem.field.toString() })),
    community: {
      slug: community.slug,
      id: community._id.toString(),
      testId: communityTest._id.toString(),
    },
  };

  const reportPath = path.join(__dirname, 'presentation-dataset-report.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(presentationReport, null, 2)}\n`, 'utf8');

  console.log(`Created ${totalProblems} problems`);
  console.log(`Created ${submissions.length} submissions`);
  console.log('Created 5 comments');
  console.log('Created 1 community with shared test and resources');
  console.log(`Presentation report written to ${reportPath}`);
  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
