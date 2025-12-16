'use client';

import { usePlaidLink } from 'react-plaid-link';
import { useState, useEffect } from 'react';

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

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken) => {
      onSuccess(publicToken);
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid Link error:', err);
      }
    },
    onEvent: (eventName, metadata) => {
      if (eventName === 'ERROR') {
        console.error('Plaid Link event error:', metadata);
      }
    },
  });

  if (loading) {
    return (
      <button
        disabled
        className={`bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium tap-target ${className}`}
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      disabled={!ready || !linkToken}
      className={`bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tap-target ${className}`}
    >
      Connect Bank Account
    </button>
  );
}

