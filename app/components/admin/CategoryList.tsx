"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

import { CategoryInfo } from "@/app/lib/index";
import { contentService } from "@/app/lib/contentService";
import { useToast } from "@/app/lib/hooks/use-toast";

interface CategoryListProps {
  onEdit: (category: CategoryInfo) => void;
  onDeleteSuccess?: () => void;
  refreshKey?: number;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  onEdit,
  onDeleteSuccess,
  refreshKey,
}) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [contentCounts, setContentCounts] = useState<Record<string, number>>(
    {},
  );
  const [deleteTarget, setDeleteTarget] = useState<CategoryInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Chargement des catégories et stats
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [cats, stats] = await Promise.all([
          contentService.getCategories(),
          contentService.getStats(),
        ]);
        setCategories(cats);
        setContentCounts(stats.contentsByCategory);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les catégories",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [refreshKey, toast]);

  const canDelete = (id: string) => (contentCounts[id] || 0) === 0;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await contentService.deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      onDeleteSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de supprimer la catégorie",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {categories.length} catégorie{categories.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <AnimatePresence>
          {categories.map((category) => {
            const count = contentCounts[category.id] || 0;
            const deletable = canDelete(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {category.label}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {category.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {count} contenu{count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(category)}
                    disabled={!deletable}
                    className={`${
                      deletable
                        ? "text-muted-foreground hover:text-destructive"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    }`}
                    title={
                      deletable
                        ? "Supprimer"
                        : "Impossible de supprimer (contenus associés)"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {categories.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Aucune catégorie créée
        </p>
      )}

      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Une catégorie ne peut être supprimée que si aucun contenu n&apos;y est
          associé. Déplacez ou supprimez d&apos;abord les contenus concernés.
        </p>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie &quot;
              {deleteTarget?.label}&ldquo;? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryList;
