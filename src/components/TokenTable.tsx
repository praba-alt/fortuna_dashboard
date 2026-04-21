"use client";

import { CHAIN_NAMES, deriveSaleStatus, saleStatusLabel, type Token } from "@/lib/types";
import type { CSSProperties } from "react";

type Props = {
  tokens: Token[];
  sortBy: string;
  order: "asc" | "desc";
  onSort?: (sortBy: string, order: "asc" | "desc") => void;
  onSelect?: (token: Token) => void;
};

export function TokenTable({ tokens, sortBy, order, onSort, onSelect }: Props) {
  const DEFAULT_SORT_BY = "created_at";
  const DEFAULT_ORDER: "asc" | "desc" = "desc";
  const sortableCols: Array<{ label: string; key?: string }> = [
    { label: "Name", key: "name" },
    { label: "Symbol", key: "symbol" },
    { label: "Total", key: "trust_score" },
    { label: "Contract", key: "contract_score" },
    { label: "Tokenomics", key: "trading_safety_score" },
    { label: "Liquidity", key: "liquidity_distribution_score" },
    { label: "Team/KYC", key: "transparency_score" },
    { label: "Fundraising", key: "launch_structure_score" },
    { label: "Social", key: "social_score" },
    { label: "Chain", key: "chain" },
    { label: "Pool" },
    { label: "Status", key: "state" },
    { label: "Type", key: "pool_type" },
    { label: "SoftCap" },
    { label: "HardCap" },
    { label: "Raised", key: "target_raised" },
    { label: "Start", key: "start_date" },
    { label: "End", key: "end_date" }
  ];

  function toggleSort(key: string) {
    if (!onSort) return;
    if (sortBy === key) {
      if (order === "desc") {
        onSort(key, "asc");
        return;
      }
      onSort(DEFAULT_SORT_BY, DEFAULT_ORDER);
      return;
    }
    onSort(key, "desc");
  }

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, background: "var(--panel)", overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {sortableCols.map((col) => (
              <th key={col.label} style={thtd}>
                {col.key ? (
                  <button
                    onClick={() => toggleSort(col.key!)}
                    style={sortBtn}
                    title={`Sort by ${col.label}`}
                  >
                    {col.label}
                    {sortBy === col.key ? (order === "asc" ? " ▲" : " ▼") : ""}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr
              key={t.liquidity_id}
              onClick={() => onSelect?.(t)}
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              <td style={thtd}>
                {t.tokens?.name || "-"}
              </td>
              <td style={thtd}>{t.tokens?.symbol || "-"}</td>
              <td style={thtd}>{t.trust_score ?? 0}</td>
              <td style={thtd}>{t.contract_security_score ?? 0}</td>
              <td style={thtd}>{t.trading_safety_score ?? 0}</td>
              <td style={thtd}>{t.liquidity_distribution_score ?? 0}</td>
              <td style={thtd}>{t.transparency_score ?? 0}</td>
              <td style={thtd}>{t.launch_structure_score ?? 0}</td>
              <td style={thtd}>{t.social_sentiment_score ?? 0}</td>
              <td style={thtd}>{CHAIN_NAMES[t.tokens?.chain_id] || t.tokens?.chain_id}</td>
              <td style={thtd}>{t.pool_address}</td>
              <td style={thtd}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: statusColor(deriveSaleStatus(t.state, t.start_date, t.end_date))
                    }}
                  />
                  {saleStatusLabel(deriveSaleStatus(t.state, t.start_date, t.end_date))}
                </span>
              </td>
              <td style={thtd}>{t.pool_type ?? "-"}</td>
              <td style={thtd}>{t.soft_cap || "-"}</td>
              <td style={thtd}>{t.hard_cap || "-"}</td>
              <td style={thtd}>{t.total_raised || "-"}</td>
              <td style={thtd}>{fmtDate(t.start_date)}</td>
              <td style={thtd}>{fmtDate(t.end_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function fmtDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toISOString().slice(0, 16).replace("T", " ");
}

const thtd: CSSProperties = {
  border: "1px solid var(--line)",
  padding: "6px 8px",
  textAlign: "left",
  whiteSpace: "nowrap"
};

const sortBtn: CSSProperties = {
  border: 0,
  background: "transparent",
  padding: 0,
  margin: 0,
  font: "inherit",
  cursor: "pointer",
  color: "inherit"
};

function statusColor(status: number): string {
  if (status === 0) return "#16a34a";
  if (status === 1) return "#64748b";
  if (status === 2) return "#dc2626";
  if (status === 3) return "#f59e0b";
  return "#64748b";
}
