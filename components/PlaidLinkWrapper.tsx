'use client';

import { usePlaidLink } from 'react-plaid-link';
import { useEffect } from 'react';

interface PlaidLinkWrapperProps {
  linkToken: string;
  onSuccess: (publicToken: string) => void;
  className?: string;
}

export default function PlaidLinkWrapper({ linkToken, onSuccess, className }: PlaidLinkWrapperProps) {
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

  // Auto-open Plaid Link when ready
  useEffect(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className={`bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tap-target ${className || ''}`}
    >
      Connect Bank Account
    </button>
  );
}

