import type { VoteResult, TieBreakRule } from "../types/index.js";

export function calculateVoteResult(votes: Record<string, string>): VoteResult {
  const voteCounts: Record<string, number> = {};

  for (const targetId of Object.values(votes)) {
    voteCounts[targetId] = (voteCounts[targetId] ?? 0) + 1;
  }

  const maxVotes = Math.max(...Object.values(voteCounts), 0);
  const tiedCandidates = Object.entries(voteCounts)
    .filter(([, count]) => count === maxVotes)
    .map(([id]) => id);

  const isTied = tiedCandidates.length !== 1;

  return {
    targetId: isTied ? null : tiedCandidates[0]!,
    isTied,
    voteCounts,
    tiedCandidates,
  };
}

export function resolveTieBreak(
  rule: TieBreakRule,
  result: VoteResult
): { action: "revote-tied" | "revote-all" | "spy-wins"; candidates: string[] } {
  switch (rule) {
    case "revote-tied":
      return { action: "revote-tied", candidates: result.tiedCandidates };
    case "revote-all":
      return { action: "revote-all", candidates: [] };
    case "spy-wins":
      return { action: "spy-wins", candidates: [] };
  }
}

export function isAllVotesIn(
  votes: Record<string, string>,
  voterIds: string[]
): boolean {
  return voterIds.every((id) => id in votes);
}
