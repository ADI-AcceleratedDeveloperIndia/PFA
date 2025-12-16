'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Plaid Link component to avoid SSR issues
const PlaidLinkComponent = dynamic(
  () => import('./PlaidLinkWrapper'),
  { ssr: false }
);

interface PlaidLinkButtonProps {
  onSuccess: (publicToken: string) => void;
  className?: string;
}

export default function PlaidLinkButton({ onSuccess, className }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plaid/create-link-token', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.link_token) {
          setLinkToken(data.link_token);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to create link token:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <button
        disabled
        className={`bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium tap-target ${className || ''}`}
      >
        Loading...
      </button>
    );
  }

  if (!linkToken) {
    return (
      <button
        disabled
        className={`bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium tap-target ${className || ''}`}
      >
        Unable to connect
      </button>
    );
  }

  return (
    <PlaidLinkComponent
      linkToken={linkToken}
      onSuccess={onSuccess}
      className={className}
    />
  );
}
