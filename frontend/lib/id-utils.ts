/**
 * If `candidateId` isn't in `existingIds`, returns it unchanged. Otherwise
 * appends `-{suffix}-1`, `-{suffix}-2`, etc. until it finds one that isn't
 * taken. Deterministic and human-readable rather than a random id, per the
 * "career-goal-land-swe-role" -> "career-goal-land-swe-role-import-1"
 * example this was written against.
 *
 * Pure function, no side effects — callers are responsible for adding the
 * result to whatever set they're tracking before checking the next id.
 */
export function makeUniqueId(candidateId: string, existingIds: Set<string>, suffix: string): string {
  if (!existingIds.has(candidateId)) return candidateId;

  let attempt = 1;
  let next = `${candidateId}-${suffix}-${attempt}`;
  while (existingIds.has(next)) {
    attempt += 1;
    next = `${candidateId}-${suffix}-${attempt}`;
  }
  return next;
}