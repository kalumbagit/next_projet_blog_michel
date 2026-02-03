'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { appData } from '../data';
import { CategoryInfo } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(appData.categories);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<CategoryInfo>>({
    label: '',
    description: '',
    icon: '📁',
  });

  const handleAdd = () => {
    if (newCategory.label && newCategory.description) {
      const category: CategoryInfo = {
        id: Date.now().toString(),
        label: newCategory.label,
        description: newCategory.description,
        icon: newCategory.icon || '📁',
      };
      setCategories([...categories, category]);
      setNewCategory({ label: '', description: '', icon: '📁' });
      setIsAdding(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updated: CategoryInfo) => {
    setCategories(categories.map(cat => cat.id === id ? updated : cat));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Catégories</h1>
          <p className="text-slate-400 text-lg">
            Gérez les catégories de votre contenu
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-slide-in">
          <h3 className="text-xl font-bold text-white mb-4">Nouvelle catégorie</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Icône
              </label>
              <input
                type="text"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="📁"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Libellé
              </label>
              <input
                type="text"
                value={newCategory.label}
                onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Nom de la catégorie"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Description de la catégorie"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCategory({ label: '', description: '', icon: '📁' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300"
            >
              <X className="w-5 h-5" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            index={index}
            isEditing={editingId === category.id}
            onEdit={() => handleEdit(category.id)}
            onSave={(updated) => handleSave(category.id, updated)}
            onDelete={() => handleDelete(category.id)}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  index,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: {
  category: CategoryInfo;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updated: CategoryInfo) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [editedCategory, setEditedCategory] = useState(category);

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-red-500',
  ];

  const gradient = gradients[index % gradients.length];

  if (isEditing) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 animate-slide-in">
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Icône
              </label>
              <input
                type="text"
                value={editedCategory.icon}
                onChange={(e) => setEditedCategory({ ...editedCategory, icon: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Libellé
              </label>
              <input
                type="text"
                value={editedCategory.label}
                onChange={(e) => setEditedCategory({ ...editedCategory, label: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              value={editedCategory.description}
              onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(editedCategory)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all duration-300"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 hover:border-slate-700/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-6">
        {/* Icon */}
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {category.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1">
            {category.label}
          </h3>
          <p className="text-slate-400 line-clamp-1">
            {category.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-3 bg-slate-800 text-amber-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-3 bg-slate-800 text-rose-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
