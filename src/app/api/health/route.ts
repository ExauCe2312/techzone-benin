import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ status: "error", database: message }, { status: 503 });
  }
}
