import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function n(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

export async function GET() {
  try {
    const now = new Date();

    const totalsSql = `
      SELECT
        COUNT(*)::int AS total_pools,
        SUM(CASE WHEN COALESCE(lp.trust_score, 0) >= 60 THEN 1 ELSE 0 END)::int AS strong,
        SUM(CASE WHEN COALESCE(lp.trust_score, 0) >= 35 AND COALESCE(lp.trust_score, 0) < 60 THEN 1 ELSE 0 END)::int AS medium,
        SUM(CASE WHEN COALESCE(lp.trust_score, 0) < 35 THEN 1 ELSE 0 END)::int AS risky,
        SUM(
          CASE
            WHEN lp.state = 0
              AND (lp.start_date IS NULL OR lp.start_date <= $1)
              AND (lp.end_date IS NULL OR lp.end_date >= $1)
            THEN 1
            ELSE 0
          END
        )::int AS live,
        SUM(
          CASE
            WHEN lp.state = 1 OR (lp.state = 0 AND lp.end_date IS NOT NULL AND lp.end_date < $1)
            THEN 1
            ELSE 0
          END
        )::int AS ended,
        SUM(CASE WHEN lp.state = 2 THEN 1 ELSE 0 END)::int AS cancelled,
        SUM(
          CASE
            WHEN lp.state = 3 OR (lp.state = 0 AND lp.start_date > $1)
            THEN 1
            ELSE 0
          END
        )::int AS upcoming,
        SUM(
          CASE
            WHEN lp.state = 0
              AND (lp.start_date IS NULL OR lp.start_date <= $1)
              AND (lp.end_date IS NULL OR lp.end_date >= $1)
            THEN 1
            ELSE 0
          END
        )::int AS live_now,
        SUM(CASE WHEN COALESCE(lp.social_sentiment_score, 0) = 0 THEN 1 ELSE 0 END)::int AS no_social_activity,
        AVG(COALESCE(lp.trust_score, 0))::float AS avg_trust,
        AVG(COALESCE(lp.contract_security_score, 0))::float AS avg_contract,
        AVG(COALESCE(lp.trading_safety_score, 0))::float AS avg_tokenomics,
        AVG(COALESCE(lp.liquidity_distribution_score, 0))::float AS avg_liquidity,
        AVG(COALESCE(lp.transparency_score, 0))::float AS avg_team_kyc,
        AVG(COALESCE(lp.launch_structure_score, 0))::float AS avg_fundraising,
        AVG(COALESCE(lp.social_sentiment_score, 0))::float AS avg_social
      FROM liquidity_pools lp
    `;

    const chainsSql = `
      SELECT t.chain_id::int AS chain_id, COUNT(*)::int AS count
      FROM liquidity_pools lp
      JOIN tokens t ON t.token_id = lp.token_id
      GROUP BY t.chain_id
      ORDER BY count DESC
    `;

    const poolTypesSql = `
      SELECT lp.pool_type::int AS pool_type, COUNT(*)::int AS count
      FROM liquidity_pools lp
      GROUP BY lp.pool_type
      ORDER BY count DESC
    `;

    const [totalsRes, chainsRes, poolTypesRes] = await Promise.all([
      pool.query(totalsSql, [now]),
      pool.query(chainsSql),
      pool.query(poolTypesSql)
    ]);

    const row = totalsRes.rows[0] || {};

    return NextResponse.json({
      totals: {
        totalPools: n(row.total_pools),
        strong: n(row.strong),
        medium: n(row.medium),
        risky: n(row.risky),
        live: n(row.live),
        ended: n(row.ended),
        cancelled: n(row.cancelled),
        upcoming: n(row.upcoming),
        liveNow: n(row.live_now),
        noSocialActivity: n(row.no_social_activity)
      },
      averages: {
        trust: n(row.avg_trust),
        contract: n(row.avg_contract),
        tokenomics: n(row.avg_tokenomics),
        liquidity: n(row.avg_liquidity),
        teamKyc: n(row.avg_team_kyc),
        fundraising: n(row.avg_fundraising),
        social: n(row.avg_social)
      },
      chains: chainsRes.rows.map((r) => ({
        chainId: n(r.chain_id),
        count: n(r.count)
      })),
      poolTypes: poolTypesRes.rows.map((r) => ({
        poolType: r.pool_type === null ? null : n(r.pool_type),
        count: n(r.count)
      }))
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
