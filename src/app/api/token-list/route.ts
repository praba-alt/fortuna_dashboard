import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

const SORT_MAP: Record<string, string> = {
  created_at: "lp.created_at",
  trust_score: "lp.trust_score",
  trading_safety_score: "lp.trading_safety_score",
  liquidity_distribution_score: "lp.liquidity_distribution_score",
  transparency_score: "lp.transparency_score",
  launch_structure_score: "lp.launch_structure_score",
  count_down: "lp.end_date",
  start_date: "lp.start_date",
  end_date: "lp.end_date",
  target_raised: "lp.total_raised",
  market_cap: "lp.total_raised",
  name: "t.name",
  symbol: "t.symbol",
  chain: "t.chain_id",
  state: "lp.state",
  pool_type: "lp.pool_type",
  social_score: "lp.social_sentiment_score",
  contract_score: "lp.contract_security_score"
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
    const search = searchParams.get("search") || "";
    const pageSize = Number(searchParams.get("pageSize") || "20");
    const page = Number(searchParams.get("page") || "1");
    const chain = searchParams.get("chain") || "";
    const saleType = searchParams.get("saleType") || "";
    const status = searchParams.get("status") || "";
    const score = searchParams.get("score") || "";

    const params: Array<string | number | Date> = [];
    const where: string[] = [];

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(`(t.name ILIKE $${i} OR t.symbol ILIKE $${i} OR lp.pool_address ILIKE $${i})`);
    }

    if (chain && chain !== "0") {
      params.push(Number(chain));
      where.push(`t.chain_id = $${params.length}`);
    }

    if (status && status !== "All") {
      const now = new Date();
      if (status === "3") {
        params.push(now);
        where.push(`(lp.state = 3 OR (lp.state = 0 AND lp.start_date > $${params.length}))`);
      } else if (status === "0") {
        params.push(now);
        params.push(now);
        where.push(`lp.state = 0 AND lp.start_date <= $${params.length - 1} AND lp.end_date >= $${params.length}`);
      } else {
        params.push(Number(status));
        where.push(`lp.state = $${params.length}`);
      }
    }

    if (score && score !== "0") {
      params.push(Number(score));
      where.push(`COALESCE(lp.trust_score, 0) >= $${params.length}`);
    }

    if (saleType && saleType !== "All") {
      if (saleType === "2") {
        where.push("lp.pool_type IN (2,3,5)");
      } else {
        params.push(Number(saleType));
        where.push(`lp.pool_type = $${params.length}`);
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const sortSql = SORT_MAP[sortBy] || "lp.created_at";
    const offset = Math.max(0, (page - 1) * pageSize);

    const baseSelect = `
      SELECT
        lp.liquidity_id, lp.pool_address, lp.state, lp.pool_type, lp.trust_score,
        lp.contract_security_score, lp.trading_safety_score, lp.liquidity_distribution_score,
        lp.transparency_score, lp.launch_structure_score, lp.social_sentiment_score,
        lp.soft_cap, lp.hard_cap, lp.total_raised, lp.start_date, lp.end_date, lp.created_at,
        t.contract_address, t.name, t.symbol, t.logo_url, t.chain_id,
        c.symbol AS currency_symbol
      FROM liquidity_pools lp
      JOIN tokens t ON t.token_id = lp.token_id
      LEFT JOIN currency c ON c.currency_id = lp.currency_id
      ${whereSql}
      ORDER BY ${sortSql} ${order}
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM liquidity_pools lp
      JOIN tokens t ON t.token_id = lp.token_id
      ${whereSql}
    `;

    const [rowsRes, countRes] = await Promise.all([
      pool.query(baseSelect, params),
      pool.query(countSql, params)
    ]);

    const tokens = rowsRes.rows.map((r) => ({
      liquidity_id: r.liquidity_id,
      pool_address: r.pool_address,
      state: r.state,
      pool_type: r.pool_type,
      trust_score: r.trust_score,
      contract_security_score: r.contract_security_score,
      trading_safety_score: r.trading_safety_score,
      liquidity_distribution_score: r.liquidity_distribution_score,
      transparency_score: r.transparency_score,
      launch_structure_score: r.launch_structure_score,
      social_sentiment_score: r.social_sentiment_score,
      soft_cap: r.soft_cap,
      hard_cap: r.hard_cap,
      total_raised: r.total_raised,
      start_date: r.start_date,
      end_date: r.end_date,
      created_at: r.created_at,
      tokens: {
        contract_address: r.contract_address,
        name: r.name,
        symbol: r.symbol,
        logo_url: r.logo_url,
        chain_id: r.chain_id
      },
      currency: r.currency_symbol ? { symbol: r.currency_symbol } : null
    }));

    return NextResponse.json({
      tokens,
      filteredRecords: countRes.rows[0]?.total ?? 0
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
