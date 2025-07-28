import { BottomNav } from '@/components/bottom-nav';
import React from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
