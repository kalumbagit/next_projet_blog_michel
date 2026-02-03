"use client";

import { useState } from "react";
import type { Profile } from "@/app/lib/index";
import { b2Service } from "@/app/lib/s3_service";

import { updateProfileAction } from "@/app/lib/actions";

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const [formations, setFormations] = useState<string[]>(
    profile.formations ?? [],
  );

  const [motivations, setMotivations] = useState<string[]>(
    profile.motivations ?? [],
  );

  const addItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => setter((prev) => [...prev, ""]);

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) =>
    setter((prev) =>
      prev.map((item, i) => (i === index ? value : item)),
    );

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


  return (
    <form
      action={updateProfileAction}
      className="max-w-5xl mx-auto space-y-10 bg-slate-900/50 border border-slate-800 rounded-2xl p-8"
    >
      {/* fallback image url */}
      <input type="hidden" name="imageUrl" value={profile.imageUrl ?? ""} />

      {/* identité */}
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

      {/* bio */}
      <section>
        <textarea
          name="bio"
          defaultValue={profile.bio}
          rows={4}
          placeholder="Biographie"
          required
          className="input w-full"
        />
      </section>

      {/* image */}
      <section>
        <label className="block text-slate-300 mb-2">
          Image de profil
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="block w-full text-slate-300"
        />
      </section>

      {/* formations */}
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

      {/* motivations */}
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

      {/* champs cachés JSON */}
      <input
        type="hidden"
        name="formations"
        value={JSON.stringify(formations)}
      />
      <input
        type="hidden"
        name="motivations"
        value={JSON.stringify(motivations)}
      />

      {/* réseaux sociaux */}
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

      {/* submit */}
      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition"
        >
          Sauvegarder le profil
        </button>
      </div>
    </form>
  );
}
