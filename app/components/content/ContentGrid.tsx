import { Content } from '@/app/lib/index';
import { ContentCard } from './ContentCard';
import { motion } from 'framer-motion';

interface ContentGridProps {
  contents: Content[];
  onSelectContent: (content: Content) => void;
}

export function ContentGrid({ contents, onSelectContent }: ContentGridProps) {
  if (contents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-serif font-semibold text-white mb-2">
          Aucun contenu disponible
        </h3>
        <p className="text-gray-400">
          Les contenus de cette catégorie seront bientôt disponibles.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content, index) => (
        <ContentCard
          key={content.id}
          content={content}
          onSelect={onSelectContent}
          index={index}
        />
      ))}
    </div>
  );
}
