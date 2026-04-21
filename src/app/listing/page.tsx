"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FiltersBar } from "@/components/FiltersBar";
import { TokenTable } from "@/components/TokenTable";
import { DetailsDock } from "@/components/DetailsDock";
import { useTokens } from "@/hooks/useTokens";
import type { Token } from "@/lib/types";

export default function ListingPage() {
  const { filters, setFilters, tokens, filteredRecords, loading, error } = useTokens({
    pageSize: "20"
  });
  const [selected, setSelected] = useState<Token | null>(null);

  const page = Number(filters.page || "1");
  const pageSize = Number(filters.pageSize || "20");
  const maxPage = Math.max(1, Math.ceil(filteredRecords / pageSize));

  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>
        Listing ({loading ? "loading..." : `${tokens.length}/${filteredRecords}`})
      </h1>
      <FiltersBar filters={filters} setFilters={setFilters} />
      {error ? <div style={{ color: "var(--risk)", marginTop: 10 }}>{error}</div> : null}
      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        <TokenTable
          tokens={tokens}
          sortBy={filters.sortBy}
          order={filters.order}
          onSort={(sortBy, order) => setFilters({ ...filters, sortBy, order, page: "1" })}
          onSelect={setSelected}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button disabled={page <= 1} onClick={() => setFilters({ ...filters, page: String(page - 1) })}>
            Prev
          </button>
          <span>
            Page {page} / {maxPage}
          </span>
          <button disabled={page >= maxPage} onClick={() => setFilters({ ...filters, page: String(page + 1) })}>
            Next
          </button>
        </div>
      </div>
      <DetailsDock token={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}
