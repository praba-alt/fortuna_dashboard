"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DashboardOverview } from "@/components/DashboardOverview";
import { fetchDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardStats();
        if (cancelled) return;
        setStats(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>Dashboard (All Records)</h1>
      {error ? <div style={{ color: "var(--risk)", marginTop: 10 }}>{error}</div> : null}
      {loading ? <div style={{ marginTop: 10 }}>Loading dashboard stats...</div> : null}
      {stats ? <div style={{ marginTop: 12 }}><DashboardOverview stats={stats} /></div> : null}
    </AppShell>
  );
}
