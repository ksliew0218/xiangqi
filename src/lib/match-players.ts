import type { Player } from "@/types/player";

export type PlayerIndexes = {
  byZh: Map<string, Player>;
  byEn: Map<string, Player>;
  byXq: Map<string, Player>;
};

function normSpaces(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

function normZh(s: string): string {
  return normSpaces(s);
}

function normEn(s: string): string {
  return normSpaces(s).toLowerCase();
}

export function buildPlayerIndexes(players: Player[]): PlayerIndexes {
  const byZh = new Map<string, Player>();
  const byEn = new Map<string, Player>();
  const byXq = new Map<string, Player>();

  for (const p of players) {
    const zh = normZh(p.name_zh);
    if (zh && !byZh.has(zh)) byZh.set(zh, p);

    const en = normEn(p.name_en);
    if (en && !byEn.has(en)) byEn.set(en, p);

    const xq = p.xq_id?.trim().toUpperCase();
    if (xq && !byXq.has(xq)) byXq.set(xq, p);
  }

  return { byZh, byEn, byXq };
}

export function lookupPlayer(input: string, indexes: PlayerIndexes): Player | null {
  const raw = input.trim();
  if (!raw) return null;

  const compact = raw.replace(/\s/g, "").toUpperCase();
  if (/^XQ\d+$/i.test(compact)) {
    return indexes.byXq.get(compact) ?? null;
  }

  const zhKey = normZh(raw);
  const fromZh = indexes.byZh.get(zhKey);
  if (fromZh) return fromZh;

  const enKey = normEn(raw);
  const fromEn = indexes.byEn.get(enKey);
  if (fromEn) return fromEn;

  return null;
}

export function displayNameForPlayer(p: Player): string {
  const zh = normZh(p.name_zh);
  const en = normSpaces(p.name_en);
  if (zh) return p.name_zh.trim();
  if (en) return en;
  return p.xq_id;
}
