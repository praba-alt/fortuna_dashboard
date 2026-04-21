"use client";

import { useState } from "react";
import { CHAIN_NAMES, type DashboardStats } from "@/lib/types";
import type { CSSProperties } from "react";

export function DashboardOverview({ stats }: { stats: DashboardStats }) {
  const { totals, averages, chains, poolTypes } = stats;

  const cards = [
    { label: "Total Pools", value: totals.totalPools, color: "#1b4dff" },
    { label: "Strong", value: totals.strong, color: "var(--good)" },
    { label: "Medium", value: totals.medium, color: "var(--warn)" },
    { label: "Risky", value: totals.risky, color: "var(--risk)" },
    { label: "Live Now", value: totals.liveNow, color: "#0f766e" },
    { label: "No Social Activity", value: totals.noSocialActivity, color: "#475569" }
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 10 }}>
        {cards.map((c) => (
          <div key={c.label} style={card}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.label}</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: c.color }}>{c.value.toLocaleString()}</div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DonutCard
          title="Trust Mix"
          total={totals.totalPools}
          segments={[
            { label: "Strong", value: totals.strong, color: "var(--good)" },
            { label: "Medium", value: totals.medium, color: "var(--warn)" },
            { label: "Risky", value: totals.risky, color: "var(--risk)" }
          ]}
        />
        <DonutCard
          title="Sale Status Mix"
          total={totals.totalPools}
          segments={[
            { label: "Live", value: totals.live, color: "#0f766e" },
            { label: "Upcoming", value: totals.upcoming, color: "#f59e0b" },
            { label: "Completed", value: totals.ended, color: "#64748b" },
            { label: "Cancelled", value: totals.cancelled, color: "#dc2626" }
          ]}
        />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 12 }}>
        <Panel title="Average Category Scores">
          <ScoreRows
            rows={[
              ["Total", averages.trust],
              ["Contract", averages.contract],
              ["Tokenomics", averages.tokenomics],
              ["Liquidity", averages.liquidity],
              ["Team/KYC", averages.teamKyc],
              ["Fundraising", averages.fundraising],
              ["Social", averages.social]
            ]}
          />
        </Panel>
        <Panel title="Sale Status Mix">
          <ScoreRows
            rows={[
              ["Live", totals.live],
              ["Ended", totals.ended],
              ["Cancelled", totals.cancelled],
              ["Upcoming", totals.upcoming]
            ]}
            integer
          />
        </Panel>
        <Panel title="Pool Type Mix">
          <ScoreRows
            rows={poolTypes.map((p) => [`PoolType ${p.poolType ?? "null"}`, p.count])}
            integer
          />
        </Panel>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <Panel title="Chain-wise Distribution (All Records)">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thtd}>Chain</th>
                <th style={thtd}>Count</th>
                <th style={thtd}>Share %</th>
              </tr>
            </thead>
            <tbody>
              {chains.map((c) => {
                const pct = totals.totalPools > 0 ? (c.count / totals.totalPools) * 100 : 0;
                return (
                  <tr key={c.chainId}>
                    <td style={thtd}>{CHAIN_NAMES[c.chainId] || `Chain ${c.chainId}`}</td>
                    <td style={thtd}>{c.count.toLocaleString()}</td>
                    <td style={thtd}>{pct.toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function ScoreRows({
  rows,
  integer
}: {
  rows: Array<[string, number]>;
  integer?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map(([label, val]) => (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "140px 1fr 56px", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12 }}>{label}</div>
          <div style={{ background: "#e8eefc", height: 8, borderRadius: 999 }}>
            <div
              style={{
                width: `${Math.max(0, Math.min(100, val))}%`,
                background: "var(--accent)",
                height: 8,
                borderRadius: 999
              }}
            />
          </div>
          <div style={{ fontSize: 12, textAlign: "right" }}>{integer ? Math.round(val) : val.toFixed(1)}</div>
        </div>
      ))}
    </div>
  );
}

const card: CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 12,
  background: "var(--panel)",
  padding: 12
};

const thtd: CSSProperties = {
  border: "1px solid var(--line)",
  padding: "6px 8px",
  textAlign: "left"
};

function DonutCard({
  title,
  total,
  segments
}: {
  title: string;
  total: number;
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const [disabled, setDisabled] = useState<Record<string, boolean>>({});
  const enabledSegments = segments.filter((s) => !disabled[s.label]);
  const activeTotal = enabledSegments.reduce((sum, s) => sum + s.value, 0);
  const safeTotal = activeTotal > 0 ? activeTotal : 1;
  let cursor = 0;
  const gradientParts = enabledSegments.map((s) => {
    const pct = (s.value / safeTotal) * 100;
    const from = cursor;
    const to = Math.min(100, cursor + pct);
    cursor = to;
    return `${s.color} ${from.toFixed(2)}% ${to.toFixed(2)}%`;
  });

  return (
    <Panel title={title}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: 112, height: 112 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                gradientParts.length > 0
                  ? `conic-gradient(${gradientParts.join(", ")})`
                  : "#e5e9f6"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 12,
              borderRadius: "50%",
              background: "var(--panel)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Total</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {activeTotal.toLocaleString()}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {segments.map((s) => {
            const pct = total > 0 ? (s.value / total) * 100 : 0;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() =>
                  setDisabled((prev) => ({ ...prev, [s.label]: !prev[s.label] }))
                }
                style={{
                  display: "grid",
                  gridTemplateColumns: "14px 1fr auto auto",
                  gap: 8,
                  alignItems: "center",
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  opacity: disabled[s.label] ? 0.45 : 1
                }}
                title={disabled[s.label] ? `Show ${s.label}` : `Hide ${s.label}`}
              >
                <span style={{ width: 10, height: 10, borderRadius: 999, background: s.color }} />
                <span style={{ fontSize: 12 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{pct.toFixed(1)}%</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{s.value.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
