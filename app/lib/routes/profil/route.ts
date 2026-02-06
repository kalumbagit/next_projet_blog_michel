// app/media/profile/[id]/route.ts
import { NextResponse } from "next/server";
import { contentService } from "@/app/lib/contentService";
import { mediaService } from "@/app/lib/mediaService";
import crypto from "crypto";

export async function GET(request: Request) {
  const profile = await contentService.getProfile();
  if (!profile) {
    return new NextResponse("Not found profil", { status: 404 });
  }

  const buffer = await mediaService.getProfileImage(profile);
  if (!buffer) {
    return new NextResponse("Not found image", { status: 404 });
  }

  const etag = crypto.createHash("md5").update(buffer).digest("hex");
  const ifNoneMatch = request.headers.get("if-none-match");

  // 🔥 LE point clé
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      ETag: etag,
      "Content-Length": body.byteLength.toString(),
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
