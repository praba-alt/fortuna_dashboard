"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Token } from "@/lib/types";

type MetricKey =
  | "trust_score"
  | "contract_security_score"
  | "trading_safety_score"
  | "liquidity_distribution_score"
  | "transparency_score"
  | "launch_structure_score"
  | "social_sentiment_score";

const METRICS: { key: MetricKey; label: string }[] = [
  { key: "trust_score", label: "Total" },
  { key: "contract_security_score", label: "Contract" },
  { key: "trading_safety_score", label: "Tokenomics" },
  { key: "liquidity_distribution_score", label: "Liquidity" },
  { key: "transparency_score", label: "Team/KYC" },
  { key: "launch_structure_score", label: "Fundraising" },
  { key: "social_sentiment_score", label: "Social" }
];

export function ScorePies({ tokens }: { tokens: Token[] }) {
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const cards = useMemo(() => {
    const rows = METRICS.map((m) => {
      const vals = tokens.map((t) => Number(t[m.key] ?? 0));
      const total = vals.reduce((a, b) => a + b, 0);
      const avg = vals.length ? total / vals.length : 0;
      return { ...m, avg };
    });
    rows.sort((a, b) => (sort === "desc" ? b.avg - a.avg : a.avg - b.avg));
    return rows;
  }, [sort, tokens]);

  return (
    <section style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 700 }}>Score Type Pie (Sortable)</div>
        <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")} style={fieldStyle}>
          <option value="desc">Sort avg DESC</option>
          <option value="asc">Sort avg ASC</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 10 }}>
        {cards.map((c) => (
          <div key={c.key} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 8 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.label}</div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `conic-gradient(var(--accent) ${Math.max(0, Math.min(100, c.avg))}%, #e5e9f6 0)`
              }}
            />
            <div style={{ marginTop: 6, fontWeight: 700 }}>{c.avg.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const fieldStyle: CSSProperties = {
  padding: "6px 8px",
  border: "1px solid var(--line)",
  borderRadius: 8,
  background: "white"
};
