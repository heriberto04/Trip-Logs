"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, AreaChart, Archive, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/trips', icon: Plus, label: 'Trips' },
  { href: '/summary', icon: AreaChart, label: 'Summary' },
  { href: '/history', icon: Archive, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-10">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <React.Fragment key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
              {index < navItems.length - 1 && (
                <div className="h-8 w-px bg-border"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
