"use server";


import { b2Service } from "./s3_service";
import { revalidatePath } from "next/cache";
import { Profile } from "@/app/lib/index";
import { contentService } from "@/app/lib/contentService";



export async function updateProfileAction(formData: Profile, imageFile?: File) {
  try {
    let profileUrl = formData.imageUrl;

    // Si une nouvelle image est fournie, l'uploader
    if (imageFile) {
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const fileName = `profiles/${timestamp}-${imageFile.name}`;

      try {
        // Convertir le File en Buffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload vers B2
      profileUrl = await b2Service.uploadFile(fileName, buffer);
      } catch (error) {
          throw (`${error} cette erreur est lié au service S3`)
      }

      // Optionnel: supprimer l'ancienne image si elle existe
      if (formData.imageUrl && formData.imageUrl.startsWith("http")) {
        try {
          // Extraire le nom du fichier de l'ancienne URL
          const oldFileName = formData.imageUrl.split("/").pop();
          if (oldFileName) {
            await b2Service.deleteFile(oldFileName);
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de l'ancienne image:", error);
          // Continue même si la suppression échoue
        }
      }
    }

    // Ici, sauvegarder les données dans votre base de données
    formData.imageUrl=profileUrl

    await contentService.updateProfile(formData)
    

    // Revalider le cache de la page
    revalidatePath("/admin/profil");
    revalidatePath("/admin/profil/edit");

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