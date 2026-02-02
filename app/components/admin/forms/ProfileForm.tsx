'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, User, GraduationCap, Heart, Share2 } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { FormField } from "./FormField";
import { FileField } from "./FileField";
import { TagInput } from "./TagInput";
import { contentService } from "@/app/lib/contentService";
import { updateProfileAction } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  imageUrl: string;
  formations: string[];
  motivations: string[];
  twitter: string;
  linkedin: string;
  email: string;
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    imageUrl: "",
    formations: [],
    motivations: [],
    twitter: "",
    linkedin: "",
    email: "",
  });

  // Chargement profil
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await contentService.getProfile();

      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        title: profile.title,
        bio: profile.bio,
        imageUrl: profile.imageUrl,
        formations: profile.formations || [],
        motivations: profile.motivations || [],
        twitter: profile.socialLinks?.twitter || "",
        linkedin: profile.socialLinks?.linkedin || "",
        email: profile.socialLinks?.email || "",
      });

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const updateField = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null, dataUrl: string | null) => {
    setImageFile(file);
    updateField("imageUrl", dataUrl || "");
  }; 

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("title", formData.title);
      payload.append("bio", formData.bio);
      payload.append("twitter", formData.twitter);
      payload.append("linkedin", formData.linkedin);
      payload.append("email", formData.email);
      payload.append("imageUrl", formData.imageUrl); // dataUrl ou chemin

      if (imageFile) {
        payload.append("imageFile", imageFile);
      }

      payload.append("formations", JSON.stringify(formData.formations));
      payload.append("motivations", JSON.stringify(formData.motivations));

      // Appel explicite de l'action avec FormData
      const result = await updateProfileAction(undefined, payload);

       if (result.success) {
      router.push("/admin?success=1");
      return;
    }

    router.push("/admin?error=1");
  } catch (err) {
    console.error(err);
    router.push("/admin?error=1");
  }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Infos perso */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <User className="w-5 h-5" />
          Informations personnelles
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="Prénom"
            value={formData.firstName}
            onChange={(v) => updateField("firstName", v)}
            required
          />
          <FormField
            id="lastName"
            label="Nom"
            value={formData.lastName}
            onChange={(v) => updateField("lastName", v)}
            required
          />
        </div>

        <FormField
          id="title"
          label="Titre"
          value={formData.title}
          onChange={(v) => updateField("title", v)}
          required
        />

        <FormField
          id="bio"
          label="Bio"
          type="textarea"
          value={formData.bio}
          onChange={(v) => updateField("bio", v)}
          rows={5}
          required
        />

        <FileField
          id="profileImage"
          label="Photo de profil"
          value={formData.imageUrl}
          file={imageFile}
          onChange={handleImageChange}
        />
      </section>

      {/* Formations */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="w-5 h-5" />
          Formations
        </h3>

        <TagInput
          id="formations"
          label="Formations"
          tags={formData.formations}
          onChange={(tags) => updateField("formations", tags)}
        />
      </section>

      {/* Motivations */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Heart className="w-5 h-5" />
          Motivations
        </h3>

        <TagInput
          id="motivations"
          label="Motivations"
          tags={formData.motivations}
          onChange={(tags) => updateField("motivations", tags)}
        />
      </section>

      {/* Réseaux */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Share2 className="w-5 h-5" />
          Réseaux
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            id="twitter"
            label="Twitter / X"
            value={formData.twitter}
            onChange={(v) => updateField("twitter", v)}
          />
          <FormField
            id="linkedin"
            label="LinkedIn"
            value={formData.linkedin}
            onChange={(v) => updateField("linkedin", v)}
          />
        </div>

        <FormField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(v) => updateField("email", v)}
        />
      </section>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder
        </Button>
      </div>
    </motion.form>
  );
}
