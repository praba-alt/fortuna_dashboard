"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { fetchTokenDetails } from "@/lib/api";
import type { Token } from "@/lib/types";

type Props = {
  token: Token | null;
  onClose?: () => void;
};

type TokenDetailsResponse = {
  token?: {
    name?: string | null;
    symbol?: string | null;
    chain_id?: number | null;
    contract_address?: string | null;
    description?: string | null;
    description_optimized?: string | null;
  };
  trust_score?: number | null;
  contract_security_score?: number | null;
  trading_safety_score?: number | null;
  liquidity_distribution_score?: number | null;
  transparency_score?: number | null;
  launch_structure_score?: number | null;
  social_sentiment_score?: number | null;
  total_raised?: string | null;
  soft_cap?: string | null;
  hard_cap?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  state?: number | null;
};

export function DetailsDock({ token, onClose }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<TokenDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setDetails(null);
      setError(null);
      setLoading(false);
      return;
    }
    setCollapsed(false);
    const address = token.pool_address;
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const data = (await fetchTokenDetails(address)) as TokenDetailsResponse;
        if (cancelled) return;
        setDetails(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) return null;

  const aboutText =
    details?.token?.description_optimized ||
    details?.token?.description ||
    "No description available.";

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(12, 20, 48, 0.22)",
          zIndex: 40
        }}
      />
      <aside
        style={{
          position: "fixed",
          right: 12,
          top: 12,
          bottom: 12,
          width: collapsed ? 44 : "min(56vw, 980px)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          background: "var(--panel)",
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(8, 15, 40, 0.2)",
          zIndex: 41,
          transition: "width 160ms ease"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--line)",
            padding: "10px 12px",
            background: "#f8faff"
          }}
        >
          {!collapsed ? (
            <>
              <div style={{ fontWeight: 700 }}>
                {token.tokens?.name || "-"} ({token.tokens?.symbol || "-"})
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setCollapsed(true)}
                  title="Collapse dock"
                  aria-label="Collapse dock"
                  style={iconBtn}
                >
                  →
                </button>
                <button onClick={onClose} title="Close" aria-label="Close" style={iconBtn}>
                  ×
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              title="Expand dock"
              aria-label="Expand dock"
              style={iconBtn}
            >
              ←
            </button>
          )}
        </div>

        {!collapsed ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.3fr",
              height: "calc(100% - 49px)"
            }}
          >
            <Pane title="Token">
              <Row label="Name" value={`${token.tokens?.name || "-"} (${token.tokens?.symbol || "-"})`} />
              <Row label="Chain" value={String(token.tokens?.chain_id ?? "-")} />
              <Row label="Token Address" value={token.tokens?.contract_address || "-"} />
              <Row label="Pool Address" value={token.pool_address} />
              <Row label="Status" value={String(details?.state ?? token.state ?? "-")} />
              <Row label="Raised" value={String(details?.total_raised ?? token.total_raised ?? "-")} />
              <Row label="SoftCap" value={String(details?.soft_cap ?? token.soft_cap ?? "-")} />
              <Row label="HardCap" value={String(details?.hard_cap ?? token.hard_cap ?? "-")} />
              <Row label="Start" value={fmtDate(details?.start_date ?? token.start_date)} />
              <Row label="End" value={fmtDate(details?.end_date ?? token.end_date)} />
            </Pane>
            <Pane title="Scores">
              <Row label="Total" value={String(details?.trust_score ?? token.trust_score ?? 0)} />
              <Row label="Contract & Safety" value={String(details?.contract_security_score ?? token.contract_security_score ?? 0)} />
              <Row label="Tokenomics & Utility" value={String(details?.trading_safety_score ?? token.trading_safety_score ?? 0)} />
              <Row label="Liquidity / Locks" value={String(details?.liquidity_distribution_score ?? token.liquidity_distribution_score ?? 0)} />
              <Row label="Team / KYC" value={String(details?.transparency_score ?? token.transparency_score ?? 0)} />
              <Row label="Fundraising" value={String(details?.launch_structure_score ?? token.launch_structure_score ?? 0)} />
              <Row label="Social" value={String(details?.social_sentiment_score ?? token.social_sentiment_score ?? 0)} />
            </Pane>
            <Pane title="About">
              {loading ? "Loading..." : null}
              {error ? <div style={{ color: "var(--risk)" }}>{error}</div> : null}
              {!loading && !error ? (
                <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {aboutText}
                </div>
              ) : null}
            </Pane>
          </div>
        ) : null}
      </aside>
    </>
  );
}

function Pane({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderRight: "1px solid var(--line)", padding: 10, overflow: "auto" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 11, color: "var(--muted)" }}>{label}</div>
      <div style={{ fontSize: 12, wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

function fmtDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toISOString().slice(0, 16).replace("T", " ");
}

const iconBtn: CSSProperties = {
  border: "1px solid var(--line)",
  background: "white",
  borderRadius: 6,
  width: 28,
  height: 28,
  padding: 0,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  lineHeight: 1
};
