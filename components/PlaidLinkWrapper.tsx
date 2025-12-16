'use client';

import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkWrapperProps {
  linkToken: string;
  onSuccess: (publicToken: string) => void;
  className?: string;
}

export default function PlaidLinkWrapper({ linkToken, onSuccess, className }: PlaidLinkWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always call the hook - React requires hooks to be called unconditionally
  const { open, ready } = usePlaidLink({
    token: linkToken || null,
    onSuccess: (publicToken: string) => {
      onSuccess(publicToken);
    },
    onExit: (err: any, metadata: any) => {
      if (err) {
        console.error('Plaid Link error:', err);
      }
    },
    onEvent: (eventName: string, metadata: any) => {
      if (eventName === 'ERROR') {
        console.error('Plaid Link event error:', metadata);
      }
    },
  });

  const handleClick = () => {
    if (ready && linkToken) {
      open();
    }
  };

  const isReady = ready && mounted && !!linkToken;

  if (!mounted) {
    return (
      <button
        disabled
        className={`bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium tap-target ${className || ''}`}
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isReady}
      className={`bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tap-target ${className || ''}`}
    >
      Connect Bank Account
    </button>
  );
}
