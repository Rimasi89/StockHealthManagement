import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

// PUT /api/portfolio/[id] — update a holding (user must own it)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { shares, avg_cost, purchase_date } = body;

  const { data, error } = await supabase
    .from("holdings")
    .update({
      ...(shares !== undefined && { shares: Number(shares) }),
      ...(avg_cost !== undefined && { avg_cost: Number(avg_cost) }),
      ...(purchase_date !== undefined && { purchase_date }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("user_id", session.user.id) // ensure user owns this row
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update holding" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/portfolio/[id] — remove a holding (user must own it)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { error } = await supabase
    .from("holdings")
    .delete()
    .eq("id", params.id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete holding" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
