import { ReactNode } from "react";
import { Footer } from "@/app/components/layout/Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

export  function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main content injected by page.tsx */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer always visible on home pages */}
      <Footer />
    </div>
  );
}
