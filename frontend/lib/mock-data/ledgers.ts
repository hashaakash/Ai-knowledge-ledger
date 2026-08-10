import { Ledger } from "../types";

// ============================================================================
// Mock Ledgers
// ============================================================================
// Each ledger is a top-level knowledge category. The `itemCount` and
// `lastUpdated` fields are denormalized summaries — they should match what
// you'd get by counting/scanning knowledgeItems for that ledgerId, but are
// stored directly here since there's no backend yet to compute them live.
// ============================================================================

export const ledgers: Ledger[] = [
  {
    id: "dsa",
    name: "DSA",
    icon: "Binary",
    color: "violet",
    description:
      "Data structures, algorithms, and problem-solving patterns learned through practice and discussion.",
    itemCount: 20,
    lastUpdated: "2026-08-06",
  },
  {
    id: "linux",
    name: "Linux",
    icon: "Terminal",
    color: "emerald",
    description:
      "System administration, shell usage, and command-line tooling knowledge.",
    itemCount: 7,
    lastUpdated: "2026-08-02",
  },
  {
    id: "web-dev",
    name: "Web Development",
    icon: "Code2",
    color: "blue",
    description:
      "Frontend and backend web development skills, from React fundamentals to API design.",
    itemCount: 9,
    lastUpdated: "2026-08-03",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    icon: "Link2",
    color: "amber",
    description:
      "Early-stage exploration of smart contracts, consensus mechanisms, and decentralized applications.",
    itemCount: 5,
    lastUpdated: "2026-08-01",
  },
  {
    id: "career",
    name: "Career",
    icon: "Briefcase",
    color: "rose",
    description:
      "Job search progress, interview performance, and professional development goals.",
    itemCount: 5,
    lastUpdated: "2026-08-06",
  },
];