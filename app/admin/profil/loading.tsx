// app/components/Loading.tsx
"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-4 text-white font-medium">Chargement...</span>
    </div>
  );
}
