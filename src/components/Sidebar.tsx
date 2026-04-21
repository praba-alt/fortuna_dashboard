"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/listing", label: "Listing" }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      style={{
        width: 220,
        background: "var(--panel)",
        borderRight: "1px solid var(--line)",
        padding: 18,
        position: "sticky",
        top: 0,
        height: "100vh"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 18 }}>Fortuna Dashboard</div>
      <nav style={{ display: "grid", gap: 8 }}>
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
                background: active ? "#eef3ff" : "transparent",
                fontWeight: active ? 700 : 500
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
