"use client";

import { useState } from "react";
import Image from "next/image";
import { updateProfileAction } from "@/app/lib/actions";
import type { Profile } from "@/app/lib/index";
// cet import recupere le media associé pour l'afficher en previsualisation
import { b2Service } from "@/app/lib/s3_service";

// Types pour les champs complexes

// Props du composant
interface EditProfileFormProps {
  profile: Profile;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  // Normalisation des tableaux venant du backend
  function normalizeArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
  // États pour les formations et motivations (avec normalisation JSON si nécessaire)
  const [formations, setFormations] = useState<string[]>(
    normalizeArray(profile.formations),
  );
  const [motivations, setMotivations] = useState<string[]>(
    normalizeArray(profile.motivations),
  );

  // États pour la soumission et image
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    profile.imageUrl ?? "/profile.jpg",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestion de l'image de profil
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  function getString(formData: FormData, key: string): string {
    return String(formData.get(key) ?? "");
  }

  // Gestion des items génériques (motivations et formations)
  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, ""]);

  const updateItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => setter((prev) => prev.map((item, i) => (i === index ? value : item)));

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => setter((prev) => prev.filter((_, i) => i !== index));

  // Soumission vers l'action server
  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Ajouter les tableaux formations et motivations dans le FormData
      formData.set("formations", JSON.stringify(formations));
      formData.set("motivations", JSON.stringify(motivations));

      const profileFromForm: Profile = {
        id: profile.id, // important si update
        firstName: getString(formData, "firstName"),
        lastName: getString(formData, "lastName"),
        title: getString(formData, "title"),
        bio: getString(formData, "bio"),

        formations: JSON.parse(getString(formData, "formations")),
        motivations: JSON.parse(getString(formData, "motivations")),

        imageUrl: getString(formData, "imageUrl"),

        socialLinks: {
          twitter: getString(formData, "twitter"),
          linkedin: getString(formData, "linkedin"),
          email: getString(formData, "email"),
        },
      };

      const result = await updateProfileAction(profileFromForm, profileImage ?? undefined);

      if (!result.success) {
        console.error("Erreur serveur:", result.error);
      } else {
        console.log("Profil mis à jour:", result.data);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  console.log("################################################################")
  console.log(profile.imageUrl)

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl"
    >
      {/* Image de profil */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={previewUrl}
              alt="Photo de profil"
              fill
              className="object-cover"
              onError={() => setPreviewUrl(profile.imageUrl)}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Informations de base */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="firstName"
          defaultValue={profile.firstName}
          placeholder="Prénom"
          required
          className="input"
        />
        <input
          name="lastName"
          defaultValue={profile.lastName}
          placeholder="Nom"
          required
          className="input"
        />
        <input
          name="title"
          defaultValue={profile.title}
          placeholder="Titre"
          required
          className="input md:col-span-2"
        />
      </section>

      {/* Biographie */}
      <section>
        <textarea
          name="bio"
          defaultValue={profile.bio}
          rows={4}
          placeholder="Biographie"
          className="input w-full"
        />
      </section>

      {/* Formations */}
      <section>
        <h3 className="text-white font-semibold mb-4">Formations</h3>
        <div className="space-y-3">
          {normalizeArray(formations).map((value, index) => (
            <div key={index} className="flex gap-3">
              <input
                value={value}
                onChange={(e) =>
                  updateItem(setFormations, index, e.target.value)
                }
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem(setFormations, index)}
                className="px-3 text-red-400"
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(setFormations)}
            className="text-amber-400 text-sm"
          >
            + Ajouter une formation
          </button>
        </div>
      </section>

      {/* Motivations */}
      <section>
        <h3 className="text-white font-semibold mb-4">Motivations</h3>
        <div className="space-y-3">
          {normalizeArray(motivations).map((value, index) => (
            <div key={index} className="flex gap-3">
              <input
                value={value}
                onChange={(e) =>
                  updateItem(setMotivations, index, e.target.value)
                }
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem(setMotivations, index)}
                className="px-3 text-red-400"
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(setMotivations)}
            className="text-purple-400 text-sm"
          >
            + Ajouter une motivation
          </button>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input
          name="twitter"
          defaultValue={profile.socialLinks?.twitter}
          placeholder="Twitter"
          className="input"
        />
        <input
          name="linkedin"
          defaultValue={profile.socialLinks?.linkedin}
          placeholder="LinkedIn"
          className="input"
        />
        <input
          name="email"
          defaultValue={profile.socialLinks?.email}
          placeholder="Email"
          type="email"
          className="input"
        />
      </section>

      {/* Champ caché image URL */}
      <input type="hidden" name="imageUrl" value={profile.imageUrl ?? ""} />

      {/* Soumission */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer le profil"}
      </button>
    </form>
  );
}
