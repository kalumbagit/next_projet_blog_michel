import { Eye } from 'lucide-react';
import { ContentsGrid } from './ContentsGrid';
import { contentService } from '@/app/lib/contentService';
import { ContentCardProps } from './ContentCard';

export async function ContentsSection() {
  // Récupérer les contenus avec leurs vues depuis la base de données
  const contentsWithViews = await contentService.getContentsWithViews();

  // Transformer les données pour le format attendu par les cartes
  const contents: ContentCardProps[] = contentsWithViews.map((content) => ({
    id: content.id,
    title: content.title,
    description: content.description || '',
    type: content.type,
    views: content.views || 0,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <Eye className="w-7 h-7 text-amber-400" />
        Visites par contenu
      </h2>
      <ContentsGrid contents={contents} />
    </div>
  );
}