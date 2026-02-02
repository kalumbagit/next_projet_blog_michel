"use client";

export function ProfileSkeleton() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
          {/* Image Skeleton */}
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-gray-800 animate-pulse border-4 border-primary/30 shadow-glow" />

          {/* Info Skeleton */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="h-12 md:h-16 w-3/4 md:w-2/3 bg-gray-700 animate-pulse mx-auto lg:mx-0 rounded-lg"></div>
            <div className="h-6 md:h-8 w-1/2 bg-gray-600 animate-pulse mx-auto lg:mx-0 rounded-lg"></div>
            <div className="h-4 md:h-6 w-full max-w-2xl bg-gray-700 animate-pulse mx-auto lg:mx-0 rounded-lg mt-4"></div>
            <div className="flex gap-4 justify-center lg:justify-start mt-6">
              {/* Social icons placeholders */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gray-600 animate-pulse"
                />
              ))}
            </div>

            {/* Formations & Motivations */}
            <div className="grid md:grid-cols-2 gap-8 mt-10">
              {Array.from({ length: 2 }).map((_, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="bg-gray-800 animate-pulse p-6 rounded-xl shadow-card space-y-4"
                >
                  <div className="h-6 w-1/3 bg-gray-600 rounded"></div>
                  <ul className="space-y-2">
                    {Array.from({ length: 4 }).map((_, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="h-4 w-full bg-gray-700 rounded animate-pulse"
                      ></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
