'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Video, Mic, FileText, Calendar, Tag } from 'lucide-react';
import { appData } from '../data';
import { Content } from '../types';

export default function ContenusPage() {
  const [contents, setContents] = useState(appData.contents);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'audio' | 'text'>('all');
  
  const [newContent, setNewContent] = useState<Partial<Content>>({
    title: '',
    description: '',
    type: 'video',
    category: '',
    tags: [],
  });

  const filteredContents = filterType === 'all' 
    ? contents 
    : contents.filter(c => c.type === filterType);

  const handleAdd = () => {
    if (newContent.title && newContent.description && newContent.category) {
      const content: Content = {
        id: Date.now().toString(),
        title: newContent.title,
        description: newContent.description,
        type: newContent.type as 'video' | 'audio' | 'text',
        category: newContent.category,
        tags: newContent.tags || [],
        publishedAt: new Date().toISOString().split('T')[0],
      };
      setContents([content, ...contents]);
      setNewContent({ title: '', description: '', type: 'video', category: '', tags: [] });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      setContents(contents.filter(c => c.id !== id));
    }
  };

  const handleSave = (id: string, updated: Content) => {
    setContents(contents.map(c => c.id === id ? updated : c));
    setEditingId(null);
  };

  const typeFilters = [
    { value: 'all', label: 'Tous', icon: FileText },
    { value: 'video', label: 'Vidéos', icon: Video },
    { value: 'audio', label: 'Audios', icon: Mic },
    { value: 'text', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Contenus</h1>
          <p className="text-slate-400 text-lg">
            Gérez vos contenus multimédias
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {typeFilters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as any)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                ${filterType === filter.value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Add Content Form */}
      {isAdding && (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-slide-in">
          <h3 className="text-xl font-bold text-white mb-4">Nouveau contenu</h3>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 text-sm font-medium">
                  Type
                </label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="video">Vidéo</option>
                  <option value="audio">Audio</option>
                  <option value="text">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-2 text-sm font-medium">
                  Catégorie
                </label>
                <select
                  value={newContent.category}
                  onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Sélectionner...</option>
                  {appData.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Titre
              </label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Titre du contenu"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Description du contenu"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Save className="w-5 h-5" />
              Sauvegarder
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewContent({ title: '', description: '', type: 'video', category: '', tags: [] });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300"
            >
              <X className="w-5 h-5" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Contents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContents.map((content, index) => (
          <ContentCard
            key={content.id}
            content={content}
            index={index}
            isEditing={editingId === content.id}
            onEdit={() => setEditingId(content.id)}
            onSave={(updated) => handleSave(content.id, updated)}
            onDelete={() => handleDelete(content.id)}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>

      {filteredContents.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-slate-600" />
          </div>
          <p className="text-slate-400 text-lg">Aucun contenu trouvé</p>
        </div>
      )}
    </div>
  );
}

function ContentCard({
  content,
  index,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
}: {
  content: Content;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updated: Content) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [editedContent, setEditedContent] = useState(content);

  const typeConfig = {
    video: { icon: Video, gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-500/10 to-pink-500/10' },
    audio: { icon: Mic, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-500/10 to-orange-500/10' },
    text: { icon: FileText, gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-500/10 to-teal-500/10' },
  };

  const config = typeConfig[content.type];
  const Icon = config.icon;

  if (isEditing) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 animate-slide-in">
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">Type</label>
              <select
                value={editedContent.type}
                onChange={(e) => setEditedContent({ ...editedContent, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="video">Vidéo</option>
                <option value="audio">Audio</option>
                <option value="text">Document</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 text-sm font-medium">Catégorie</label>
              <select
                value={editedContent.category}
                onChange={(e) => setEditedContent({ ...editedContent, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                {appData.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-2 text-sm font-medium">Titre</label>
            <input
              type="text"
              value={editedContent.title}
              onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-2 text-sm font-medium">Description</label>
            <textarea
              value={editedContent.description}
              onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(editedContent)}
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

  const category = appData.categories.find(c => c.id === content.category);

  return (
    <div 
      className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl overflow-hidden hover:border-slate-700/50 transition-all duration-300 hover:scale-[1.02]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header with gradient */}
      <div className={`h-32 bg-gradient-to-br ${config.bg} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="absolute bottom-4 left-6">
          <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full font-medium">
              {category?.icon} {category?.label}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-slate-800 text-amber-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-slate-800 text-rose-400 rounded-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors duration-300">
          {content.title}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {content.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Calendar className="w-4 h-4" />
            {new Date(content.publishedAt).toLocaleDateString('fr-FR')}
          </div>

          {content.tags && content.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500">
                {content.tags.length} tag{content.tags.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
