'use client';

import { Users, Video, Mic, FileText, TrendingUp } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  iconType: 'users' | 'video' | 'audio' | 'text';
  gradient: string;
  bgGradient: string;
  change?: string;
  index?: number;
}

const ICON_MAP = {
  users: Users,
  video: Video,
  audio: Mic,
  text: FileText,
};

export function StatCard({
  label,
  value,
  iconType,
  gradient,
  bgGradient,
  change,
  index = 0,
}: StatCardProps) {
  const Icon = ICON_MAP[iconType];

  return (
    <div
      className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 hover:border-slate-700/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Label */}
        <p className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wide">
          {label}
        </p>

        {/* Value */}
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-white tracking-tight">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>

          {/* Change indicator */}
          {change && (
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              {change}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}