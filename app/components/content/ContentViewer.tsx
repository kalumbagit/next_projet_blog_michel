"use client";

import { useState } from "react";
import { Content } from "@/app/lib/index";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Headphones, BookOpen, Clock } from "lucide-react";
import Image from "next/image";

interface ContentViewerProps {
  content: Content;
  onClose: () => void;
}

type ViewMode = "media" | "transcription";

export function ContentViewer({ content, onClose }: ContentViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("media");
  const [isPlaying, setIsPlaying] = useState(false);
  const hasTranscription = content.transcription || content.textContent;

  // Parse tags
  let parsedTags: string[] = [];
  if (typeof content.tags === "string") {
    try {
      const obj = JSON.parse(content.tags);
      parsedTags = Array.isArray(obj) ? obj : Object.keys(obj);
    } catch {
      parsedTags = [content.tags];
    }
  } else if (Array.isArray(content.tags)) {
    parsedTags = content.tags;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-serif font-semibold text-white truncate max-w-[60%]"
            >
              {content.title}
            </motion.h2>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* View mode toggle */}
          {hasTranscription && content.type !== "text" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mb-6"
            >
              <button
                onClick={() => setViewMode("media")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                  viewMode === "media"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {content.type === "video" ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Headphones className="w-4 h-4" />
                )}
                {content.type === "video" ? "Regarder" : "Écouter"}
              </button>

              <button
                onClick={() => setViewMode("transcription")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                  viewMode === "transcription"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Lire la transcription
              </button>
            </motion.div>
          )}

          {/* Content display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Video / Thumbnail */}
            {content.type === "video" && viewMode === "media" && (
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg mb-8 flex items-center justify-center">
                {!isPlaying ? (
                  <div
                    className="w-full h-full relative cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  >
                    {content.thumbnailUrl ? (
                      <Image
                        src={`/lib/routes/thumail/${content.id}`}
                        alt="Thumbnail"
                        fill
                        style={{ objectFit: "cover" }}
                        loader={({ src }) => src} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Play className="w-16 h-16 text-yellow-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-16 h-16 text-yellow-500" />
                    </div>
                  </div>
                ) : (
                  <video
                    src={`/lib/routes/video/${content.id}`}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Audio */}
            {content.type === "audio" && viewMode === "media" && (
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Headphones className="w-12 h-12 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {content.duration && `Durée: ${content.duration}`}
                    </p>
                    <div className="w-full h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-400">Lecteur audio</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Text / Transcription */}
            {(content.type === "text" || viewMode === "transcription") && (
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
                <article className="prose prose-invert prose-lg max-w-none">
                  <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {content.type === "text"
                      ? content.textContent
                      : content.transcription}
                  </div>
                </article>
              </div>
            )}
          </motion.div>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {content.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {content.duration}
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {parsedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-gray-800 text-sm text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
