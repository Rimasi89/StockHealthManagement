import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

// GET /api/portfolio — fetch all holdings for the signed-in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to fetch holdings" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/portfolio — add a new holding
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { ticker, name, sector, shares, avg_cost, purchase_date } = body;

  if (!ticker || !shares || !avg_cost) {
    return NextResponse.json({ error: "ticker, shares, and avg_cost are required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("holdings").insert({
    user_id: session.user.id,
    ticker: ticker.toUpperCase().trim(),
    name: name ?? ticker.toUpperCase(),
    sector: sector ?? "Unknown",
    shares: Number(shares),
    avg_cost: Number(avg_cost),
    purchase_date: purchase_date ?? null,
  }).select().single();

  if (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to add holding" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
