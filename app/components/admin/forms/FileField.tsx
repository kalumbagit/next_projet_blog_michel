/**
 * Composant FileField - Champ de sélection de fichier
 * 
 * Permet de sélectionner des fichiers (images, vidéos, audio) avec :
 * - Prévisualisation pour les images
 * - Affichage du nom du fichier sélectionné
 * - Support pour différents types de fichiers
 * - Gestion des erreurs et descriptions
 * 
 * @module FileField
 */

import React, { useRef, useState } from 'react';
import { Upload, X, Image, Video, Headphones, File } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { clsx } from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Types de fichiers acceptés
 */
export type AcceptedFileType = 'image' | 'video' | 'audio' | 'all';

/**
 * Props du composant FileField
 */
export interface FileFieldProps {
  /** Identifiant unique du champ */
  id: string;
  /** Label affiché au-dessus du champ */
  label: string;
  /** Type de fichiers acceptés */
  accept?: AcceptedFileType;
  /** URL ou Data URL du fichier actuel */
  value?: string;
  /** Fichier sélectionné */
  file?: File | null;
  /** Callback de changement (retourne le fichier et son Data URL) */
  onChange: (file: File | null, dataUrl: string | null) => void;
  /** Message d'erreur à afficher */
  error?: string;
  /** Description ou hint sous le champ */
  description?: string;
  /** Champ requis */
  required?: boolean;
  /** Champ désactivé */
  disabled?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Retourne les types MIME acceptés selon le type de fichier
 */
const getAcceptString = (type: AcceptedFileType): string => {
  switch (type) {
    case 'image':
      return 'image/jpeg,image/png,image/gif,image/webp';
    case 'video':
      return 'video/mp4,video/webm,video/ogg';
    case 'audio':
      return 'audio/mpeg,audio/wav,audio/ogg,audio/mp3';
    case 'all':
    default:
      return 'image/*,video/*,audio/*';
  }
};

/**
 * Retourne l'icône appropriée selon le type
 */
const getTypeIcon = (type: AcceptedFileType) => {
  switch (type) {
    case 'image':
      return <Image className="w-8 h-8 text-muted-foreground" />;
    case 'video':
      return <Video className="w-8 h-8 text-muted-foreground" />;
    case 'audio':
      return <Headphones className="w-8 h-8 text-muted-foreground" />;
    default:
      return <File className="w-8 h-8 text-muted-foreground" />;
  }
};

/**
 * Vérifie si l'URL est une image prévisualisable
 */
const isImagePreviewable = (url: string | undefined): boolean => {
  if (!url) return false;
  // Data URL ou URL d'image
  return url.startsWith('data:image/') || 
         /\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
         url.includes('/placeholder') ||
         url.includes('profile');
};

// ============================================================================
// COMPOSANT
// ============================================================================

export const FileField: React.FC<FileFieldProps> = ({
  id,
  label,
  accept = 'image',
  value,
  file,
  onChange,
  error,
  description,
  required = false,
  disabled = false,
  className,
}) => {
  // Référence vers l'input file caché
  const inputRef = useRef<HTMLInputElement>(null);
  // État pour l'URL de prévisualisation
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  /**
   * Gère la sélection d'un fichier
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // Création d'une Data URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        onChange(selectedFile, dataUrl);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  /**
   * Supprime le fichier sélectionné
   */
  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null, null);
    // Reset l'input file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  /**
   * Ouvre le dialogue de sélection de fichier
   */
  const handleClick = () => {
    inputRef.current?.click();
  };

  // URL à afficher (nouvelle sélection ou valeur existante)
  const displayUrl = previewUrl || value;
  const hasFile = !!displayUrl || !!file;

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Label avec indicateur requis */}
      <Label htmlFor={id} className="text-foreground font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Zone de sélection/prévisualisation */}
      <div
        className={clsx(
          'relative rounded-lg border-2 border-dashed transition-colors',
          error ? 'border-destructive' : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
      >
        {/* Input file caché */}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={getAcceptString(accept)}
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
        />

        {hasFile ? (
          // Affichage du fichier sélectionné ou existant
          <div className="relative p-4">
            {/* Bouton de suppression */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-8 h-8 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Prévisualisation image */}
            {accept === 'image' && isImagePreviewable(displayUrl) ? (
              <div 
                className="flex flex-col items-center gap-2"
                onClick={handleClick}
              >
                <img
                  src={displayUrl || ''}
                  alt="Prévisualisation"
                  className="max-h-40 max-w-full rounded-md object-contain"
                />
                {file && (
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                )}
              </div>
            ) : (
              // Affichage non-image (audio/vidéo)
              <div 
                className="flex items-center gap-4 p-2"
                onClick={handleClick}
              >
                {getTypeIcon(accept)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file?.name || 'Fichier sélectionné'}
                  </p>
                  {file && (
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Zone de drop/sélection vide
          <div
            className="flex flex-col items-center justify-center gap-3 p-8"
            onClick={handleClick}
          >
            {getTypeIcon(accept)}
            <div className="text-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                disabled={disabled}
              >
                <Upload className="w-4 h-4" />
                Choisir un fichier
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                {accept === 'image' && 'JPG, PNG, GIF ou WebP'}
                {accept === 'video' && 'MP4, WebM ou OGG'}
                {accept === 'audio' && 'MP3, WAV ou OGG'}
                {accept === 'all' && 'Image, Vidéo ou Audio'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description/hint */}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FileField;
