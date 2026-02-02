"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Loader2,
  Video,
  Headphones,
  FileText,
  Search,
  Filter,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { Content, CategoryInfo } from "@/app/lib/index";
import { contentService } from "@/app/lib/contentService";
import { useToast } from "@/app/lib/hooks/use-toast";

interface ContentListProps {
  onEdit: (content: Content) => void;
  onDeleteSuccess?: () => void;
  refreshKey?: number;
}

export const ContentList: React.FC<ContentListProps> = ({
  onEdit,
  onDeleteSuccess,
  refreshKey,
}) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Content | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Chargement des contenus et catégories
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedContents, loadedCategories] = await Promise.all([
          contentService.getContents(),
          contentService.getCategories(),
        ]);
        setContents(loadedContents);
        setCategories(loadedCategories);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de charger les contenus : ${error}`,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [refreshKey, toast]);

  const filteredContents = contents.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || c.category === filterCategory;
    const matchesType = filterType === "all" || c.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "audio":
        return <Headphones className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? `${cat.icon} ${cat.label}` : categoryId;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await contentService.deleteContent(deleteTarget.id);
      setContents((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast({
        title: "Succès",
        description: "Contenu supprimé avec succès",
      });
      onDeleteSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de supprimer le contenu : ${error}`,
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
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-36 bg-secondary border-border">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="video">🎬 Vidéo</SelectItem>
            <SelectItem value="audio">🎙️ Audio</SelectItem>
            <SelectItem value="text">📝 Texte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filteredContents.length} contenu{filteredContents.length > 1 ? "s" : ""} trouvé
        {filteredContents.length > 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredContents.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8"
            >
              Aucun contenu trouvé
            </motion.p>
          ) : (
            filteredContents.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getTypeIcon(content.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{content.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{content.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(content.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{content.publishedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(content)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(content)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{deleteTarget?.title}&ldquo; ? Cette action est irréversible.
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

export default ContentList;
