import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_OEMBED = "https://www.youtube.com/oembed";

export interface YoutubeOembedResponse {
  title: string;
  author_name?: string;
  thumbnail_url?: string;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("http")) {
    return NextResponse.json(
      { error: "Missing or invalid url query parameter" },
      { status: 400 }
    );
  }

  try {
    const oembedUrl = `${YOUTUBE_OEMBED}?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl, { next: { revalidate: 86400 } }); // cache 24h
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch YouTube oEmbed" },
        { status: 502 }
      );
    }
    const data = (await res.json()) as YoutubeOembedResponse;
    return NextResponse.json({ title: data.title ?? "" });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch YouTube oEmbed" },
      { status: 502 }
    );
  }
}
