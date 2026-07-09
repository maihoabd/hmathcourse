import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorClassName?: string;
}

export const Progress = ({ className, value = 0, indicatorClassName, ...props }: ProgressProps) => {
  // Ensure value stays between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}
      {...props}
    >
      <div
        className={cn('h-full w-full flex-1 bg-indigo-600 transition-all duration-300 ease-in-out', indicatorClassName)}
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </div>
  );
};
