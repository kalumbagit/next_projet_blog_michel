"use client";

import { useState } from "react";
import { Category, CategoryInfo, Content } from "@/app/lib/index";
import { ContentGrid } from "@/app/components/content/ContentGrid";
import { ContentViewer } from "@/app/components/content/ContentViewer";

import { CategoryMenu } from "../components/navigation/CategoryMenu";

interface HomeClientProps {
  categories: CategoryInfo[];
  contents: Content[];
}

export function HomeClient({ categories, contents }: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(
    null,
  );
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Filtrage côté client (simple et efficace)
  const filteredContents = selectedCategory
    ? contents.filter((c) => c.category === selectedCategory.id)
    : contents;

  const handleCategorySelect = (categoryId: string | null) => {
  if (!categoryId) {
    setSelectedCategory(null);
    return;
  }

  const cat = categories.find((c) => c.id === categoryId) ?? null;
  setSelectedCategory(cat);
};


  return (
    <>
      {/* Category Menu */}
      <CategoryMenu
        categories={categories}
        selectedCategory={selectedCategory ? selectedCategory.id as Category: null}
        onSelectCategory={handleCategorySelect}
      />

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory.id)?.label
              : "Tous les contenus"}
          </h2>
          <p className="text-muted-foreground">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory.id)?.description
              : "Explorez tous mes contenus, vidéos, podcasts et articles"}
          </p>
        </div>

        <ContentGrid
          contents={filteredContents}
          onSelectContent={setSelectedContent}
        />
      </main>

      {/* Content viewer modal */}
      {selectedContent && (
        <ContentViewer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </>
  );
}
