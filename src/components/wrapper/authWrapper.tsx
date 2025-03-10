'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const protectedRoutes = ['/', '/dashboard'];
const publicRoutes = ['/login', '/register'];

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`)
    );
    
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`)
    );

    const token = localStorage.getItem('authToken');

    if (isProtectedRoute && !token) {
      router.push('/login');
    } else if (isPublicRoute && token) {
      router.push('/');
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}