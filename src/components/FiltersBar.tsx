"use client";

import { CHAIN_NAMES, type Filters } from "@/lib/types";
import type { CSSProperties } from "react";

type Props = {
  filters: Filters;
  setFilters: (next: Filters) => void;
};

export function FiltersBar({ filters, setFilters }: Props) {
  const chainOptions = Object.entries(CHAIN_NAMES).map(([id, name]) => ({
    value: id,
    label: name
  }));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr repeat(7, minmax(0, 1fr))",
        gap: 8,
        padding: 10,
        border: "1px solid var(--line)",
        borderRadius: 12,
        background: "var(--panel)"
      }}
    >
      <input
        value={filters.search}
        placeholder="Search token/pool/address"
        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: "1" })}
        style={fieldStyle}
      />
      <select
        value={filters.chain}
        onChange={(e) => setFilters({ ...filters, chain: e.target.value, page: "1" })}
        style={fieldStyle}
      >
        <option value="">Chains</option>
        {chainOptions.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={filters.saleType}
        onChange={(e) => setFilters({ ...filters, saleType: e.target.value, page: "1" })}
        style={fieldStyle}
      >
        <option value="">Sale Types</option>
        <option value="1">Fair Launch</option>
        <option value="2">Pre Sale</option>
        <option value="4">Subscription</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: "1" })}
        style={fieldStyle}
      >
        <option value="">Status</option>
        <option value="0">Sale Live</option>
        <option value="1">Ended</option>
        <option value="2">Cancelled</option>
        <option value="3">Upcoming</option>
      </select>
      <input
        value={filters.score}
        onChange={(e) => setFilters({ ...filters, score: e.target.value, page: "1" })}
        type="number"
        min="0"
        max="100"
        placeholder="Min score"
        style={fieldStyle}
      />
      <select
        value={filters.sortBy}
        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: "1" })}
        style={fieldStyle}
      >
        <option value="created_at">Created</option>
        <option value="trust_score">Total</option>
        <option value="contract_score">Contract</option>
        <option value="social_score">Social</option>
        <option value="chain">Chain</option>
        <option value="name">Name</option>
        <option value="count_down">Countdown</option>
      </select>
      <select
        value={filters.order}
        onChange={(e) => setFilters({ ...filters, order: e.target.value as "asc" | "desc", page: "1" })}
        style={fieldStyle}
      >
        <option value="desc">DESC</option>
        <option value="asc">ASC</option>
      </select>
      <select
        value={filters.pageSize}
        onChange={(e) => setFilters({ ...filters, pageSize: e.target.value, page: "1" })}
        style={fieldStyle}
      >
        <option value="20">20 rows</option>
        <option value="50">50 rows</option>
        <option value="100">100 rows</option>
      </select>
    </div>
  );
}

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid var(--line)",
  borderRadius: 8,
  background: "#fff"
};
