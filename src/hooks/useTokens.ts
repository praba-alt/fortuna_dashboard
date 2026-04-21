"use client";

import { useEffect, useState } from "react";
import { fetchTokens } from "@/lib/api";
import { DEFAULT_FILTERS, type Filters, type Token } from "@/lib/types";

export function useTokens(initial?: Partial<Filters>) {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, ...initial });
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredRecords, setFilteredRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTokens(filters);
        if (cancelled) return;
        setTokens(data.tokens || []);
        setFilteredRecords(data.filteredRecords || 0);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to fetch tokens");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return { filters, setFilters, tokens, filteredRecords, loading, error };
}
