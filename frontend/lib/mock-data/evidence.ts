import { Evidence } from "../types";

// ============================================================================
// Mock Evidence
// ============================================================================
// Every entry here is referenced by one or more KnowledgeItem.evidenceIds
// in knowledge-items.ts. This is the "proof" layer — the actual excerpt
// from a conversation that a conclusion was drawn from.
// ============================================================================

export const evidence: Evidence[] = [
  // ---- DSA ----
  {
    id: "ev-dsa-001",
    snippet:
      "User correctly implemented an in-place array rotation using the reversal technique without hints, and explained the time complexity unprompted.",
    sourceLabel: "ChatGPT conversation, Apr 2",
    date: "2026-04-02",
  },
  {
    id: "ev-dsa-002",
    snippet:
      "When solving 'group anagrams', user immediately reached for a hash map keyed by sorted characters instead of a brute-force comparison approach.",
    sourceLabel: "Claude conversation, Apr 5",
    date: "2026-04-05",
  },
  {
    id: "ev-dsa-003",
    snippet:
      "User solved the 'container with most water' problem using opposite-direction two pointers on the first attempt, correctly justifying why the shorter pointer should move.",
    sourceLabel: "ChatGPT conversation, Apr 10",
    date: "2026-04-10",
  },
  {
    id: "ev-dsa-004",
    snippet:
      "User identified 'longest substring without repeating characters' as a sliding window problem within seconds of reading it, and implemented the shrink condition correctly.",
    sourceLabel: "Claude conversation, Apr 14",
    date: "2026-04-14",
  },
  {
    id: "ev-dsa-005",
    snippet:
      "User applied binary search on a rotated sorted array, correctly handling the extra logic needed to determine which half is sorted.",
    sourceLabel: "ChatGPT conversation, Apr 20",
    date: "2026-04-20",
  },
  {
    id: "ev-dsa-006",
    snippet:
      "User wrote a recursive solution for generating subsets, but needed a follow-up explanation to trace why the base case terminated correctly.",
    sourceLabel: "Claude conversation, Apr 22",
    date: "2026-04-22",
  },
  {
    id: "ev-dsa-007",
    snippet:
      "When attempting the 'coin change' problem, user could describe the goal in words but was unable to write the recurrence relation without step-by-step guidance.",
    sourceLabel: "ChatGPT conversation, May 1",
    date: "2026-05-01",
  },
  {
    id: "ev-dsa-008",
    snippet:
      "On the 'longest increasing subsequence' problem, user again needed the DP state explained before being able to write the transition, mirroring the earlier coin change session.",
    sourceLabel: "Claude conversation, Aug 1",
    date: "2026-08-01",
  },
  {
    id: "ev-dsa-009",
    snippet:
      "User implemented DFS-based cycle detection in a directed graph correctly, but was unsure how to adapt it for an undirected graph without prompting.",
    sourceLabel: "ChatGPT conversation, May 6",
    date: "2026-05-06",
  },
  {
    id: "ev-dsa-010",
    snippet:
      "User wrote both BFS (queue-based) and DFS (recursive and iterative-with-stack) traversals from memory during a mock interview practice session.",
    sourceLabel: "Claude conversation, May 8",
    date: "2026-05-08",
  },
  {
    id: "ev-dsa-011",
    snippet:
      "User applied the same expand-right/shrink-left template across three different sliding window problems in one session, adapting the shrink condition each time.",
    sourceLabel: "ChatGPT conversation, Apr 16",
    date: "2026-04-16",
  },
  {
    id: "ev-dsa-012",
    snippet:
      "After previously getting stuck in infinite loops during binary search, user correctly used 'left < right' with mid = left + (right-left)/2 across two new problems without error.",
    sourceLabel: "Claude conversation, Jun 1",
    date: "2026-06-01",
  },
  {
    id: "ev-dsa-013",
    snippet:
      "User classified an unfamiliar problem as 'sliding window' within the first two sentences of reading it, and was correct.",
    sourceLabel: "ChatGPT conversation, May 10",
    date: "2026-05-10",
  },
  {
    id: "ev-dsa-014",
    snippet:
      "In a separate session, user quickly recognized a problem as a variation of 'two pointers on a sorted array' despite unfamiliar problem phrasing.",
    sourceLabel: "Claude conversation, Jul 28",
    date: "2026-07-28",
  },
  {
    id: "ev-dsa-015",
    snippet:
      "Reviewer feedback (simulated in conversation) noted the user's solution used clear variable names like 'left'/'right' and 'windowSum' instead of single letters, aiding readability.",
    sourceLabel: "ChatGPT conversation, May 15",
    date: "2026-05-15",
  },
  {
    id: "ev-dsa-016",
    snippet:
      "User asked 'I don't know what my dp array should even represent' when starting the 'house robber' problem, requiring the state to be defined for them.",
    sourceLabel: "Claude conversation, May 20",
    date: "2026-05-20",
  },
  {
    id: "ev-dsa-017",
    snippet:
      "Similar difficulty appeared again on 'edit distance' — user could describe the problem but not translate it into a 2D DP table definition independently.",
    sourceLabel: "ChatGPT conversation, Aug 1",
    date: "2026-08-01",
  },
  {
    id: "ev-dsa-018",
    snippet:
      "User initially reached for Dijkstra's algorithm on an unweighted graph shortest-path problem, where plain BFS would have been sufficient and simpler.",
    sourceLabel: "Claude conversation, Jun 10",
    date: "2026-06-10",
  },
  {
    id: "ev-dsa-019",
    snippet:
      "User's binary search implementation used 'right = mid' instead of 'right = mid - 1' in one branch, causing an infinite loop that took two attempts to fix.",
    sourceLabel: "ChatGPT conversation, Apr 25",
    date: "2026-04-25",
  },
  {
    id: "ev-dsa-020",
    snippet:
      "A similar off-by-one error occurred in an array slicing problem a few weeks later, where the end index excluded the last valid element.",
    sourceLabel: "Claude conversation, Jul 30",
    date: "2026-07-30",
  },
  {
    id: "ev-dsa-021",
    snippet:
      "User's first draft solution for 'merge intervals' did not handle an empty input array, causing a runtime error that was only caught after being pointed out.",
    sourceLabel: "ChatGPT conversation, May 18",
    date: "2026-05-18",
  },
  {
    id: "ev-dsa-022",
    snippet:
      "User explicitly stated: 'I want to get to a point where I can define the DP state myself without needing it explained every time.'",
    sourceLabel: "Claude conversation, Jun 15",
    date: "2026-06-15",
  },
  {
    id: "ev-dsa-023",
    snippet:
      "User mentioned starting a personal challenge to solve one graph problem per day to build pattern familiarity faster.",
    sourceLabel: "ChatGPT conversation, Jul 1",
    date: "2026-07-01",
  },
  {
    id: "ev-dsa-024",
    snippet:
      "User commented that concepts 'click' much faster when introduced as a named pattern with a reusable template, compared to being walked through one specific problem at a time.",
    sourceLabel: "Claude conversation, Apr 8",
    date: "2026-04-08",
  },

  // ---- Linux ----
  {
    id: "ev-linux-001",
    snippet:
      "User correctly used chmod 750 and explained the numeric permission breakdown unprompted while setting up a shared project directory.",
    sourceLabel: "ChatGPT conversation, Mar 10",
    date: "2026-03-10",
  },
  {
    id: "ev-linux-002",
    snippet:
      "User used 'ps aux | grep' combined with 'kill -9' to terminate a hung process, and asked a follow-up about the difference between SIGTERM and SIGKILL.",
    sourceLabel: "Claude conversation, Mar 15",
    date: "2026-03-15",
  },
  {
    id: "ev-linux-003",
    snippet:
      "User wrote a bash script with a for-loop and if/else conditionals to batch-rename files, though asked how to use arrays for a slightly more advanced version.",
    sourceLabel: "ChatGPT conversation, Mar 20",
    date: "2026-03-20",
  },
  {
    id: "ev-linux-004",
    snippet:
      "User debugged a failing custom systemd service by reading journalctl -u output and identified a missing environment variable as the root cause.",
    sourceLabel: "Claude conversation, May 2",
    date: "2026-05-02",
  },
  {
    id: "ev-linux-005",
    snippet:
      "User chained grep, awk, and sort to extract and rank the top memory-consuming processes from a log file in a single pipeline.",
    sourceLabel: "ChatGPT conversation, Apr 1",
    date: "2026-04-01",
  },
  {
    id: "ev-linux-006",
    snippet:
      "User asked for help interpreting 'ss -tulnp' output and was unfamiliar with what the state column values meant.",
    sourceLabel: "Claude conversation, Jun 5",
    date: "2026-06-05",
  },
  {
    id: "ev-linux-007",
    snippet:
      "User said they want to understand 'what Docker is actually doing under the hood' rather than just using it as a black box.",
    sourceLabel: "ChatGPT conversation, Jul 5",
    date: "2026-07-05",
  },

  // ---- Web Development ----
  {
    id: "ev-web-001",
    snippet:
      "User correctly diagnosed a stale closure bug in a useEffect callback and fixed it by adding the missing dependency, explaining why the bug occurred.",
    sourceLabel: "Claude conversation, Feb 14",
    date: "2026-02-14",
  },
  {
    id: "ev-web-002",
    snippet:
      "User designed resource-based endpoints (e.g. /users/:id/orders) and correctly chose status codes like 201 vs 200 for a small API spec.",
    sourceLabel: "ChatGPT conversation, Feb 20",
    date: "2026-02-20",
  },
  {
    id: "ev-web-003",
    snippet:
      "User built a responsive card grid using CSS Grid with auto-fit and minmax, but defaulted to a fixed pixel width for a sidebar in the same layout.",
    sourceLabel: "Claude conversation, Mar 1",
    date: "2026-03-01",
  },
  {
    id: "ev-web-004",
    snippet:
      "User set up nested layouts and a dynamic route segment in the Next.js App Router without consulting documentation mid-session.",
    sourceLabel: "ChatGPT conversation, May 10",
    date: "2026-05-10",
  },
  {
    id: "ev-web-005",
    snippet:
      "User broke a large 'Dashboard' component into smaller pieces (StatCard, ActivityFeed, FilterBar) unprompted, citing reusability as the reason.",
    sourceLabel: "Claude conversation, Apr 5",
    date: "2026-04-05",
  },
  {
    id: "ev-web-006",
    snippet:
      "User's app had 6+ useState calls managing related pieces of form state, which led to confusing update logic that took extra time to debug together.",
    sourceLabel: "ChatGPT conversation, May 25",
    date: "2026-05-25",
  },
  {
    id: "ev-web-006b",
    snippet:
      "A similar pattern appeared in a later project where cart state was managed with multiple disconnected useState hooks instead of a single reducer.",
    sourceLabel: "Claude conversation, Jul 30",
    date: "2026-07-30",
  },
  {
    id: "ev-web-007",
    snippet:
      "User passed a 'theme' prop through four intermediate components that didn't use it themselves, just to reach a deeply nested button component.",
    sourceLabel: "ChatGPT conversation, Jun 1",
    date: "2026-06-01",
  },
  {
    id: "ev-web-008",
    snippet:
      "User shared a deployed portfolio site link built with Next.js, Tailwind, and an MDX-powered blog, asking for feedback on the structure.",
    sourceLabel: "Claude conversation, Mar 12",
    date: "2026-03-12",
  },
  {
    id: "ev-web-009",
    snippet:
      "User asked 'how do I even start testing a React app' after realizing a recent bug would have been caught by a simple unit test.",
    sourceLabel: "ChatGPT conversation, Jul 8",
    date: "2026-07-08",
  },

  // ---- Blockchain ----
  {
    id: "ev-blockchain-001",
    snippet:
      "User wrote and deployed a basic ERC-20-style token contract to a testnet, asking clarifying questions about gas estimation along the way.",
    sourceLabel: "ChatGPT conversation, Jun 10",
    date: "2026-06-10",
  },
  {
    id: "ev-blockchain-002",
    snippet:
      "User asked for a high-level comparison of Proof of Work and Proof of Stake but did not ask any follow-up questions about validator selection mechanics.",
    sourceLabel: "Claude conversation, Jun 15",
    date: "2026-06-15",
  },
  {
    id: "ev-blockchain-003",
    snippet:
      "When reviewing a sample contract, user did not flag a reentrancy vulnerability in a withdrawal function until it was pointed out.",
    sourceLabel: "ChatGPT conversation, Jun 20",
    date: "2026-06-20",
  },
  {
    id: "ev-blockchain-004",
    snippet:
      "User said they want to 'actually build something end to end' instead of only reading about blockchain concepts in isolation.",
    sourceLabel: "Claude conversation, Jul 10",
    date: "2026-07-10",
  },
  {
    id: "ev-blockchain-005",
    snippet:
      "User mentioned watching a multi-part video series on blockchain fundamentals before asking any hands-on implementation questions.",
    sourceLabel: "ChatGPT conversation, Jun 12",
    date: "2026-06-12",
  },

  // ---- Career ----
  {
    id: "ev-career-001",
    snippet:
      "User shared a list of target companies focused on product engineering roles and asked for help tailoring application materials to each.",
    sourceLabel: "ChatGPT conversation, May 1",
    date: "2026-05-1",
  },
  {
    id: "ev-career-002",
    snippet:
      "User asked how to research market salary ranges before an upcoming offer conversation, noting they've historically accepted first offers.",
    sourceLabel: "Claude conversation, Jun 18",
    date: "2026-06-18",
  },
  {
    id: "ev-career-003",
    snippet:
      "User drafted a project update message for non-technical stakeholders that clearly explained a technical delay without jargon.",
    sourceLabel: "ChatGPT conversation, Apr 10",
    date: "2026-04-10",
  },
  {
    id: "ev-career-004",
    snippet:
      "User reported freezing up during a timed mock interview on a problem type they had solved comfortably in untimed practice sessions.",
    sourceLabel: "Claude conversation, Jun 25",
    date: "2026-06-25",
  },
  {
    id: "ev-career-004b",
    snippet:
      "A similar gap appeared in a second mock interview, where the user solved a related problem quickly afterward with no time pressure.",
    sourceLabel: "ChatGPT conversation, Aug 2",
    date: "2026-08-02",
  },
  {
    id: "ev-career-005",
    snippet:
      "User rewrote resume bullet points to include specific metrics (e.g. 'reduced load time by 40%') instead of only listing responsibilities.",
    sourceLabel: "Claude conversation, May 15",
    date: "2026-05-15",
  },
];