import { clsx } from 'clsx';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'profile' | 'content';
}

export function LoadingSkeleton({ className, variant = 'text' }: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse rounded-lg bg-secondary';

  if (variant === 'profile') {
    return (
      <div className={clsx('space-y-6', className)}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className={clsx(baseClasses, 'w-32 h-32 rounded-full shrink-0')} />
          <div className="space-y-4 flex-1 w-full">
            <div className={clsx(baseClasses, 'h-10 w-2/3')} />
            <div className={clsx(baseClasses, 'h-6 w-1/3')} />
            <div className="space-y-2">
              <div className={clsx(baseClasses, 'h-4 w-full')} />
              <div className={clsx(baseClasses, 'h-4 w-5/6')} />
              <div className={clsx(baseClasses, 'h-4 w-4/6')} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={clsx('space-y-4', className)}>
        <div className={clsx(baseClasses, 'h-48 w-full')} />
        <div className={clsx(baseClasses, 'h-6 w-3/4')} />
        <div className={clsx(baseClasses, 'h-4 w-full')} />
        <div className={clsx(baseClasses, 'h-4 w-2/3')} />
      </div>
    );
  }

  if (variant === 'content') {
    return (
      <div className={clsx('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className={clsx(baseClasses, 'h-48 w-full')} />
            <div className={clsx(baseClasses, 'h-6 w-3/4')} />
            <div className={clsx(baseClasses, 'h-4 w-full')} />
          </div>
        ))}
      </div>
    );
  }

  return <div className={clsx(baseClasses, 'h-4 w-full', className)} />;
}
