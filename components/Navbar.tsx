// components/Navbar.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Import our new hook
import { Button } from './ui/button';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="font-bold text-xl">
          DECA Practice
        </Link>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <>
  <Link href="/profile" className="text-sm font-medium hover:underline">
    Profile
  </Link>
  <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
  <Button variant="outline" size="sm" onClick={logout}>
    Logout
  </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}