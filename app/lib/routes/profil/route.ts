// app/media/profile/[id]/route.ts
import { NextResponse } from "next/server";
import { contentService } from "@/app/lib/contentService";
import { mediaService } from "@/app/lib/mediaService";

export async function GET() {
  const profile = await contentService.getProfile();
  if (!profile) {
    return new NextResponse("Not found profil ", { status: 404 });
  }

  const buffer = await mediaService.getProfileImage(profile);
  if (!buffer) {
    return new NextResponse("Not found image", { status: 404 });
  }

  

  // ✅ Node Buffer → Web body
  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": body.byteLength.toString(),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
