"use client";

import { useState } from "react";
import { CategoryInfo } from "@/app/lib/index";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoryForm from "./components/CategoryForm";
import CategoriesList from "./components/CategoriesList";
import { createCategoryAction,updateCategoryAction,deleteCategoryAction } from "@/app/lib/actions";

export default function CategoriesClient({categoriesDatas}: {categoriesDatas: CategoryInfo[]}) {
  const [categories, setCategories] = useState(categoriesDatas);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (category: CategoryInfo) => {
    const result = await createCategoryAction(category);
    if (result.success) {
      setCategories((prev) => [...prev, category]);
      setIsAdding(false);
    } else {
      alert("Erreur lors de la création de la catégorie");
    }
  };

  const handleUpdate = async (updated: CategoryInfo) => {
    const result = await updateCategoryAction(updated.id,updated);
    if (!result.success) {
      alert("Erreur lors de la mise à jour de la catégorie");
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategoryAction(id);
    if (!result.success) {
      alert("Erreur lors de la suppression de la catégorie : " + result.error);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <CategoriesHeader onAdd={() => setIsAdding(true)} />

      {isAdding && (
        <CategoryForm
          mode="create"
          onCancel={() => setIsAdding(false)}
          onSave={handleAdd}
        />
      )}

      <CategoriesList
        categories={categories}
        editingId={editingId}
        onEdit={setEditingId}
        onSave={handleUpdate}
        onDelete={handleDelete}
        onCancel={() => setEditingId(null)}
      />
    </div>
  );
}
