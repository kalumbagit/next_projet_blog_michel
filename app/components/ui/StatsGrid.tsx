'use client';

import { StatCard, StatCardProps } from './StatCard';

interface StatsGridProps {
  stats: StatCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
}
