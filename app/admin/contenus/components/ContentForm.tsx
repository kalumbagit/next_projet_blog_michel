"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, X, Plus } from "lucide-react";
import { CategoryInfo, ContentType } from "@/app/lib/index";

type Props = {
  categories: CategoryInfo[];
  onCreate: (data: FormData) => void;
};

export default function ContentForm({ categories, onCreate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "video" as ContentType,
    category: "",
    transcription: "",
    textContent: "",
    duration: "",
    publishedAt: new Date().toISOString(),
    tags: [] as string[],
    mediaFile: undefined as File | undefined,
    thumbnailFile: undefined as File | undefined,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const isMedia = form.type === "video" || form.type === "audio";

  function reset() {
    setForm({
      title: "",
      description: "",
      type: "video",
      category: "",
      transcription: "",
      textContent: "",
      duration: "",
      publishedAt: new Date().toISOString(),
      tags: [],
      mediaFile: undefined,
      thumbnailFile: undefined,
    });
    setThumbnailPreview(null);
    setTagInput("");
  }

  function handleAddTag() {
    const value = tagInput.trim();
    if (!value || form.tags.includes(value)) return;

    setForm({ ...form, tags: [...form.tags, value] });
    setTagInput("");
  }

  function handleRemoveTag(tag: string) {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  }

  function handleSubmit() {
    if (!form.title || !form.category) return;

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("type", form.type);
    data.append("category", form.category);
    data.append("publishedAt", form.publishedAt);
    data.append("tags", JSON.stringify(form.tags));

    if (form.duration) {
      data.append("duration", form.duration);
    }

    if (form.transcription) {
      data.append("transcription", form.transcription);
    }

    if (form.type === "text") {
      data.append("textContent", form.textContent);
    }

    if (form.mediaFile) {
      data.append("media", form.mediaFile);
    }

    if (form.thumbnailFile) {
      data.append("thumbnail", form.thumbnailFile);
    }

    onCreate(data);
    reset();
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
      >
        Ajouter un contenu
      </button>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white">Nouveau contenu</h3>

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
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Description */}
      <textarea
        className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white resize-none"
        placeholder="Description"
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
        <option value="">Sélectionner une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* TAGS */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Tags</label>

        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 px-4 py-2 bg-slate-800 rounded-lg text-white"
            placeholder="Ajouter un tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 bg-slate-700 rounded-lg text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-sm text-white"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* MEDIA MODE */}
      {isMedia && (
        <>
          {/* Duration */}
          <input
            className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white"
            placeholder="Durée (ex: 05:32 ou 01:12:45)"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          {/* Thumbnail */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Couverture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setForm({ ...form, thumbnailFile: file });
                setThumbnailPreview(URL.createObjectURL(file));
              }}
              className="text-white"
            />

            {thumbnailPreview && (
              <div className="relative mt-3 h-32 w-full overflow-hidden rounded-lg">
                <Image
                  src={thumbnailPreview}
                  alt="Prévisualisation couverture"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Media */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Fichier {form.type}
            </label>
            <input
              type="file"
              accept={form.type === "video" ? "video/*" : "audio/*"}
              onChange={(e) =>
                setForm({ ...form, mediaFile: e.target.files?.[0] })
              }
              className="text-white"
            />
          </div>

          {/* Transcription */}
          <textarea
            className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white resize-none"
            placeholder="Transcription (texte)"
            rows={4}
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
          placeholder="Contenu du texte"
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
          onClick={() => {
            reset();
            setIsOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </div>
  );
}
