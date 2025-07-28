import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  valueColor?: string;
  className?: string;
  isLarge?: boolean;
}

export const SummaryCard = React.memo(function SummaryCard({ title, value, valueColor = 'text-foreground', className, isLarge = false }: SummaryCardProps) {
  return (
    <Card className={cn('text-center', className)}>
      <CardHeader className={cn("pb-2", isLarge ? "p-4" : "p-3")}>
        <CardTitle className={cn("font-medium", isLarge ? "text-lg" : "text-sm")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("pb-3", isLarge ? "p-4 pt-0" : "p-3 pt-0")}>
        <p className={cn('font-bold', valueColor, isLarge ? 'text-4xl' : 'text-2xl')}>{value}</p>
      </CardContent>
    </Card>
  );
});
