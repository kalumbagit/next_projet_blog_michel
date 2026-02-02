/**
 * Composant ContentForm - Formulaire de création/édition de contenu
 * 
 * Gère la création et modification de contenus (vidéo, audio, texte).
 * Adapte les champs affichés selon le type de contenu sélectionné.
 * Utilise la sélection de fichiers pour les médias et miniatures.
 * 
 * @module ContentForm
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, FileText, Video, Headphones } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Content, ContentType, Category, CategoryInfo } from '@/app/lib/index';
import { contentService } from '@/app/lib/contentService';
import { FormField, SelectOption } from './FormField';
import { FileField } from './FileField';
import { TagInput } from './TagInput';
import { useToast } from '@/app/lib/hooks/use-toast';

// ============================================================================
// TYPES
// ============================================================================

interface ContentFormProps {
  /** Contenu à éditer (null pour création) */
  content?: Content | null;
  /** Callback après sauvegarde réussie */
  onSaveSuccess?: (content: Content) => void;
  /** Callback d'annulation */
  onCancel?: () => void;
}

/**
 * État du formulaire
 */
interface ContentFormState {
  title: string;
  description: string;
  type: ContentType;
  category: Category;
  mediaUrl: string;
  thumbnailUrl: string;
  transcription: string;
  textContent: string;
  duration: string;
  tags: string[];
}

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Options pour le type de contenu
 */
const CONTENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'video', label: '🎬 Vidéo' },
  { value: 'audio', label: '🎙️ Audio' },
  { value: 'text', label: '📝 Texte' },
];

/**
 * État initial du formulaire
 */
const INITIAL_FORM_STATE: ContentFormState = {
  title: '',
  description: '',
  type: 'text',
  category: 'autres',
  mediaUrl: '',
  thumbnailUrl: '',
  transcription: '',
  textContent: '',
  duration: '',
  tags: [],
};

// ============================================================================
// COMPOSANT
// ============================================================================

export const ContentForm: React.FC<ContentFormProps> = ({
  content,
  onSaveSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const isEditing = !!content;

  // États
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [formData, setFormData] = useState<ContentFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof ContentFormState, string>>>({});
  
  // Fichiers sélectionnés (pour upload futur vers un serveur)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  /**
   * Chargement des catégories et initialisation du formulaire
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Charger les catégories disponibles
        const loadedCategories = await contentService.getCategories();
        setCategories(loadedCategories);

        // Si édition, charger les données du contenu
        if (content) {
          setFormData({
            title: content.title,
            description: content.description,
            type: content.type,
            category: content.category,
            mediaUrl: content.mediaUrl || '',
            thumbnailUrl: content.thumbnailUrl || '',
            transcription: content.transcription || '',
            textContent: content.textContent || '',
            duration: content.duration || '',
            tags: content.tags || [],
          });
        }
      } catch (error) {
        console.error('[ContentForm] Erreur initialisation:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les données',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [content, toast]);

  /**
   * Conversion des catégories en options de select
   */
  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: `${cat.icon} ${cat.label}`,
  }));

  /**
   * Met à jour un champ du formulaire
   */
  const updateField = <K extends keyof ContentFormState>(
    field: K,
    value: ContentFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Gère le changement de fichier média
   */
  const handleMediaChange = (file: File | null, dataUrl: string | null) => {
    setMediaFile(file);
    updateField('mediaUrl', dataUrl || '');
  };

  /**
   * Gère le changement de fichier miniature
   */
  const handleThumbnailChange = (file: File | null, dataUrl: string | null) => {
    setThumbnailFile(file);
    updateField('thumbnailUrl', dataUrl || '');
  };

  /**
   * Validation du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContentFormState, string>> = {};

    // Champs obligatoires communs
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne doit pas dépasser 100 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
    }

    // Validation spécifique selon le type
    if (formData.type === 'video' || formData.type === 'audio') {
      if (!formData.mediaUrl.trim()) {
        newErrors.mediaUrl = 'Un fichier média est requis pour ce type de contenu';
      }
    }

    if (formData.type === 'text') {
      if (!formData.textContent.trim()) {
        newErrors.textContent = 'Le contenu texte est requis';
      }
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
      // Note: Dans une vraie application, on uploaderait les fichiers vers un serveur
      // et on utiliserait les URLs retournées. Ici on garde les Data URLs pour la démo.
      console.log('[ContentForm] Fichier média:', mediaFile?.name);
      console.log('[ContentForm] Fichier miniature:', thumbnailFile?.name);

      // Préparation des données
      const contentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category,
        mediaUrl: formData.mediaUrl.trim() || undefined,
        thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
        transcription: formData.transcription.trim() || undefined,
        textContent: formData.textContent.trim() || undefined,
        duration: formData.duration.trim() || undefined,
        publishedAt: content?.publishedAt || new Date().toISOString().split('T')[0],
        tags: formData.tags,
      };

      let savedContent: Content;

      if (isEditing && content) {
        // Mise à jour
        const result = await contentService.updateContent(content.id, contentData);
        if (!result) throw new Error('Contenu non trouvé');
        savedContent = result;
      } else {
        // Création
        savedContent = await contentService.createContent(contentData);
      }

      toast({
        title: 'Succès',
        description: isEditing ? 'Contenu mis à jour' : 'Contenu créé avec succès',
      });

      onSaveSuccess?.(savedContent);
    } catch (error) {
      console.error('[ContentForm] Erreur sauvegarde:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le contenu',
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Icône selon le type de contenu
   */
  const getTypeIcon = () => {
    switch (formData.type) {
      case 'video':
        return <Video className="w-5 h-5 text-primary" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-primary" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  /**
   * Retourne le type de fichier accepté selon le type de contenu
   */
  const getMediaAcceptType = (): 'video' | 'audio' => {
    return formData.type === 'video' ? 'video' : 'audio';
  };

  // Loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* En-tête avec type de contenu */}
      <div className="flex items-center gap-2 text-lg font-serif font-semibold text-foreground pb-4 border-b border-border">
        {getTypeIcon()}
        <h3>{isEditing ? 'Modifier le contenu' : 'Nouveau contenu'}</h3>
      </div>

      {/* Type et catégorie */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="type"
          label="Type de contenu"
          type="select"
          value={formData.type}
          onChange={(value) => updateField('type', value as ContentType)}
          options={CONTENT_TYPE_OPTIONS}
          required
        />

        <FormField
          id="category"
          label="Catégorie"
          type="select"
          value={formData.category}
          onChange={(value) => updateField('category', value as Category)}
          options={categoryOptions}
          required
        />
      </div>

      {/* Titre et description */}
      <FormField
        id="title"
        label="Titre"
        value={formData.title}
        onChange={(value) => updateField('title', value)}
        placeholder="Titre du contenu"
        error={errors.title}
        required
      />

      <FormField
        id="description"
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(value) => updateField('description', value)}
        placeholder="Description courte du contenu..."
        error={errors.description}
        rows={3}
        required
      />

      {/* Champs spécifiques vidéo/audio */}
      {(formData.type === 'video' || formData.type === 'audio') && (
        <>
          {/* Sélection du fichier média */}
          <FileField
            id="mediaFile"
            label={formData.type === 'video' ? 'Fichier vidéo' : 'Fichier audio'}
            accept={getMediaAcceptType()}
            value={formData.mediaUrl}
            file={mediaFile}
            onChange={handleMediaChange}
            error={errors.mediaUrl}
            description={formData.type === 'video' 
              ? 'Sélectionnez un fichier vidéo (MP4, WebM, OGG)' 
              : 'Sélectionnez un fichier audio (MP3, WAV, OGG)'
            }
            required
          />

          <FormField
            id="duration"
            label="Durée"
            value={formData.duration}
            onChange={(value) => updateField('duration', value)}
            placeholder="Ex: 45:30"
            description="Format: MM:SS ou HH:MM:SS"
          />

          {/* Sélection de la miniature */}
          <FileField
            id="thumbnailFile"
            label="Miniature"
            accept="image"
            value={formData.thumbnailUrl}
            file={thumbnailFile}
            onChange={handleThumbnailChange}
            error={errors.thumbnailUrl}
            description="Image de couverture pour ce contenu"
          />

          <FormField
            id="transcription"
            label="Transcription"
            type="textarea"
            value={formData.transcription}
            onChange={(value) => updateField('transcription', value)}
            placeholder="Transcription du contenu audio/vidéo..."
            rows={6}
            description="Permet aux utilisateurs de lire le contenu au lieu de l'écouter/regarder"
          />
        </>
      )}

      {/* Champ spécifique texte */}
      {formData.type === 'text' && (
        <FormField
          id="textContent"
          label="Contenu"
          type="textarea"
          value={formData.textContent}
          onChange={(value) => updateField('textContent', value)}
          placeholder="Rédigez votre contenu ici... (Markdown supporté)"
          error={errors.textContent}
          rows={12}
          description="Vous pouvez utiliser la syntaxe Markdown"
          required
        />
      )}

      {/* Tags */}
      <TagInput
        id="tags"
        label="Tags"
        tags={formData.tags}
        onChange={(tags) => updateField('tags', tags)}
        placeholder="Ajouter un tag..."
        description="Mots-clés pour faciliter la recherche"
        maxTags={10}
      />

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
              {isEditing ? 'Mettre à jour' : 'Créer le contenu'}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default ContentForm;
