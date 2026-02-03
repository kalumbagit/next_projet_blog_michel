import { Suspense } from 'react';
import { StatsSection } from '@/app/components/ui/StatsSection';
import { ContentsSection } from '@/app/components/ui/ContentsSection';
import { StatsGridSkeleton, ContentsGridSkeleton } from '@/app/components/ui/Skeletons';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Bienvenue sur votre Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Vue d&apos;ensemble de votre contenu et statistiques
        </p>
      </div>

      {/* Stats Section avec Suspense */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* Contents Section avec Suspense */}
      <Suspense fallback={<ContentsGridSkeleton />}>
        <ContentsSection />
      </Suspense>
    </div>
  );
}