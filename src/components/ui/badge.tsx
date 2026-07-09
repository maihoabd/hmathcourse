import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-150',
        {
          'bg-indigo-100 text-indigo-800': variant === 'default',
          'bg-slate-100 text-slate-800': variant === 'secondary',
          'bg-emerald-100 text-emerald-800': variant === 'success',
          'bg-amber-100 text-amber-800': variant === 'warning',
          'bg-rose-100 text-rose-800': variant === 'danger',
          'bg-sky-100 text-sky-800': variant === 'info'
        },
        className
      )}
      {...props}
    />
  );
};
