import { Plus } from "lucide-react";

export default function CategoriesHeader({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Catégories</h1>
        <p className="text-slate-400 text-lg">
          Gérez les catégories de votre contenu
        </p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:scale-105 transition"
      >
        <Plus className="w-5 h-5" />
        Ajouter
      </button>
    </div>
  );
}
