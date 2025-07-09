// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext'; // Import the provider
import { Navbar } from '@/components/Navbar'; // Import the Navbar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DECA Practice App',
  description: 'Practice for DECA exams',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap everything */}
          <Navbar /> {/* Add the Navbar */}
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}