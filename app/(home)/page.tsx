// app/(home)/page.tsx
import { Suspense } from "react";

import { ProfileSection } from "@/app/components/profile/ProfileSection";
import { ProfileSkeleton } from "@/app/components/ui/ProfileSkeleton";
import { contentService } from "@/app/lib/contentService";
import { HomeClient } from "@/app/(home)/HomeClient";
import { Content } from "@/app/lib";

// ============================================================================
// UTILITAIRE LOCAL — normalisation jsonb
// ============================================================================
function parseJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return [];
}

export default async function HomePage() {
  const [categories, rawContents] = await Promise.all([
    contentService.getCategories(),
    contentService.getContents(),
  ]);

  // ==========================================================================
  // NORMALISATION DES CONTENTS (jsonb → Array)
  // ==========================================================================
  const contents: Content[] = rawContents.map((c) => ({
    ...c,
    tags: parseJsonArray<string>(c.tags),
  }));

  return (
    <>
      {/* Profile → chargé UNE SEULE FOIS */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileSection />
      </Suspense>

      {/* Partie interactive */}
      <HomeClient categories={categories} contents={contents} />
    </>
  );
}
