'use client';

import { ContentCard, ContentCardProps } from './ContentCard';

interface ContentsGridProps {
  contents: ContentCardProps[];
}

export function ContentsGrid({ contents }: ContentsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
      {contents.map((content, index) => (
        <ContentCard key={content.id} {...content} index={index + 4} />
      ))}
    </div>
  );
}
