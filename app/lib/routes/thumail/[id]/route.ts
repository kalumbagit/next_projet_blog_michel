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
  if (!content) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await mediaService.getContentThumbnail(content);
  if (!buffer) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": buffer.byteLength.toString(),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
