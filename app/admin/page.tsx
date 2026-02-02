'use client';

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowLeft,
  User,
  FileText,
  FolderOpen,
  Plus,
  BarChart3,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import {
  ProfileForm,
  ContentForm,
  CategoryForm,
} from "@/app/components/admin/forms";
import { ContentList } from "@/app/components/admin/ContentList";
import { CategoryList } from "@/app/components/admin/CategoryList";
import { Content, CategoryInfo } from "@/app/lib/index";
import { useToast } from "@/app/lib/hooks/use-toast";

const Admin = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Vérifier si l'URL contient success ou error pour considérer déjà authentifié
  const initialAuth =
    searchParams.get("success") !== null || searchParams.get("error") !== null;

  // États
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showContentModal, setShowContentModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(
    null
  );

  const [contentRefreshKey, setContentRefreshKey] = useState(0);
  const [categoryRefreshKey, setCategoryRefreshKey] = useState(0);

  // Si on est déjà authentifié via paramètre, afficher un toast
  useEffect(() => {
    if (searchParams.get("success")) {
      toast({
        title: "Succès",
        description: "Connexion détectée via URL",
      });
    } else if (searchParams.get("error")) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur détectée via URL",
      });
    }
  }, [searchParams, toast]);

  // Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
      toast({
        title: "Bienvenue",
        description: "Vous êtes maintenant connecté",
      });
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    toast({ title: "Déconnexion", description: "À bientôt !" });
  };

  // Contenu
  const handleNewContent = () => {
    setEditingContent(null);
    setShowContentModal(true);
  };

  const handleEditContent = useCallback((content: Content) => {
    setEditingContent(content);
    setShowContentModal(true);
  }, []);

  const handleContentSaveSuccess = useCallback(() => {
    setShowContentModal(false);
    setEditingContent(null);
    setContentRefreshKey((prev) => prev + 1);
  }, []);

  const handleContentDeleteSuccess = useCallback(() => {
    setContentRefreshKey((prev) => prev + 1);
  }, []);

  // Catégorie
  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = useCallback((category: CategoryInfo) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  }, []);

  const handleCategorySaveSuccess = useCallback(() => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryRefreshKey((prev) => prev + 1);
    setContentRefreshKey((prev) => prev + 1);
  }, []);

  const handleCategoryDeleteSuccess = useCallback(() => {
    setCategoryRefreshKey((prev) => prev + 1);
  }, []);

  // Page login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(222,47%,6%)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-black/90 rounded-2xl border border-gray-800 p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Lock className="w-8 h-8 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[hsl(45,20%,95%)]">
                Administration
              </h1>
              <p className="text-gray-400 mt-2">
                Connectez-vous pour gérer vos contenus
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-[hsl(45,20%,95%)]"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[hsl(45,20%,95%)] mt-6 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[hsl(222,47%,6%)]">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-yellow-500" />
            <h1 className="text-xl font-serif font-bold text-[hsl(45,20%,95%)]">
              Administration
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voir le site</span>
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Contenus</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Catégories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg"
            >
              <h2 className="text-xl font-serif font-semibold text-[hsl(45,20%,95%)] mb-6">
                Gestion du Profil
              </h2>
              <ProfileForm />
            </motion.div>
          </TabsContent>

          <TabsContent value="contents">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-[hsl(45,20%,95%)]">
                  Gestion des Contenus
                </h2>
                <Button
                  onClick={handleNewContent}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouveau contenu</span>
                </Button>
              </div>
              <ContentList
                onEdit={handleEditContent}
                onDeleteSuccess={handleContentDeleteSuccess}
                refreshKey={contentRefreshKey}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="categories">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-[hsl(45,20%,95%)]">
                  Gestion des Catégories
                </h2>
                <Button
                  onClick={handleNewCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouvelle catégorie</span>
                </Button>
              </div>
              <CategoryList
                onEdit={handleEditCategory}
                onDeleteSuccess={handleCategoryDeleteSuccess}
                refreshKey={categoryRefreshKey}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl p-4">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingContent ? "Modifier le contenu" : "Nouveau contenu"}
            </DialogTitle>
          </DialogHeader>
          <ContentForm
            content={editingContent}
            onSaveSuccess={handleContentSaveSuccess}
            onCancel={() => setShowContentModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="max-w-lg bg-gray-900 border border-gray-800 rounded-xl p-4">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            onSaveSuccess={handleCategorySaveSuccess}
            onCancel={() => setShowCategoryModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
