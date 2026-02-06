"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { CategoryInfo } from "@/app/lib/index";

type Props = {
  mode: "create" | "edit";
  initialData?: CategoryInfo;
  onSave: (category: CategoryInfo) => void;
  onCancel: () => void;
};

export default function CategoryForm({
  initialData,
  onSave,
  onCancel,
}: Props) {
  const [category, setCategory] = useState<CategoryInfo>(
    initialData ?? {
      id: "2",
      label: "",
      description: "",
      icon: "📁",
    },
  );

  // Liste des icônes possibles
  const icons = ["📁", "📄", "📦", "📝", "🎨", "🔧","💭","✨","📚","⚖️","🎭"];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 max-w-md mx-auto">
      <div className="space-y-5 mb-6">

        {/* Icône */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Icône</label>
          <select
            value={category.icon}
            onChange={(e) => setCategory({ ...category, icon: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                       text-slate-100 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {icons.map((iconOption) => (
              <option key={iconOption} value={iconOption}>
                {iconOption}
              </option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Nom de la catégorie</label>
          <input
            value={category.label}
            onChange={(e) => setCategory({ ...category, label: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                       text-slate-100 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : Documentation"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Description</label>
          <textarea
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
            rows={4}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                       text-slate-100 placeholder-slate-500 resize-none
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Décris brièvement cette catégorie…"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSave(category)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-indigo-600 hover:bg-indigo-500
                     text-white font-medium transition"
        >
          <Save size={18} /> Sauvegarder
        </button>

        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-slate-800 hover:bg-slate-700
                     text-slate-300 transition"
        >
          <X size={18} /> Annuler
        </button>
      </div>
    </div>
  );
}
