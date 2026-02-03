import { StatsGrid } from './StatsGrid';
import { contentService } from '@/app/lib/contentService';
import { StatCardProps } from './StatCard';

export async function StatsSection() {
  // Récupérer les statistiques de la base de données
  const dbStats = await contentService.getStats();
  const totalVisitors = await contentService.getTotalVisitors();

  // Transformer les données pour le format attendu par les cartes
  const stats: StatCardProps[] = [
    {
      label: 'Visiteurs',
      value: totalVisitors,
      iconType: 'users',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      change: '+12.5%',
    },
    {
      label: 'Vidéos',
      value: dbStats.contentsByType.video || 0,
      iconType: 'video',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      change: '+8.2%',
    },
    {
      label: 'Audios',
      value: dbStats.contentsByType.audio || 0,
      iconType: 'audio',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/20 to-orange-500/20',
      change: '+15.3%',
    },
    {
      label: 'Documents',
      value: dbStats.contentsByType.text || 0,
      iconType: 'text',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/20 to-teal-500/20',
      change: '+6.7%',
    },
  ];

  return (
    <div className="space-y-4">
      <StatsGrid stats={stats} />
    </div>
  );
}