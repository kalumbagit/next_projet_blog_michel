export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto px-4">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Profil</h1>
        <p className="text-slate-400 text-lg">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* 👇 pages enfants */}
      {children}
    </div>
  );
}
