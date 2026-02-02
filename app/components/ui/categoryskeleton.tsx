export function CategoryMenuSkeleton() {
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex gap-3 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 rounded-full bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
