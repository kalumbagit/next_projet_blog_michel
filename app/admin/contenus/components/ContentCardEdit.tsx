"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, X } from "lucide-react";
import { Content, CategoryInfo, ContentType } from "@/app/lib";

type Props = {
  value: Content;
  categories: CategoryInfo[];
  onSave: (data: FormData) => void;
  onCancel: () => void;
};

export default function ContentCardEdit({
  value,
  categories,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    title: value.title,
    description: value.description,
    type: value.type,
    category: value.category,
    transcription: value.transcription ?? "",
    textContent: value.textContent ?? "",
    duration: value.duration ?? "",
  });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    value.thumbnailUrl ?? null
  );

  const isMedia = form.type === "video" || form.type === "audio";

  function extractFileName(url?: string) {
    if (!url) return null;
    return url.split("/").pop();
  }

  function handleSubmit() {
    const data = new FormData();

    data.append("title", form.title);
    data.append("description", form.description);
    data.append("type", form.type);
    data.append("category", form.category);
    data.append("duration", form.duration);

    if (form.transcription) {
      data.append("transcription", form.transcription);
    }

    if (form.type === "text") {
      data.append("textContent", form.textContent);
    }

    // ⚠️ uniquement si remplacé
    if (mediaFile) {
      data.append("media", mediaFile);
    }

    if (thumbnailFile) {
      data.append("thumbnail", thumbnailFile);
    }

    onSave(data);
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4 animate-slide-in">
      <h3 className="text-lg font-bold text-white">Modifier le contenu</h3>

      {/* Type */}
      <select
        className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value as ContentType })
        }
      >
        <option value="video">Vidéo</option>
        <option value="audio">Audio</option>
        <option value="text">Texte</option>
      </select>

      {/* Title */}
      <input
        className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Description */}
      <textarea
        className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white resize-none"
        rows={3}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* Category */}
      <select
        className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* MEDIA MODE */}
      {isMedia && (
        <>
          {/* Durée */}
          <input
            className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white"
            placeholder="Durée (ex: 05:32)"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          {/* Média existant */}
          {value.mediaUrl && (
            <p className="text-xs text-slate-400">
              Fichier actuel :{" "}
              <span className="text-white">
                {extractFileName(value.mediaUrl)}
              </span>
            </p>
          )}

          <input
            type="file"
            accept={form.type === "video" ? "video/*" : "audio/*"}
            onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
            className="text-white"
          />

          {/* Thumbnail */}
          {value.thumbnailUrl && (
            <p className="text-xs text-slate-400">
              Couverture actuelle :{" "}
              <span className="text-white">
                {extractFileName(value.thumbnailUrl)}
              </span>
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setThumbnailFile(file);
              setThumbnailPreview(URL.createObjectURL(file));
            }}
            className="text-white"
          />

          {thumbnailPreview && (
            <div className="relative h-32 w-full rounded-lg overflow-hidden">
              <Image
                src={thumbnailPreview}
                alt="Prévisualisation"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Transcription */}
          <textarea
            className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white resize-none"
            rows={4}
            placeholder="Transcription"
            value={form.transcription}
            onChange={(e) =>
              setForm({ ...form, transcription: e.target.value })
            }
          />
        </>
      )}

      {/* TEXT MODE */}
      {form.type === "text" && (
        <textarea
          className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white resize-none"
          rows={6}
          value={form.textContent}
          onChange={(e) =>
            setForm({ ...form, textContent: e.target.value })
          }
        />
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>

        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </div>
  );
}
