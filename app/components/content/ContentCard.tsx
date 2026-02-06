"use client";

import Image from "next/image";
import { Content } from "@/app/lib/index";
import { motion } from "framer-motion";
import { Play, Headphones, FileText, Clock, Calendar } from "lucide-react";

interface ContentCardProps {
  content: Content;
  onSelect: (content: Content) => void;
  index: number;
}

const typeIcons = {
  video: Play,
  audio: Headphones,
  text: FileText,
};

const typeLabels = {
  video: "Vidéo",
  audio: "Audio",
  text: "Article",
};

const typeColors = {
  video: "bg-red-100 text-red-600",
  audio: "bg-blue-100 text-blue-600",
  text: "bg-green-100 text-green-600",
};

export function ContentCard({ content, onSelect, index }: ContentCardProps) {
  const Icon = typeIcons[content.type];

  // Assure que tags est un tableau
  let tags: string[] = [];
  if (typeof content.tags === "string") {
    try {
      const parsed = JSON.parse(content.tags);
      tags = Array.isArray(parsed) ? parsed : Object.keys(parsed);
    } catch (e) {
      console.log("Échec de la parsing des tags pour le contenu", content.id,"voici l'erreur :", e);
      tags = [content.tags];
    }
  } else if (Array.isArray(content.tags)) {
    tags = content.tags;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(content)}
      className="group cursor-pointer bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Thumbnail area */}
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />

        {content.id ? (
          <Image
            src={`/lib/routes/thumail/${content.id}`}
            alt="Thumbnail"
            fill
            style={{ objectFit: "cover" }}
            loader={({ src }) => src} // permet d’utiliser l’URL telle quelle
            className="z-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 z-0">
            <Icon className="w-16 h-16 text-gray-500/30" />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-4 left-4 z-20">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${typeColors[content.type]}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {typeLabels[content.type]}
          </span>
        </div>

        {/* Duration badge */}
        {content.duration && (
          <div className="absolute bottom-4 right-4 z-20">
            <span className="px-2.5 py-1 rounded-md bg-black/70 text-xs font-medium flex items-center gap-1.5 text-white">
              <Clock className="w-3 h-3" />
              {content.duration}
            </span>
          </div>
        )}

        {/* Play button overlay */}
        {content.type !== "text" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-15 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-black fill-current" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-serif font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {content.title}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {content.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(content.publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>

          {/* Tags */}
          <div className="flex gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-gray-700 text-xs text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
