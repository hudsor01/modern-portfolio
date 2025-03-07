'use client';

import React from 'react';
import Link from 'next/link';
import { Icons } from './ui/icons';
import { Animate } from './ui/animate';
import { cn } from '@/lib/utils';

interface MCPCardProps {
  title: string;
  description: string;
  icon: 'briefcase' | 'monitor' | 'chart' | 'spreadsheet';
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  href?: string;
}

export function MCPCard({
  title,
  description,
  icon,
  className,
  variant = 'default',
  href,
}: MCPCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'briefcase':
        return <Icons.briefcase className="h-8 w-8" />;
      case 'monitor':
        return <Icons.monitor className="h-8 w-8" />;
      case 'chart':
        return <Icons.chart className="h-8 w-8" />;
      case 'spreadsheet':
        return <Icons.spreadsheet className="h-8 w-8" />;
      default:
        return <Icons.briefcase className="h-8 w-8" />;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-transparent border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900';
      case 'secondary':
        return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700';
      default:
        return 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900';
    }
  };

  const CardContent = () => (
    <div
      className={cn(
        'rounded-lg px-6 py-5 shadow-sm transition-all',
        getVariantClasses(),
        className
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
        {getIcon()}
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );

  return (
    <Animate variant="slide-in-right">
      {href ? (
        <Link href={href} className="block">
          <CardContent />
        </Link>
      ) : (
        <CardContent />
      )}
    </Animate>
  );
}
