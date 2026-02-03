'use client';

import { Video, Mic, FileText, Eye } from 'lucide-react';

export interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'text';
  views: number;
  index?: number;
}

const TYPE_CONFIG = {
  video: {
    icon: Video,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
  },
  audio: {
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-500/10 to-orange-500/10',
  },
  text: {
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
  },
};

export function ContentCard({
  title,
  description,
  type,
  views,
  index = 0,
}: ContentCardProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 hover:border-slate-700/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Type badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${config.bgGradient} mb-4`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium capitalize">{type}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Views */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-slate-500" />
          <span className="text-slate-400 text-sm">Vues</span>
        </div>
        <span
          className={`text-xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
        >
          {views.toLocaleString('fr-FR')}
        </span>
      </div>
    </div>
  );
}