"use client";

import { Edit2, Trash2 } from "lucide-react";
import { CategoryInfo } from "@/app/lib/index";
import CategoryForm from "./CategoryForm";

type Props = {
  category: CategoryInfo;
  index: number;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (category: CategoryInfo) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
};

export default function CategoryRow({
  category,
  index,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: Props) {
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-red-500",
  ];

  const gradient = gradients[index % gradients.length];

  // 🔁 MODE ÉDITION
  if (isEditing) {
    return (
      <CategoryForm
        mode="edit"
        initialData={category}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  // 👀 MODE LECTURE
  return (
    <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 hover:border-slate-700/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-6">
        {/* Icon */}
        <div
          className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}
        >
          {category.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1">
            {category.label}
          </h3>
          <p className="text-slate-400 line-clamp-1">
            {category.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(category.id)}
            className="p-3 bg-slate-800 text-amber-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition"
          >
            <Edit2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(category.id)}
            className="p-3 bg-slate-800 text-rose-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
