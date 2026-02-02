/**
 * Composant CategoryForm - Formulaire de création/édition de catégorie
 * 
 * Gère la création et modification des catégories de contenu.
 * Inclut la validation des identifiants uniques.
 * 
 * @module CategoryForm
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, FolderPlus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Category, CategoryInfo } from '@/app/lib/index';
import { contentService } from '@/app/lib/contentService';
import { FormField } from './FormField';
import { useToast } from '@/app/lib/hooks/use-toast';

// ============================================================================
// TYPES
// ============================================================================

interface CategoryFormProps {
  /** Catégorie à éditer (null pour création) */
  category?: CategoryInfo | null;
  /** Callback après sauvegarde réussie */
  onSaveSuccess?: (category: CategoryInfo) => void;
  /** Callback d'annulation */
  onCancel?: () => void;
}

/**
 * État du formulaire
 */
interface CategoryFormState {
  id: string;
  label: string;
  description: string;
  icon: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Emojis suggérés pour les icônes de catégories
 */
const SUGGESTED_ICONS = ['📚', '🎭', '⚖️', '💭', '✨', '🎬', '🎙️', '📝', '🔬', '🎨', '🌍', '💡'];

/**
 * État initial du formulaire
 */
const INITIAL_FORM_STATE: CategoryFormState = {
  id: '',
  label: '',
  description: '',
  icon: '📚',
};

// ============================================================================
// COMPOSANT
// ============================================================================

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSaveSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const isEditing = !!category;

  // États
  const [isSaving, setIsSaving] = useState(false);
  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<CategoryFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({});

  /**
   * Chargement des catégories existantes pour validation d'unicité
   */
  useEffect(() => {
    const loadExistingCategories = async () => {
      try {
        const categories = await contentService.getCategories();
        setExistingIds(categories.map((c) => c.id));
      } catch (error) {
        console.error('[CategoryForm] Erreur chargement catégories:', error);
      }
    };

    loadExistingCategories();
  }, []);

  /**
   * Initialisation du formulaire avec les données existantes
   */
  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        label: category.label,
        description: category.description,
        icon: category.icon,
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [category]);

  /**
   * Met à jour un champ du formulaire
   */
  const updateField = <K extends keyof CategoryFormState>(
    field: K,
    value: CategoryFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Génère un identifiant à partir du label
   */
  const generateIdFromLabel = (label: string): string => {
    return label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par des tirets
      .replace(/^-|-$/g, ''); // Supprime les tirets en début/fin
  };

  /**
   * Met à jour l'ID automatiquement lors de la saisie du label (création uniquement)
   */
  const handleLabelChange = (value: string) => {
    updateField('label', value);
    // Auto-génération de l'ID seulement en création
    if (!isEditing) {
      updateField('id', generateIdFromLabel(value));
    }
  };

  /**
   * Validation du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormState, string>> = {};

    // Validation du label
    if (!formData.label.trim()) {
      newErrors.label = 'Le nom est requis';
    } else if (formData.label.length > 50) {
      newErrors.label = 'Le nom ne doit pas dépasser 50 caractères';
    }

    // Validation de l'ID
    if (!formData.id.trim()) {
      newErrors.id = "L'identifiant est requis";
    } else if (!/^[a-z][a-z0-9-]*$/.test(formData.id)) {
      newErrors.id = "L'identifiant doit commencer par une lettre et ne contenir que des lettres minuscules, chiffres et tirets";
    } else if (!isEditing && existingIds.includes(formData.id)) {
      newErrors.id = 'Cet identifiant existe déjà';
    }

    // Validation de la description
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length > 200) {
      newErrors.description = 'La description ne doit pas dépasser 200 caractères';
    }

    // Validation de l'icône
    if (!formData.icon.trim()) {
      newErrors.icon = "L'icône est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs du formulaire',
      });
      return;
    }

    setIsSaving(true);

    try {
      const categoryData: CategoryInfo = {
        id: formData.id as Category,
        label: formData.label.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
      };

      let savedCategory: CategoryInfo;

      if (isEditing) {
        const result = await contentService.updateCategory(category!.id, categoryData);
        if (!result) throw new Error('Catégorie non trouvée');
        savedCategory = result;
      } else {
        savedCategory = await contentService.createCategory(categoryData);
      }

      toast({
        title: 'Succès',
        description: isEditing ? 'Catégorie mise à jour' : 'Catégorie créée avec succès',
      });

      onSaveSuccess?.(savedCategory);
    } catch (error) {
      console.error('[CategoryForm] Erreur sauvegarde:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de sauvegarder la catégorie',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex items-center gap-2 text-lg font-serif font-semibold text-foreground pb-4 border-b border-border">
        <FolderPlus className="w-5 h-5 text-primary" />
        <h3>{isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
      </div>

      {/* Nom de la catégorie */}
      <FormField
        id="label"
        label="Nom de la catégorie"
        value={formData.label}
        onChange={handleLabelChange}
        placeholder="Ex: Philosophie"
        error={errors.label}
        required
      />

      {/* Identifiant */}
      <FormField
        id="id"
        label="Identifiant technique"
        value={formData.id}
        onChange={(value) => updateField('id', value)}
        placeholder="Ex: philosophie"
        error={errors.id}
        description="Identifiant unique utilisé en interne (auto-généré depuis le nom)"
        disabled={isEditing} // L'ID ne peut pas être modifié après création
        required
      />

      {/* Description */}
      <FormField
        id="description"
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(value) => updateField('description', value)}
        placeholder="Description courte de la catégorie..."
        error={errors.description}
        rows={3}
        required
      />

      {/* Sélection de l'icône */}
      <div className="space-y-2">
        <FormField
          id="icon"
          label="Icône"
          value={formData.icon}
          onChange={(value) => updateField('icon', value)}
          placeholder="Entrez un emoji"
          error={errors.icon}
          required
        />
        
        {/* Suggestions d'icônes */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Suggestions :</span>
          {SUGGESTED_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => updateField('icon', icon)}
              className={`text-2xl p-1 rounded hover:bg-secondary transition-colors ${
                formData.icon === icon ? 'bg-primary/20 ring-2 ring-primary' : ''
              }`}
              aria-label={`Utiliser l'icône ${icon}`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Aperçu de la catégorie */}
      <div className="p-4 bg-secondary/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-2">Aperçu :</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{formData.icon || '❓'}</span>
          <div>
            <p className="font-medium text-foreground">{formData.label || 'Nom de la catégorie'}</p>
            <p className="text-sm text-muted-foreground">{formData.description || 'Description...'}</p>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'Mettre à jour' : 'Créer la catégorie'}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default CategoryForm;
