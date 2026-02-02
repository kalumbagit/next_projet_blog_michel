// app/loading.tsx
"use client";

export default function LoadingPage() {
  return (
    <div className="relative overflow-hidden container mx-auto px-4 py-16 md:py-24 animate-pulse">
      {/* Background gradient skeleton */}
      <div className="absolute inset-0 bg-gradient-dark opacity-20" />

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative z-10">
        {/* Image skeleton */}
        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-muted-foreground/30 border-4 border-muted shadow-glow" />

        {/* Info skeleton */}
        <div className="flex-1 space-y-4 lg:space-y-6">
          {/* Name */}
          <div className="h-10 md:h-12 w-3/5 bg-muted-foreground/30 rounded"></div>

          {/* Title */}
          <div className="h-6 w-1/3 bg-muted-foreground/30 rounded"></div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
            <div className="h-4 w-5/6 bg-muted-foreground/20 rounded"></div>
            <div className="h-4 w-4/6 bg-muted-foreground/20 rounded"></div>
          </div>

          {/* Social links skeleton */}
          <div className="flex gap-4 mt-4">
            <div className="w-10 h-10 rounded-full bg-muted-foreground/20"></div>
            <div className="w-10 h-10 rounded-full bg-muted-foreground/20"></div>
            <div className="w-10 h-10 rounded-full bg-muted-foreground/20"></div>
          </div>

          {/* Formations & Motivations */}
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="bg-muted-foreground/10 p-6 rounded-xl border border-muted shadow-card space-y-3">
              <div className="h-6 w-1/3 bg-muted-foreground/30 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted-foreground/20 rounded"></div>
                <div className="h-3 w-5/6 bg-muted-foreground/20 rounded"></div>
                <div className="h-3 w-4/6 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>

            <div className="bg-muted-foreground/10 p-6 rounded-xl border border-muted shadow-card space-y-3">
              <div className="h-6 w-1/3 bg-muted-foreground/30 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted-foreground/20 rounded"></div>
                <div className="h-3 w-5/6 bg-muted-foreground/20 rounded"></div>
                <div className="h-3 w-4/6 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
