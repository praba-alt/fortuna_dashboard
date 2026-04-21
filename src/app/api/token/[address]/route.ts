import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const sql = `
      SELECT
        lp.*,
        row_to_json(t.*) AS token
      FROM liquidity_pools lp
      JOIN tokens t ON t.token_id = lp.token_id
      WHERE lower(lp.pool_address) = lower($1)
      LIMIT 1
    `;
    const res = await pool.query(sql, [address]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
