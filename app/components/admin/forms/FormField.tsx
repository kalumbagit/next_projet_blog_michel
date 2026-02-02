/**
 * Composant FormField - Champ de formulaire réutilisable
 * 
 * Ce composant encapsule la logique commune des champs de formulaire :
 * - Label avec indicateur requis
 * - Différents types d'inputs (text, textarea, select, etc.)
 * - Affichage des erreurs de validation
 * - Support pour les descriptions/hints
 * 
 * @module FormField
 */

import React from 'react';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { clsx } from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Option pour les champs select
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Types de champs supportés
 */
export type FieldType = 'text' | 'email' | 'password' | 'url' | 'textarea' | 'select';

/**
 * Props du composant FormField
 */
export interface FormFieldProps {
  /** Identifiant unique du champ */
  id: string;
  /** Label affiché au-dessus du champ */
  label: string;
  /** Type de champ */
  type?: FieldType;
  /** Valeur actuelle */
  value: string;
  /** Callback de changement de valeur */
  onChange: (value: string) => void;
  /** Placeholder du champ */
  placeholder?: string;
  /** Message d'erreur à afficher */
  error?: string;
  /** Description ou hint sous le champ */
  description?: string;
  /** Champ requis */
  required?: boolean;
  /** Champ désactivé */
  disabled?: boolean;
  /** Options pour les selects */
  options?: SelectOption[];
  /** Nombre de lignes pour textarea */
  rows?: number;
  /** Classes CSS additionnelles */
  className?: string;

  name?: string;
}

// ============================================================================
// COMPOSANT
// ============================================================================

/**
 * Composant FormField
 * 
 * Rendu conditionnel basé sur le type de champ spécifié.
 * Gère automatiquement les états d'erreur et les descriptions.
 */
export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  description,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  className,
}) => {
  // Classes communes pour les inputs
  const inputClasses = clsx(
    'bg-secondary border-border',
    error && 'border-destructive focus:ring-destructive',
    className
  );

  /**
   * Rendu du champ approprié selon le type
   */
  const renderField = () => {
    switch (type) {
      // Champ textarea pour textes longs
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
          />
        );

      // Champ select avec options
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder={placeholder || 'Sélectionner...'} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      // Champs texte standard (text, email, password, url)
      default:
        return (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Label avec indicateur requis */}
      <Label htmlFor={id} className="text-foreground font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Rendu du champ */}
      {renderField()}

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

export default FormField;
