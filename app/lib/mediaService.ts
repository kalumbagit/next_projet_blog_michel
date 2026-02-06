// app/lib/server/mediaService.ts
import { b2Service } from "@/app/lib/s3_service";
import { Content, Profile } from "@/app/lib";

export type MediaKind = "profile-image" | "content-thumbnail" | "content-media";

export const mediaService = {
  // ==========================================================================
  // PROFILE IMAGE
  // ==========================================================================

  async getProfileImage(profile: Profile): Promise<Buffer | null> {
    if (!profile.imageUrl) return null;

    try {
      const signedUrl = await b2Service.getSignedUrl(profile.imageUrl);

      const res = await fetch(signedUrl);
      if (!res.ok) {
        console.error(
          `Erreur HTTP ${res.status} lors du téléchargement de l'image de profil`,
        );
        return null;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      console.error("Impossible de récupérer l'image de profil :", err);
      return null;
    }
  },

  // ==========================================================================
  // CONTENT LIST (thumbnails only)
  // ==========================================================================

  async getContentThumbnail(content: Content): Promise<Buffer | null> {
    if (!content.thumbnailUrl) return null;

    try {
      const signedUrl = await b2Service.getSignedUrl(content.thumbnailUrl);
      const res = await fetch(signedUrl);
      if (!res.ok) {
        console.error(
          `Erreur HTTP ${res.status} lors du téléchargement de la miniature`,
        );
        return null;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      console.error("Impossible de récupérer la miniature :", err);
      return null;
    }
  },

  // ==========================================================================
  // CONTENT DETAIL (video + thumbnail)
  // ==========================================================================

  async getContentMedia(content: Content): Promise<{
    thumbnail?: Buffer;
    media?: Buffer;
  }> {
    const result: { thumbnail?: Buffer; media?: Buffer } = {};

    try {
      if (content.thumbnailUrl) {
        const signedThumbnailUrl = await b2Service.getSignedUrl(
          content.thumbnailUrl,
        );
        const resThumb = await fetch(signedThumbnailUrl);
        if (resThumb.ok) {
          result.thumbnail = Buffer.from(await resThumb.arrayBuffer());
        } else {
          console.error(`Erreur HTTP ${resThumb.status} pour la miniature`);
        }
      }

      if (content.mediaUrl) {
        const signedMediaUrl = await b2Service.getSignedUrl(content.mediaUrl);
        const resMedia = await fetch(signedMediaUrl);
        if (resMedia.ok) {
          result.media = Buffer.from(await resMedia.arrayBuffer());
        } else {
          console.error(`Erreur HTTP ${resMedia.status} pour la vidéo`);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du contenu média :", err);
    }

    return result;
  },
  
  async getContentMediaOnly(content: Content): Promise<{
    media?: Buffer;
  }> {
    const result: { media?: Buffer } = {};

    try {
      if (content.mediaUrl) {
        const signedMediaUrl = await b2Service.getSignedUrl(content.mediaUrl);
        const resMedia = await fetch(signedMediaUrl);
        if (resMedia.ok) {
          result.media = Buffer.from(await resMedia.arrayBuffer());
        } else {
          console.error(`Erreur HTTP ${resMedia.status} pour la vidéo`);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du contenu média :", err);
    }

    return result;
  },
};
