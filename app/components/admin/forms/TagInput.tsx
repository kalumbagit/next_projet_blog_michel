/**
 * Composant TagInput - Gestion de tags/étiquettes
 * 
 * Permet d'ajouter et supprimer des tags sous forme de badges.
 * Utilisé pour les tags de contenu, les formations, les motivations, etc.
 * 
 * @module TagInput
 */

import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { clsx } from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

export interface TagInputProps {
  /** Identifiant unique du champ */
  id: string;
  /** Label affiché au-dessus du champ */
  label: string;
  /** Liste actuelle des tags */
  tags: string[];
  /** Callback de mise à jour des tags */
  onChange: (tags: string[]) => void;
  /** Placeholder du champ d'entrée */
  placeholder?: string;
  /** Description ou hint */
  description?: string;
  /** Message d'erreur */
  error?: string;
  /** Champ requis */
  required?: boolean;
  /** Champ désactivé */
  disabled?: boolean;
  /** Nombre maximum de tags autorisés */
  maxTags?: number;
  /** Classes CSS additionnelles */
  className?: string;
}

// ============================================================================
// COMPOSANT
// ============================================================================

/**
 * Composant TagInput
 * 
 * Permet la saisie de tags avec validation et gestion du maximum.
 * Les tags peuvent être ajoutés via Enter ou le bouton +.
 */
export const TagInput: React.FC<TagInputProps> = ({
  id,
  label,
  tags,
  onChange,
  placeholder = 'Ajouter un tag...',
  description,
  error,
  required = false,
  disabled = false,
  maxTags,
  className,
}) => {
  // État local pour la valeur en cours de saisie
  const [inputValue, setInputValue] = useState('');

  /**
   * Ajoute un nouveau tag si valide
   */
  const addTag = () => {
    const trimmedValue = inputValue.trim();
    
    // Validations
    if (!trimmedValue) return;
    if (tags.includes(trimmedValue)) {
      // Tag déjà existant, on vide juste l'input
      setInputValue('');
      return;
    }
    if (maxTags && tags.length >= maxTags) return;

    // Ajout du tag
    onChange([...tags, trimmedValue]);
    setInputValue('');
  };

  /**
   * Supprime un tag par son index
   */
  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  /**
   * Gestion des touches clavier
   * - Enter : ajoute le tag
   * - Backspace sur input vide : supprime le dernier tag
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // Vérifier si on peut encore ajouter des tags
  const canAddMore = !maxTags || tags.length < maxTags;

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Label avec indicateur requis */}
      <Label htmlFor={id} className="text-foreground font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Zone d'affichage des tags existants */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:text-destructive transition-colors"
                  aria-label={`Supprimer ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Champ d'entrée pour nouveaux tags */}
      {canAddMore && !disabled && (
        <div className="flex gap-2">
          <Input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              'flex-1 bg-secondary border-border',
              error && 'border-destructive'
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addTag}
            disabled={disabled || !inputValue.trim()}
            aria-label="Ajouter le tag"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Indicateur de limite */}
      {maxTags && (
        <p className="text-xs text-muted-foreground">
          {tags.length} / {maxTags} tags
        </p>
      )}

      {/* Description */}
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

export default TagInput;
