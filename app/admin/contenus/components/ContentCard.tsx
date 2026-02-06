"use client";

import {
  Edit2,
  Trash2,
  Video,
  Mic,
  FileText,
  Calendar,
  Tag,
} from "lucide-react";
import { Content, CategoryInfo } from "@/app/lib";
import ContentCardEdit from "@/app/admin/contenus/components/ContentCardEdit";

type Props = {
  content: Content;
  categories: CategoryInfo[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (data: FormData) => void;
  onDelete: () => void;
};

export default function ContentCard({
  content,
  categories,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: Props) {
  const typeConfig = {
    video: {
      icon: Video,
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-500/10 to-pink-500/10",
    },
    audio: {
      icon: Mic,
      gradient: "from-amber-500 to-orange-500",
      bg: "from-amber-500/10 to-orange-500/10",
    },
    text: {
      icon: FileText,
      gradient: "from-emerald-500 to-teal-500",
      bg: "from-emerald-500/10 to-teal-500/10",
    },
  };

  const config = typeConfig[content.type];
  const Icon = config.icon;

  const category = categories.find((c) => c.id === content.category);

  /* ===========================
      MODE ÉDITION
     =========================== */
  if (isEditing) {
    return (
      <ContentCardEdit
        value={content}
        categories={categories}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  /* ===========================
      MODE LECTURE
     =========================== */
  return (
    <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl overflow-hidden hover:border-slate-700/50 transition-all hover:scale-[1.02]">
      {/* Header */}
      <div className={`h-32 bg-gradient-to-br ${config.bg} relative`}>
        <div className="absolute bottom-4 left-6">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full font-medium">
            {category?.icon} {category?.label}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-slate-800 text-amber-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={onDelete}
              className="p-2 bg-slate-800 text-rose-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {content.title}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {content.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Calendar className="w-4 h-4" />
            {content.publishedAt
              ? new Date(content.publishedAt).toLocaleDateString("fr-FR")
              : "—"}
          </div>

          {content.tags?.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500">
                {content.tags.length} tag
                {content.tags.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
