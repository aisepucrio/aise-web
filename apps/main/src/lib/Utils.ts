import teamPositionsOrder from "@/../public/json/team-positions-order.json";

const LOCALE = "pt-BR";
const LOCALE_OPTIONS = { sensitivity: "base" as const };

// If an object has 'name' and 'position' string properties
type HasNamePosition = { name: string; position: string };

// Get predefined positions order from JSON
const getPositionsOrder = (): string[] =>
  (teamPositionsOrder as { positionsOrder?: string[] }).positionsOrder ?? [];

// Build a map from position to its rank/index
const buildRankMap = (order: string[]) => {
  const map = new Map<string, number>();
  order.forEach((pos, i) => map.set(pos, i));
  return map;
};

// Compare two strings using locale-aware comparison
const compareText = (a: string, b: string) =>
  a.localeCompare(b, LOCALE, LOCALE_OPTIONS);

// Compare two positions based on predefined rank
const comparePosition = (a: string, b: string, rank: Map<string, number>) => {
  const ra = rank.get(a);
  const rb = rank.get(b);

  if (ra !== undefined && rb !== undefined) return ra - rb;
  if (ra !== undefined) return -1;
  if (rb !== undefined) return 1;

  // Both positions not found in rank, compare as text
  return compareText(a, b);
};

// Exported function that sort team members by position and name
export function sortTeamMembers<T extends HasNamePosition>(
  members: T[],
  customOrder: string[] = getPositionsOrder()
): T[] {
  const rank = buildRankMap(customOrder);

  return [...members].sort((a, b) => {
    const pos = comparePosition(a.position, b.position, rank);
    return pos !== 0 ? pos : compareText(a.name, b.name);
  });
}
