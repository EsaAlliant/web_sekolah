import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from "@/services/search.service";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await getSearchResults(query);
  return NextResponse.json({ results });
}
