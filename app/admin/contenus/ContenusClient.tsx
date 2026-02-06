"use client";

import { useState } from "react";
import { Content, CategoryInfo } from "@/app/lib";
import {
  createContentAction,
  updateContentAction,
  deleteContentAction,
} from "@/app/lib/actions";
import ContentForm from "@/app/admin/contenus/components/ContentForm";
import ContentCard from "@/app/admin/contenus/components/ContentCard";

type Props = {
  initialContents: Content[];
  categories: CategoryInfo[];
};

export default function ContenusClient({ initialContents, categories }: Props) {
  const [contents, setContents] = useState(initialContents);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleCreate(data: FormData) {
    const created = await createContentAction(data);
    setContents((prev) => [created, ...prev]);
  }

 async function handleUpdate(id: string, data: FormData) {
  try {
    /**
     * ================================
     * 1️⃣ Appel à l’action serveur
     * ================================
     */
    const updated = await updateContentAction(id, data);

    if (!updated) {
      alert("La mise à jour a échoué : aucune donnée retournée.");
      return;
    }

    /**
     * ================================
     * 2️⃣ Mise à jour locale du state
     * ================================
     */
    setContents((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );

    /**
     * ================================
     * 3️⃣ Sortie du mode édition
     * ================================
     */
    setEditingId(null);
  } catch (error) {
    /**
     * ================================
     * 4️⃣ Gestion des erreurs
     * ================================
     * 👉 On expose une cause lisible
     */
    let message = "Une erreur est survenue lors de la mise à jour du contenu.";

    if (error instanceof Error) {
      message += `\n\nCause : ${error.message}`;
    }

    alert(message);

    // console.error("❌ Erreur update contenu :", error);
  }
}


  async function handleDelete(id: string) {
    try {
      await deleteContentAction(id);

      // Mise à jour optimiste de l’état local
      setContents((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du contenu :", error);

      alert(
        `Une erreur est survenue lors de la suppression du contenu suite à cette erreur : ${error}. Veuillez réessayer.`,
      );
    }
  }

  return (
    <div className="space-y-6">
      <ContentForm categories={categories} onCreate={handleCreate} />

      <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-4 gap-6">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            categories={categories}
            isEditing={editingId === content.id}
            onEdit={() => setEditingId(content.id)}
            onCancel={() => setEditingId(null)}
            onSave={(data) => handleUpdate(content.id, data)}
            onDelete={() => handleDelete(content.id)}
          />
        ))}
      </div>
    </div>
  );
}
