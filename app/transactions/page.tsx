'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  merchantName?: string;
  primaryCategory: string;
  pending: boolean;
  accountName: string;
  merchantId?: {
    canonicalName: string;
  };
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return;
        }
        loadTransactions(1);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, [router]);

  const loadTransactions = async (pageNum: number) => {
    try {
      const res = await fetch(`/api/transactions?page=${pageNum}&limit=50`);
      if (!res.ok) {
        setError('Failed to load transactions');
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (pageNum === 1) {
        setTransactions(data.transactions);
      } else {
        setTransactions((prev) => [...prev, ...data.transactions]);
      }

      setHasMore(data.pagination.page < data.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTransactions(nextPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food_and_drink: 'bg-orange-100 text-orange-700',
      general_merchandise: 'bg-blue-100 text-blue-700',
      travel: 'bg-purple-100 text-purple-700',
      gas_stations: 'bg-yellow-100 text-yellow-700',
      groceries: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading && transactions.length === 0) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Transactions</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {transactions.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <p className="text-gray-600 mb-2">No transactions found.</p>
              <p className="text-sm text-gray-500 mb-4">
                {error ? 'Failed to load transactions. Make sure you have connected a bank account.' : 'Connect a bank account via Plaid to see your transactions here.'}
              </p>
              <a
                href="/connect"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors tap-target"
              >
                Connect Bank Account
              </a>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {tx.merchantId?.canonicalName || tx.merchantName || 'Unknown Merchant'}
                        </p>
                        {tx.pending && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(
                            tx.primaryCategory
                          )}`}
                        >
                          {tx.primaryCategory.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-500">{tx.accountName}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(tx.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p
                        className={`text-lg font-semibold ${
                          tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {tx.amount < 0 ? '-' : '+'}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full bg-white rounded-xl shadow-sm p-4 text-primary-600 font-medium hover:bg-gray-50 transition-colors tap-target disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


