"use server";

import { Profile } from "@/app/lib";
import { contentService } from "@/app/lib/contentService";
import fs from "fs";
import path from "path";
import { b2Service } from "./s3_service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData): Promise<void> {
  try {
    // récupération du fichier image (si présent)
    const imageFile = formData.get("image");

    let imageUrl = String(formData.get("imageUrl") || "").trim();

    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `profiles/${Date.now()}-${imageFile.name}`;
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

    // update dans la base de données
    await contentService.updateProfile(profileData);

    // 🔄 revalider le cache de la page admin/profil
    revalidatePath("/admin/profil");

    // 🔀 rediriger vers /admin/profil
    redirect("/admin/profil");

  } catch (error) {
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
          2
        ),
        "utf-8"
      );
    } catch {}

    // ici on peut lancer une erreur pour que Next affiche une page d'erreur
    throw error;
  }
}
