"use server";

import { b2Service } from "./s3_service";
import { revalidatePath } from "next/cache";
import { Profile, CategoryInfo, Content, ContentType } from "@/app/lib/index";
import { contentService } from "@/app/lib/contentService";

export async function updateProfileAction(formData: Profile, imageFile?: File) {
  try {
    let profileUrl = formData.imageUrl;

    // Si une nouvelle image est fournie, l'uploader
    if (imageFile) {
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const extension = imageFile.name.split(".").pop();
      const fileName = `profiles/${timestamp}-profile.${extension}`;

      try {
        // Convertir le File en Buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload vers B2
        profileUrl = await b2Service.uploadFile(fileName, buffer);
      } catch (error) {
        throw `cette erreur est lié au service S3 : ${error}`;
      }

      // Optionnel: supprimer l'ancienne image si elle existe
      if (formData.imageUrl && formData.imageUrl.startsWith("http")) {
        try {
          // Extraire le nom du fichier de l'ancienne URL
          const oldFileName = formData.imageUrl.split("/").pop();
          if (oldFileName) {
            await b2Service.deleteFile(`profiles/${oldFileName}`);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image:",
            error,
          );
          // Continue même si la suppression échoue
        }
      }
    }

    // Ici, sauvegarder les données dans votre base de données
    formData.imageUrl = profileUrl;

    await contentService.updateProfile(formData);

    // Revalider le cache de la page
    revalidatePath("/admin/profil");
    revalidatePath(`/lib/routes/profil`);

    return {
      success: true,
      data: {
        ...formData,
        profileUrl,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le profil",
    };
  }
}

export async function createProfile(formData: FormData, imageFile?: File) {
  try {
    let profileUrl = "/images/default-avatar.png";

    // Si une image est fournie, l'uploader
    if (imageFile) {
      const timestamp = Date.now();
      const fileName = `profiles/${timestamp}-${imageFile.name}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      profileUrl = await b2Service.uploadFile(fileName, buffer);
    }

    // Sauvegarder le nouveau profil dans la base de données
    /*
    const newProfile = await prisma.profile.create({
      data: {
        nom: formData.nom,
        email: formData.email,
        profileUrl: profileUrl,
        motivations: {
          create: formData.motivations.map((m) => ({ texte: m.texte })),
        },
        formations: {
          create: formData.formations.map((f) => ({
            titre: f.titre,
            etablissement: f.etablissement,
            annee: f.annee,
          })),
        },
      },
    });
    */

    revalidatePath("/profile");

    return {
      success: true,
      data: {
        ...formData,
        profileUrl,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la création du profil:", error);
    return {
      success: false,
      error: "Impossible de créer le profil",
    };
  }
}

// mehodes pour gerer les categories

export async function createCategoryAction(data: CategoryInfo) {
  try {
    const d = Date.now().toString();
    data.id = d;
    const category = await contentService.createCategory(data);
    revalidatePath("/admin/categories");

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Erreur création catégorie:", error);
    return {
      success: false,
      error: `Impossible de créer la catégorie: ${error}`,
    };
  }
}

export async function updateCategoryAction(id: string, data: CategoryInfo) {
  try {
    const category = await contentService.updateCategory(id, data);
    revalidatePath("/admin/categories");

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      error: `Impossible de mettre à jour la catégorie: ${error}`,
    };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const category = await contentService.deleteCategory(id);
    revalidatePath("/admin/categories");

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      error: `Impossible de supprimer la catégorie: ${error}`,
    };
  }
}

//  methodes pour gerer les contenus (videos, audios, etc.) peuvent etre ajoutées ici

export async function createContentAction(data: FormData) {
  /**
   * =========================
   * 1. Récupération des fichiers
   * =========================
   */
  const mediaFile = data.get("media") as File | null;
  const thumbnailFile = data.get("thumbnail") as File | null;

  let mediaUrl: string | undefined;
  let thumbnailUrl: string | undefined;

  /**
   * =========================
   * 2. Upload du média (audio / vidéo)
   * =========================
   * - Le fichier vient du FormData
   * - Conversion en Buffer (Node.js)
   * - Upload vers le service de stockage (B2 ici)
   */
  if (mediaFile) {
    const timestamp = Date.now();
    const extension = mediaFile.name.split(".").pop();

    const fileName = `contents/${timestamp}-content.${extension}`;

    const arrayBuffer = await mediaFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    mediaUrl = await b2Service.uploadFile(fileName, buffer);
  }

  /**
   * =========================
   * 3. Upload de la miniature (cover)
   * =========================
   */
  if (thumbnailFile) {
    const timestamp = Date.now();
    const extension = thumbnailFile.name.split(".").pop();

    const fileName = `thumbnails/${timestamp}-thumbnail.${extension}`;

    const arrayBuffer = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    thumbnailUrl = await b2Service.uploadFile(fileName, buffer);
  }

  /**
   * =========================
   * 4. Construction de l'objet Content
   * =========================
   * - Les URLs sont injectées uniquement si présentes
   * - Le serveur reste maître des chemins finaux
   */
  const contentData: Omit<Content, "id" | "createdAt"> = {
    title: data.get("title") as string,
    description: data.get("description") as string,
    type: data.get("type") as ContentType,
    category: data.get("category") as string,
    publishedAt: data.get("publishedAt") as string,

    transcription: (data.get("transcription") as string) || undefined,
    textContent: (data.get("textContent") as string) || undefined,
    duration: data.get("duration") as string,

    mediaUrl,
    thumbnailUrl,
    tags: [], // Les tags peuvent être gérés à part ou ajoutés ici selon la structure du FormData
  };

  /**
   * =========================
   * 6. Persistance
   * =========================
   */
  const createdContent = await contentService.createContent(contentData);

  revalidatePath("/admin/contenus");

  return createdContent;
}

export async function updateContentAction(id: string, data: FormData) {
  /**
   * ================================
   * 1️⃣ Vérifier que le contenu existe
   * ================================
   */
  const content = await contentService.getContentById(id);

  if (!content) {
    throw new Error("Contenu non trouvé");
  }

  /**
   * ================================
   * 2️⃣ Gestion des fichiers (media / thumbnail)
   * ================================
   * 👉 On ne remplace un fichier QUE s'il est fourni
   * 👉 Sinon on conserve l’URL existante
   */
  let mediaUrl = content.mediaUrl;
  let thumbnailUrl = content.thumbnailUrl;

  const mediaFile = data.get("media") as File | null;
  const thumbnailFile = data.get("thumbnail") as File | null;

  /**
   * --- MEDIA (vidéo / audio) ---
   */
  if (mediaFile && mediaFile.size > 0) {
    // Supprimer l’ancien fichier si présent
    if (mediaUrl && mediaUrl.startsWith("http")) {
      const oldFileName = mediaUrl.split("/").pop();
      if (oldFileName) {
        await b2Service.deleteFile(`contents/${oldFileName}`);
      }
    }

    // Upload du nouveau fichier
    const extension = mediaFile.name.split(".").pop();
    const fileName = `contents/${Date.now()}-content.${extension}`;

    const buffer = Buffer.from(await mediaFile.arrayBuffer());
    mediaUrl = await b2Service.uploadFile(fileName, buffer);
  }

  /**
   * --- THUMBNAIL ---
   */
  if (thumbnailFile && thumbnailFile.size > 0) {
    // Supprimer l’ancienne image si présente
    if (thumbnailUrl && thumbnailUrl.startsWith("http")) {
      const oldThumbName = thumbnailUrl.split("/").pop();
      if (oldThumbName) {
        await b2Service.deleteFile(`thumbnails/${oldThumbName}`);
      }
    }

    // Upload de la nouvelle image
    const extension = thumbnailFile.name.split(".").pop();
    const fileName = `thumbnails/${Date.now()}-thumbnail.${extension}`;

    const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
    thumbnailUrl = await b2Service.uploadFile(fileName, buffer);
  }

  /**
   * ================================
   * 3️⃣ Construction des données à mettre à jour
   * ================================
   * 👉 On lit les champs textuels depuis le FormData
   * 👉 On garde l’existant si non fourni
   */
  const updatedData: Partial<Content> = {
    title: (data.get("title") as string) ?? content.title,
    description: (data.get("description") as string) ?? content.description,
    type: (data.get("type") as ContentType) ?? content.type,
    category: (data.get("category") as string) ?? content.category,
    publishedAt: (data.get("publishedAt") as string) ?? content.publishedAt,

    transcription:
      (data.get("transcription") as string) ?? content.transcription,

    textContent: (data.get("textContent") as string) ?? content.textContent,

    duration: data.get("duration")
      ? (data.get("duration") as string)
      : content.duration,

    tags: data.get("tags")
      ? JSON.parse(data.get("tags") as string)
      : content.tags,

    mediaUrl,
    thumbnailUrl,
  };

  /**
   * ================================
   * 4️⃣ Mise à jour en base
   * ================================
   */
  const updated = await contentService.updateContent(id, updatedData);

  /**
   * ================================
   * 5️⃣ Revalidation du cache Next.js
   * ================================
   */
  revalidatePath("/admin/contenus");

  return updated;
}

/**
 * Supprime un contenu ainsi que tous les fichiers associés.
 *
 * Étapes :
 * 1. Récupère le contenu depuis la base de données
 * 2. Supprime les fichiers médias associés (contenu + miniature) du stockage distant
 * 3. Supprime l'entrée en base de données
 * 4. Invalide le cache Next.js pour refléter la suppression côté UI
 *
 * @param id - Identifiant unique du contenu à supprimer
 *
 * @throws Error si le contenu n'existe pas
 */
export async function deleteContentAction(id: string) {
  // 1️⃣ Vérification de l'existence du contenu
  const content = await contentService.getContentById(id);

  if (!content) {
    throw new Error("Contenu non trouvé");
  }

  // 2️⃣ Suppression du fichier média principal (audio / vidéo)
  if (content.mediaUrl && content.mediaUrl.startsWith("http")) {
    const mediaFileName = content.mediaUrl.split("/").pop();

    try {
      if (mediaFileName) {
        await b2Service.deleteFile(`contents/${mediaFileName}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier média :", error);
    }
  }

  // 3️⃣ Suppression de la miniature associée
  if (content.thumbnailUrl && content.thumbnailUrl.startsWith("http")) {
    const thumbnailFileName = content.thumbnailUrl.split("/").pop();

    if (thumbnailFileName) {
      await b2Service.deleteFile(`thumbnails/${thumbnailFileName}`);
    }
  }

  // 4️⃣ Invalidation du cache Next.js pour mettre à jour l’UI
  revalidatePath("/admin/contenus");

  // 5️⃣ Suppression définitive du contenu en base
  return await contentService.deleteContent(id);
}
