import { NextRequest, NextResponse } from "next/server";

// Passthrough proxy for the cvMatchly external jobs feed.
// The API key stays server-side; the client only ever calls our own /api/jobs route.
const JOBS_API_URL = process.env.JOBS_API_URL ?? "https://demo.cvmatchly.ai/api/public/jobs";
const JOBS_API_KEY = process.env.JOBS_API_KEY ?? "";

// Filters/params supported by the upstream cvMatchly jobs endpoint.
const FORWARDED_PARAMS = [
  "q",
  "source",
  "location",
  "role",
  "level",
  "jobType",
  "industry",
  "remoteMode",
  "sponsorship",
  "datePosted",
  "page",
  "pageSize",
];

export async function GET(request: NextRequest) {
  if (!JOBS_API_KEY) {
    return NextResponse.json(
      { error: "Jobs API key is not configured" },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const upstreamUrl = new URL(JOBS_API_URL);

  for (const param of FORWARDED_PARAMS) {
    const value = searchParams.get(param);
    if (value) upstreamUrl.searchParams.set(param, value);
  }

  // Cap pageSize at 100 as documented by the upstream API.
  const pageSize = upstreamUrl.searchParams.get("pageSize");
  if (pageSize && Number(pageSize) > 100) {
    upstreamUrl.searchParams.set("pageSize", "100");
  }

  // Auth is via ?key= query param (confirmed by provider; header-based auth is not supported).
  upstreamUrl.searchParams.set("key", JOBS_API_KEY);

  try {
    const upstreamRes = await fetch(upstreamUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    const contentType = upstreamRes.headers.get("content-type") ?? "";

    if (!upstreamRes.ok || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Failed to fetch jobs from upstream provider" },
        { status: 502 },
      );
    }

    const data = await upstreamRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 502 },
    );
  }
}
