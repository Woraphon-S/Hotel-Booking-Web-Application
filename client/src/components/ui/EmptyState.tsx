import React from 'react';
import { LucideIcon, Search } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon: Icon = Search,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 px-4 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-muted/50",
      className
    )}>
      <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mb-6">
        <Icon size={32} className="text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-8">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
