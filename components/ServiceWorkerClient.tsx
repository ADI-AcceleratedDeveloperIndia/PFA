'use client';

import { useEffect } from 'react';

export default function ServiceWorkerClient() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Only register in production
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) return;

    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        console.error('Service worker registration failed:', err);
      });
  }, []);

  return null;
}


