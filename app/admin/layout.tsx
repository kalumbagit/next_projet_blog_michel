'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Folder, FileText, LogOut } from 'lucide-react';
import '@/app/admin/globals.css'

const menuItems = [
  { href: '/admin', label: 'Accueil', icon: Home },
  { href: '/admin/profil', label: 'Profil', icon: User },
  { href: '/admin/categories', label: 'Catégories', icon: Folder },
  { href: '/admin/contenus', label: 'Contenus', icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-slate-800/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-light">
              Gestion de contenu
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-400 shadow-lg shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800/50">
            <button className="flex items-center gap-3 px-5 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-xl transition-all duration-300 group">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 min-h-screen">
        <div className="p-8">{children}</div>
      </main>

      {/* Decorative gradient orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 left-72 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
    </div>
  );
}
