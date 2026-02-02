"use server";

import { Profile } from "@/app/lib";
import { contentService } from "@/app/lib/contentService";
import fs from "fs";
import path from "path";
import { b2Service } from "./s3_service";

export async function updateProfileAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 👉 récupération du fichier image (si présent)
    const imageFile = formData.get("image");

    let imageUrl = String(formData.get("imageUrl") || "").trim();

    // 👉 si une nouvelle image est transmise, on l’envoie au service
    if (imageFile instanceof File && imageFile.size > 0) {
      // Convertir le File en Buffer pour B2
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Créer un nom unique pour le fichier
      const fileName = `profiles/${Date.now()}-${imageFile.name}`;

      // Appel correct de b2Service
      imageUrl = await b2Service.uploadFile(fileName, buffer);
    }

    const profileData: Partial<Profile> = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      bio: String(formData.get("bio") || "").trim(),
      imageUrl,
      formations: JSON.parse(String(formData.get("formations") || "[]")),
      motivations: JSON.parse(String(formData.get("motivations") || "[]")),
      socialLinks: {
        twitter: String(formData.get("twitter") || "") || undefined,
        linkedin: String(formData.get("linkedin") || "") || undefined,
        email: String(formData.get("email") || "") || undefined,
      },
    };

    if (
      !profileData.firstName ||
      !profileData.lastName ||
      !profileData.title ||
      !profileData.bio
    ) {
      throw new Error("Champs obligatoires manquants");
    }

    await contentService.updateProfile(profileData);

    return { success: true };
  } catch (error) {
    // 🧾 log fichier
    try {
      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

      const logFile = path.join(logsDir, `profile-error-${Date.now()}.log`);

      fs.writeFileSync(
        logFile,
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            formData: Object.fromEntries(formData.entries()),
            error:
              error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error,
          },
          null,
          2,
        ),
        "utf-8",
      );
    } catch {}

    return { success: false, error: "UPDATE_PROFILE_FAILED" };
  }
}
