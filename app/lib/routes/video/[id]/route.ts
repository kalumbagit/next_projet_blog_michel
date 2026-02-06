import { NextResponse } from "next/server";
import { contentService } from "@/app/lib/contentService";
import { mediaService } from "@/app/lib/mediaService";

export async function GET(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> },
) {
  // unwrap params si c'est une Promise
  const params = await context.params;
  const { id } = params;
  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const content = await contentService.getContentById(id);
  if (!content?.mediaUrl) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = await mediaService.getContentMediaOnly(content);

  if (!file.media) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = new Uint8Array(file.media);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": body.byteLength.toString(),
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Accept-Ranges": "bytes",
    },
  });
}
