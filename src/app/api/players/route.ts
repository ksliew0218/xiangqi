import { NextResponse } from "next/server";
import type { Player } from "@/types/player";

const UPSTREAM =
  "https://malaysiaxqbackend-production.up.railway.app/api/get-players/";

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 },
      );
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid upstream payload" },
        { status: 502 },
      );
    }

    return NextResponse.json(data as Player[]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch player registry" },
      { status: 502 },
    );
  }
}
