'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import PlaidLinkButton from '@/components/PlaidLinkButton';

export default function ConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePlaidSuccess = async (publicToken: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to connect account');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Bank Account</h1>
            <p className="text-gray-600 mb-6">
              Securely connect your bank account using Plaid. Your credentials are never stored.
            </p>

            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-lg font-medium text-gray-900 mb-2">Account Connected!</p>
                <p className="text-gray-600">Redirecting to dashboard...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <PlaidLinkButton
                    onSuccess={handlePlaidSuccess}
                    className="w-full"
                  />

                  <div className="text-sm text-gray-500 space-y-2 pt-4 border-t">
                    <p className="font-medium">What happens next?</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>You'll be redirected to Plaid's secure connection flow</li>
                      <li>Select your bank and sign in</li>
                      <li>We'll import your recent transactions</li>
                      <li>Your data is encrypted and secure</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {loading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Connecting account...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

