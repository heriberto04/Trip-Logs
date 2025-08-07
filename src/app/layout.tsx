import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/contexts/app-provider';import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Trip Logs',
  description: 'A comprehensive yet intuitive application designed for drivers who need to meticulously track their trips for business and tax purposes. Log every journey with details on earnings, expenses, and mileage, and let the app provide you with powerful summaries and automated calculations to maximize your deductions and understand your profitability.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Trip Logs',
  },
  themeColor: '#000000'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
