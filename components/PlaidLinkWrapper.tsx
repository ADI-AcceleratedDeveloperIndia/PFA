'use client';

import { useEffect, useState } from 'react';

interface PlaidLinkWrapperProps {
  linkToken: string;
  onSuccess: (publicToken: string) => void;
  className?: string;
}

export default function PlaidLinkWrapper({ linkToken, onSuccess, className }: PlaidLinkWrapperProps) {
  const [PlaidLink, setPlaidLink] = useState<any>(null);
  const [ready, setReady] = useState(false);

  // Dynamically load react-plaid-link only on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-plaid-link').then((module) => {
        setPlaidLink(module.usePlaidLink);
        setReady(true);
      });
    }
  }, []);

  const plaidLinkHook = PlaidLink && ready ? PlaidLink({
    token: linkToken,
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
  }) : null;

  const open = plaidLinkHook?.open || (() => {});
  const isReady = plaidLinkHook?.ready || false;

  return (
    <button
      onClick={() => open()}
      disabled={!isReady || !ready}
      className={`bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tap-target ${className || ''}`}
    >
      Connect Bank Account
    </button>
  );
}
