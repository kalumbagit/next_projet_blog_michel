export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative">
        {/* Spinner principal */}
        <div className="w-20 h-20 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin" />
        
        {/* Cercle extérieur décoratif */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-rose-500 rounded-full animate-spin-slow opacity-50" 
             style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
        
        {/* Texte de chargement */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p className="text-slate-400 text-sm font-medium animate-pulse">
            Chargement...
          </p>
        </div>
        
        {/* Effet de glow */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full blur-xl animate-pulse" />
      </div>
    </div>
  );
}
