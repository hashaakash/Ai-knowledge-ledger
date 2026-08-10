import { KnowledgeItem } from "../types";

// ============================================================================
// Mock Knowledge Items
// ============================================================================
// Each item belongs to a ledger (via ledgerId) and points to one or more
// Evidence entries (via evidenceIds) defined in evidence.ts.
//
// DSA is the most fully fleshed-out ledger since it's our primary example
// for the rest of the prototype. The other ledgers are realistic but lighter.
// ============================================================================

export const knowledgeItems: KnowledgeItem[] = [
  // ==========================================================================
  // DSA — Topics
  // ==========================================================================
  {
    id: "dsa-topic-arrays",
    ledgerId: "dsa",
    type: "topic",
    title: "Arrays",
    description:
      "Comfortable with core array operations, in-place manipulation, and prefix sum techniques. Has solved 20+ array-based problems across easy and medium difficulty.",
    confidence: "high",
    tags: ["arrays", "prefix-sum", "in-place"],
    evidenceIds: ["ev-dsa-001"],
    createdAt: "2026-04-02T10:00:00Z",
    updatedAt: "2026-07-18T09:30:00Z",
  },
  {
    id: "dsa-topic-hashing",
    ledgerId: "dsa",
    type: "topic",
    title: "Hashing",
    description:
      "Understands hash maps and hash sets well, and reliably reaches for them to reduce time complexity from O(n²) to O(n) in lookup-heavy problems.",
    confidence: "high",
    tags: ["hashing", "hash-map", "time-complexity"],
    evidenceIds: ["ev-dsa-002"],
    createdAt: "2026-04-05T14:00:00Z",
    updatedAt: "2026-07-10T11:00:00Z",
  },
  {
    id: "dsa-topic-two-pointers",
    ledgerId: "dsa",
    type: "topic",
    title: "Two Pointers",
    description:
      "Solid grasp of the two-pointer pattern for sorted arrays and string problems, including opposite-direction and same-direction variants.",
    confidence: "high",
    tags: ["two-pointers", "arrays", "strings"],
    evidenceIds: ["ev-dsa-003"],
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-06-28T16:00:00Z",
  },
  {
    id: "dsa-topic-sliding-window",
    ledgerId: "dsa",
    type: "topic",
    title: "Sliding Window",
    description:
      "Can identify sliding window problems from the prompt alone and implement fixed-size and variable-size window solutions confidently.",
    confidence: "high",
    tags: ["sliding-window", "arrays", "strings"],
    evidenceIds: ["ev-dsa-004"],
    createdAt: "2026-04-14T12:00:00Z",
    updatedAt: "2026-07-02T10:00:00Z",
  },
  {
    id: "dsa-topic-binary-search",
    ledgerId: "dsa",
    type: "topic",
    title: "Binary Search",
    description:
      "Understands classic binary search well, including applying it on answer spaces (binary search on the answer), not just sorted arrays.",
    confidence: "medium",
    tags: ["binary-search", "search-space"],
    evidenceIds: ["ev-dsa-005"],
    createdAt: "2026-04-20T08:00:00Z",
    updatedAt: "2026-07-25T13:00:00Z",
  },
  {
    id: "dsa-topic-recursion",
    ledgerId: "dsa",
    type: "topic",
    title: "Recursion",
    description:
      "Comfortable writing recursive solutions and reasoning about base cases, though occasionally needs a second pass to trace through recursive call stacks correctly.",
    confidence: "medium",
    tags: ["recursion", "backtracking", "call-stack"],
    evidenceIds: ["ev-dsa-006"],
    createdAt: "2026-04-22T15:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "dsa-topic-dp",
    ledgerId: "dsa",
    type: "topic",
    title: "Dynamic Programming",
    description:
      "Understands the concept of overlapping subproblems and optimal substructure, but consistently struggles to define the state and transition for medium/hard DP problems without guidance.",
    confidence: "low",
    tags: ["dynamic-programming", "memoization", "tabulation"],
    evidenceIds: ["ev-dsa-007", "ev-dsa-008"],
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-08-01T11:00:00Z",
  },
  {
    id: "dsa-topic-graphs",
    ledgerId: "dsa",
    type: "topic",
    title: "Graphs",
    description:
      "Knows graph representations (adjacency list/matrix) and can implement BFS and DFS from scratch, but is still building intuition for shortest-path and topological sort problems.",
    confidence: "medium",
    tags: ["graphs", "bfs", "dfs"],
    evidenceIds: ["ev-dsa-009"],
    createdAt: "2026-05-06T13:00:00Z",
    updatedAt: "2026-08-05T14:00:00Z",
  },

  // ==========================================================================
  // DSA — Skills
  // ==========================================================================
  {
    id: "dsa-skill-bfs-dfs",
    ledgerId: "dsa",
    type: "skill",
    title: "Implementing BFS/DFS from scratch",
    description:
      "Can write both breadth-first and depth-first traversal from memory, using either an explicit queue/stack or recursion, without referring to notes.",
    confidence: "high",
    tags: ["bfs", "dfs", "graphs"],
    evidenceIds: ["ev-dsa-010"],
    createdAt: "2026-05-08T09:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "dsa-skill-sliding-window-template",
    ledgerId: "dsa",
    type: "skill",
    title: "Sliding window template application",
    description:
      "Applies a consistent, reliable template for variable-size sliding window problems: expand right, shrink left while condition is violated.",
    confidence: "high",
    tags: ["sliding-window", "template"],
    evidenceIds: ["ev-dsa-011"],
    createdAt: "2026-04-16T10:00:00Z",
    updatedAt: "2026-06-30T09:00:00Z",
  },
  {
    id: "dsa-skill-binary-search-boundaries",
    ledgerId: "dsa",
    type: "skill",
    title: "Handling binary search boundary conditions",
    description:
      "Correctly manages left/right pointer updates and loop termination in binary search, avoiding infinite loops — an area that used to cause frequent bugs.",
    confidence: "medium",
    tags: ["binary-search", "boundaries"],
    evidenceIds: ["ev-dsa-012"],
    createdAt: "2026-06-01T11:00:00Z",
    updatedAt: "2026-07-25T13:00:00Z",
  },

  // ==========================================================================
  // DSA — Strengths
  // ==========================================================================
  {
    id: "dsa-strength-pattern-recognition",
    ledgerId: "dsa",
    type: "strength",
    title: "Fast pattern recognition",
    description:
      "Quickly identifies which category a problem belongs to (two pointers, sliding window, binary search, etc.) within the first minute of reading, which significantly speeds up problem-solving.",
    confidence: "high",
    tags: ["pattern-recognition", "problem-solving"],
    evidenceIds: ["ev-dsa-013", "ev-dsa-014"],
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-07-28T12:00:00Z",
  },
  {
    id: "dsa-strength-clean-code",
    ledgerId: "dsa",
    type: "strength",
    title: "Clean, readable solution code",
    description:
      "Writes solutions with clear variable names and minimal unnecessary complexity, making code easy to review and debug even under time pressure.",
    confidence: "medium",
    tags: ["code-quality", "readability"],
    evidenceIds: ["ev-dsa-015"],
    createdAt: "2026-05-15T14:00:00Z",
    updatedAt: "2026-07-05T09:00:00Z",
  },

  // ==========================================================================
  // DSA — Weaknesses
  // ==========================================================================
  {
    id: "dsa-weakness-dp-state-design",
    ledgerId: "dsa",
    type: "weakness",
    title: "Defining DP state and transitions",
    description:
      "Struggles to independently define what a DP state should represent and how transitions between states work, often needing the problem broken down before making progress.",
    confidence: "high",
    tags: ["dynamic-programming", "state-design"],
    evidenceIds: ["ev-dsa-016", "ev-dsa-017"],
    createdAt: "2026-05-20T10:00:00Z",
    updatedAt: "2026-08-01T11:00:00Z",
  },
  {
    id: "dsa-weakness-graph-shortest-path",
    ledgerId: "dsa",
    type: "weakness",
    title: "Shortest-path algorithm selection",
    description:
      "Frequently unsure when to use Dijkstra's vs BFS vs Bellman-Ford, and mixes up the conditions under which each is valid (e.g. negative weights, unweighted graphs).",
    confidence: "medium",
    tags: ["graphs", "shortest-path", "dijkstra"],
    evidenceIds: ["ev-dsa-018"],
    createdAt: "2026-06-10T13:00:00Z",
    updatedAt: "2026-08-05T14:00:00Z",
  },

  // ==========================================================================
  // DSA — Mistakes
  // ==========================================================================
  {
    id: "dsa-mistake-off-by-one",
    ledgerId: "dsa",
    type: "mistake",
    title: "Off-by-one errors in loop bounds",
    description:
      "Recurring pattern of off-by-one errors when writing loop conditions, especially in binary search and array-slicing problems — appears across multiple unrelated sessions.",
    confidence: "high",
    tags: ["off-by-one", "loops", "recurring"],
    evidenceIds: ["ev-dsa-019", "ev-dsa-020"],
    createdAt: "2026-04-25T09:00:00Z",
    updatedAt: "2026-07-30T10:00:00Z",
  },
  {
    id: "dsa-mistake-edge-cases",
    ledgerId: "dsa",
    type: "mistake",
    title: "Forgetting empty input edge cases",
    description:
      "Regularly skips checking for empty arrays, null inputs, or single-element inputs before writing the main logic, leading to avoidable bugs caught only during testing.",
    confidence: "medium",
    tags: ["edge-cases", "testing"],
    evidenceIds: ["ev-dsa-021"],
    createdAt: "2026-05-18T15:00:00Z",
    updatedAt: "2026-07-22T09:00:00Z",
  },

  // ==========================================================================
  // DSA — Goals
  // ==========================================================================
  {
    id: "dsa-goal-master-dp",
    ledgerId: "dsa",
    type: "goal",
    title: "Become confident with Dynamic Programming",
    description:
      "Actively working toward independently solving medium-difficulty DP problems without hints, by practicing state-definition drills.",
    confidence: "high",
    tags: ["dynamic-programming", "goal"],
    evidenceIds: ["ev-dsa-022"],
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-08-06T09:00:00Z",
  },
  {
    id: "dsa-goal-daily-graphs",
    ledgerId: "dsa",
    type: "goal",
    title: "Solve one graph problem daily",
    description:
      "Set a personal goal to solve at least one graph-related problem per day for a month to build stronger intuition for traversal and shortest-path patterns.",
    confidence: "medium",
    tags: ["graphs", "practice-routine"],
    evidenceIds: ["ev-dsa-023"],
    createdAt: "2026-07-01T08:00:00Z",
    updatedAt: "2026-08-04T09:00:00Z",
  },

  // ==========================================================================
  // DSA — Preferences
  // ==========================================================================
  {
    id: "dsa-preference-pattern-based-learning",
    ledgerId: "dsa",
    type: "preference",
    title: "Learns best through named patterns",
    description:
      "Retains concepts significantly better when they're taught as named, reusable patterns (e.g. 'sliding window', 'two pointers') rather than as isolated problem walkthroughs.",
    confidence: "high",
    tags: ["learning-style", "patterns"],
    evidenceIds: ["ev-dsa-024"],
    createdAt: "2026-04-08T10:00:00Z",
    updatedAt: "2026-07-15T09:00:00Z",
  },

  // ==========================================================================
  // Linux
  // ==========================================================================
  {
    id: "linux-topic-file-permissions",
    ledgerId: "linux",
    type: "topic",
    title: "File Permissions & Ownership",
    description:
      "Understands the rwx permission model, chmod numeric/symbolic notation, and chown/chgrp for managing file ownership.",
    confidence: "high",
    tags: ["permissions", "chmod", "chown"],
    evidenceIds: ["ev-linux-001"],
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "linux-topic-process-management",
    ledgerId: "linux",
    type: "topic",
    title: "Process Management",
    description:
      "Comfortable using ps, top, kill, and nice/renice to inspect and control running processes.",
    confidence: "medium",
    tags: ["processes", "ps", "kill"],
    evidenceIds: ["ev-linux-002"],
    createdAt: "2026-03-15T11:00:00Z",
    updatedAt: "2026-06-25T09:00:00Z",
  },
  {
    id: "linux-topic-shell-scripting",
    ledgerId: "linux",
    type: "topic",
    title: "Shell Scripting",
    description:
      "Writes basic to intermediate bash scripts with loops, conditionals, and variables, though rarely uses more advanced features like traps or arrays.",
    confidence: "medium",
    tags: ["bash", "scripting"],
    evidenceIds: ["ev-linux-003"],
    createdAt: "2026-03-20T14:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "linux-skill-systemd-services",
    ledgerId: "linux",
    type: "skill",
    title: "Managing systemd services",
    description:
      "Can create, enable, and debug custom systemd unit files, and reliably uses journalctl to trace service failures.",
    confidence: "medium",
    tags: ["systemd", "journalctl"],
    evidenceIds: ["ev-linux-004"],
    createdAt: "2026-05-02T09:00:00Z",
    updatedAt: "2026-07-18T10:00:00Z",
  },
  {
    id: "linux-strength-cli-comfort",
    ledgerId: "linux",
    type: "strength",
    title: "General command-line fluency",
    description:
      "Navigates the terminal quickly and pipes commands together effectively (grep, awk, sed) to solve ad-hoc problems without needing a GUI.",
    confidence: "high",
    tags: ["cli", "pipes", "grep"],
    evidenceIds: ["ev-linux-005"],
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "linux-weakness-networking-config",
    ledgerId: "linux",
    type: "weakness",
    title: "Network configuration & troubleshooting",
    description:
      "Struggles with diagnosing networking issues beyond the basics — unfamiliar with tools like iptables, netstat/ss output interpretation, and DNS debugging.",
    confidence: "medium",
    tags: ["networking", "iptables", "dns"],
    evidenceIds: ["ev-linux-006"],
    createdAt: "2026-06-05T13:00:00Z",
    updatedAt: "2026-07-28T09:00:00Z",
  },
  {
    id: "linux-goal-learn-containers",
    ledgerId: "linux",
    type: "goal",
    title: "Get comfortable with containers",
    description:
      "Wants to move beyond basic Docker usage to understanding namespaces, cgroups, and how containers isolate processes at the kernel level.",
    confidence: "medium",
    tags: ["docker", "containers", "goal"],
    evidenceIds: ["ev-linux-007"],
    createdAt: "2026-07-05T09:00:00Z",
    updatedAt: "2026-08-02T10:00:00Z",
  },

  // ==========================================================================
  // Web Development
  // ==========================================================================
  {
    id: "web-topic-react-hooks",
    ledgerId: "web-dev",
    type: "topic",
    title: "React Hooks",
    description:
      "Strong understanding of useState, useEffect, and useMemo, including common pitfalls like stale closures and dependency array mistakes.",
    confidence: "high",
    tags: ["react", "hooks"],
    evidenceIds: ["ev-web-001"],
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-06-18T10:00:00Z",
  },
  {
    id: "web-topic-rest-apis",
    ledgerId: "web-dev",
    type: "topic",
    title: "REST API Design",
    description:
      "Understands REST conventions, status codes, and resource-based URL design well enough to design a small API from scratch.",
    confidence: "medium",
    tags: ["rest", "api-design"],
    evidenceIds: ["ev-web-002"],
    createdAt: "2026-02-20T11:00:00Z",
    updatedAt: "2026-06-22T09:00:00Z",
  },
  {
    id: "web-topic-css-layout",
    ledgerId: "web-dev",
    type: "topic",
    title: "CSS Layout (Flexbox & Grid)",
    description:
      "Comfortable building responsive layouts with Flexbox and Grid, though occasionally reaches for fixed widths where a more flexible approach would work better.",
    confidence: "medium",
    tags: ["css", "flexbox", "grid"],
    evidenceIds: ["ev-web-003"],
    createdAt: "2026-03-01T14:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "web-skill-nextjs-routing",
    ledgerId: "web-dev",
    type: "skill",
    title: "Next.js App Router",
    description:
      "Can set up file-based routing, layouts, and nested routes in the Next.js App Router without referring to documentation.",
    confidence: "high",
    tags: ["nextjs", "routing"],
    evidenceIds: ["ev-web-004"],
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "web-strength-component-design",
    ledgerId: "web-dev",
    type: "strength",
    title: "Breaking UIs into reusable components",
    description:
      "Naturally decomposes complex UIs into small, well-scoped, reusable components rather than building large monolithic ones.",
    confidence: "high",
    tags: ["component-design", "architecture"],
    evidenceIds: ["ev-web-005"],
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-07-08T09:00:00Z",
  },
  {
    id: "web-weakness-state-management",
    ledgerId: "web-dev",
    type: "weakness",
    title: "Complex client state management",
    description:
      "Tends to reach for scattered useState calls even as an app's state grows complex, rather than recognizing when a more structured approach (context, reducer, or a state library) is warranted.",
    confidence: "medium",
    tags: ["state-management", "react"],
    evidenceIds: ["ev-web-006", "ev-web-006b"],
    createdAt: "2026-05-25T13:00:00Z",
    updatedAt: "2026-07-30T09:00:00Z",
  },
  {
    id: "web-mistake-prop-drilling",
    ledgerId: "web-dev",
    type: "mistake",
    title: "Excessive prop drilling",
    description:
      "Repeatedly passes props through 3-4 layers of components instead of lifting state or using context, a pattern that shows up across multiple different projects.",
    confidence: "medium",
    tags: ["prop-drilling", "react"],
    evidenceIds: ["ev-web-007"],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z",
  },
  {
    id: "web-project-portfolio-site",
    ledgerId: "web-dev",
    type: "project",
    title: "Personal Portfolio Website",
    description:
      "Built and deployed a personal portfolio using Next.js and Tailwind CSS, including a blog section powered by MDX.",
    confidence: "high",
    tags: ["portfolio", "nextjs", "mdx"],
    evidenceIds: ["ev-web-008"],
    createdAt: "2026-03-12T10:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
  },
  {
    id: "web-goal-learn-testing",
    ledgerId: "web-dev",
    type: "goal",
    title: "Adopt automated testing habits",
    description:
      "Wants to start writing unit and integration tests consistently (Vitest/React Testing Library) instead of relying solely on manual testing.",
    confidence: "medium",
    tags: ["testing", "goal"],
    evidenceIds: ["ev-web-009"],
    createdAt: "2026-07-08T09:00:00Z",
    updatedAt: "2026-08-03T10:00:00Z",
  },

  // ==========================================================================
  // Blockchain
  // ==========================================================================
  {
    id: "blockchain-topic-smart-contracts",
    ledgerId: "blockchain",
    type: "topic",
    title: "Smart Contract Fundamentals",
    description:
      "Understands the basics of Solidity syntax, contract deployment, and gas costs, having written a few simple contracts (ERC-20 style tokens).",
    confidence: "low",
    tags: ["solidity", "smart-contracts"],
    evidenceIds: ["ev-blockchain-001"],
    createdAt: "2026-06-10T09:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "blockchain-topic-consensus-mechanisms",
    ledgerId: "blockchain",
    type: "topic",
    title: "Consensus Mechanisms",
    description:
      "Has a conceptual understanding of Proof of Work vs Proof of Stake, but hasn't yet gone deep into the implementation details of either.",
    confidence: "low",
    tags: ["consensus", "pow", "pos"],
    evidenceIds: ["ev-blockchain-002"],
    createdAt: "2026-06-15T11:00:00Z",
    updatedAt: "2026-07-22T10:00:00Z",
  },
  {
    id: "blockchain-weakness-solidity-security",
    ledgerId: "blockchain",
    type: "weakness",
    title: "Smart contract security patterns",
    description:
      "Not yet familiar with common vulnerability classes like reentrancy attacks or integer overflow protections — hasn't applied security-first patterns in practice.",
    confidence: "medium",
    tags: ["security", "solidity", "reentrancy"],
    evidenceIds: ["ev-blockchain-003"],
    createdAt: "2026-06-20T13:00:00Z",
    updatedAt: "2026-07-25T09:00:00Z",
  },
  {
    id: "blockchain-goal-build-dapp",
    ledgerId: "blockchain",
    type: "goal",
    title: "Build a small end-to-end dApp",
    description:
      "Wants to build a minimal decentralized application (smart contract + frontend) to connect the conceptual knowledge to a real, working project.",
    confidence: "medium",
    tags: ["dapp", "goal"],
    evidenceIds: ["ev-blockchain-004"],
    createdAt: "2026-07-10T09:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "blockchain-preference-video-learning",
    ledgerId: "blockchain",
    type: "preference",
    title: "Prefers video walkthroughs for new domains",
    description:
      "When entering an unfamiliar domain like blockchain, engages more consistently with video-based tutorials before switching to hands-on text-based learning.",
    confidence: "medium",
    tags: ["learning-style", "video"],
    evidenceIds: ["ev-blockchain-005"],
    createdAt: "2026-06-12T10:00:00Z",
    updatedAt: "2026-07-18T09:00:00Z",
  },

  // ==========================================================================
  // Career
  // ==========================================================================
  {
    id: "career-goal-land-swe-role",
    ledgerId: "career",
    type: "goal",
    title: "Land a Software Engineer role",
    description:
      "Actively job hunting for an entry-to-mid level Software Engineer position, targeting product-focused companies over pure consultancies.",
    confidence: "high",
    tags: ["job-search", "goal"],
    evidenceIds: ["ev-career-001"],
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-08-06T10:00:00Z",
  },
  {
    id: "career-goal-salary-negotiation",
    ledgerId: "career",
    type: "goal",
    title: "Improve salary negotiation confidence",
    description:
      "Wants to get better at researching market rates and confidently negotiating offers instead of accepting the first number given.",
    confidence: "medium",
    tags: ["negotiation", "goal"],
    evidenceIds: ["ev-career-002"],
    createdAt: "2026-06-18T10:00:00Z",
    updatedAt: "2026-07-29T09:00:00Z",
  },
  {
    id: "career-strength-communication",
    ledgerId: "career",
    type: "strength",
    title: "Clear written communication",
    description:
      "Writes clear, well-structured messages and documentation, consistently able to explain technical concepts to non-technical stakeholders.",
    confidence: "high",
    tags: ["communication", "writing"],
    evidenceIds: ["ev-career-003"],
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-07-05T10:00:00Z",
  },
  {
    id: "career-weakness-interview-anxiety",
    ledgerId: "career",
    type: "weakness",
    title: "Anxiety during live coding interviews",
    description:
      "Performance in live coding interviews is noticeably weaker than in untimed practice, suggesting anxiety under time pressure and observation is a limiting factor.",
    confidence: "medium",
    tags: ["interviews", "anxiety"],
    evidenceIds: ["ev-career-004", "ev-career-004b"],
    createdAt: "2026-06-25T13:00:00Z",
    updatedAt: "2026-08-02T09:00:00Z",
  },
  {
    id: "career-project-resume-revamp",
    ledgerId: "career",
    type: "project",
    title: "Resume & LinkedIn Revamp",
    description:
      "Rewrote resume bullet points to be metric-driven and impact-focused, and updated LinkedIn to better reflect recent project work.",
    confidence: "high",
    tags: ["resume", "linkedin"],
    evidenceIds: ["ev-career-005"],
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-06-10T10:00:00Z",
  },
];