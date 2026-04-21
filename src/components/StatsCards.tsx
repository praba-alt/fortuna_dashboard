"use client";

import { CHAIN_NAMES, riskBucket, type Token } from "@/lib/types";
import type { CSSProperties } from "react";

export function StatsCards({ tokens }: { tokens: Token[] }) {
  const strong = tokens.filter((t) => riskBucket(t.trust_score) === "strong").length;
  const medium = tokens.filter((t) => riskBucket(t.trust_score) === "medium").length;
  const risky = tokens.filter((t) => riskBucket(t.trust_score) === "risky").length;

  const chainCounts = new Map<number, number>();
  for (const token of tokens) {
    const chainId = token.tokens?.chain_id ?? 0;
    chainCounts.set(chainId, (chainCounts.get(chainId) || 0) + 1);
  }
  const chainRows = Array.from(chainCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <Card label="Total" value={tokens.length} color="#1b4dff" />
        <Card label="Strong" value={strong} color="var(--good)" />
        <Card label="Medium" value={medium} color="var(--warn)" />
        <Card label="Risky" value={risky} color="var(--risk)" />
      </div>
      <div style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Chain-wise Count</div>
        <div style={{ maxHeight: 220, overflow: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTd}>Chain</th>
                <th style={thTd}>Count</th>
              </tr>
            </thead>
            <tbody>
              {chainRows.map(([chainId, count]) => (
                <tr key={chainId}>
                  <td style={thTd}>{CHAIN_NAMES[chainId] || `Chain ${chainId}`}</td>
                  <td style={thTd}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Card({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", padding: 12 }}>
      <div style={{ color: "var(--muted)", fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value.toLocaleString()}</div>
    </div>
  );
}

const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const thTd: CSSProperties = { border: "1px solid var(--line)", padding: "6px 8px", textAlign: "left" };
