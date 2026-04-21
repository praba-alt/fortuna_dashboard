import {
  DEFAULT_FILTERS,
  type DashboardStats,
  type Filters,
  type TokenListResponse
} from "@/lib/types";

export async function fetchTokens(filters: Partial<Filters>): Promise<TokenListResponse> {
  const merged: Filters = { ...DEFAULT_FILTERS, ...filters };
  const params = new URLSearchParams(
    Object.entries(merged).filter(([, v]) => v !== "")
  );
  const res = await fetch(`/api/token-list?${params.toString()}`, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`token-list failed: ${res.status}`);
  }
  return (await res.json()) as TokenListResponse;
}

export async function fetchTokenDetails(address: string): Promise<unknown> {
  const res = await fetch(`/api/token/${address}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`token details failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard-stats", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`dashboard stats failed: ${res.status}`);
  }
  return (await res.json()) as DashboardStats;
}

export function toNumber(value: string | null | number): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
