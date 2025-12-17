'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import NearbyRewards from '@/components/NearbyRewards';

interface DashboardData {
  balance: {
    total: number;
    accounts: Array<{
      accountId: string;
      name: string;
      type: string;
      balance: number;
      institution: string;
    }>;
  };
  monthly: {
    income: number;
    expenses: number;
    net: number;
  };
  patterns: {
    income: {
      monthlyAverage: number;
      frequency: string;
      nextExpected?: string;
    };
    spending: Array<{
      category: string;
      monthlyAverage: number;
      transactionCount: number;
    }>;
    recurring: Array<{
      merchantName: string;
      amount: number;
      frequency: string;
      nextExpected?: string;
    }>;
  };
  predictions: Array<{
    category: string;
    probability: number;
    expectedAmount?: number;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return;
        }
        return fetch('/api/dashboard');
      })
      .then((res) => {
        if (!res) return;
        if (!res.ok) {
          setError('Failed to load dashboard');
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, [router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg tap-target"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h2>
            <p className="text-4xl font-bold text-gray-900">{formatCurrency(data.balance.total)}</p>
            {data.balance.accounts.length > 0 && (
              <div className="mt-4 space-y-2">
                {data.balance.accounts.slice(0, 3).map((account) => (
                  <div key={account.accountId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{account.name}</span>
                    <span className="font-medium">{formatCurrency(account.balance)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Income</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(data.monthly.income)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Expenses</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(data.monthly.expenses)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">Net</p>
              <p className={`text-xl font-bold ${data.monthly.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(data.monthly.net)}
              </p>
            </div>
          </div>

          {/* Top Spending Categories */}
          {data.patterns.spending.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
              <div className="space-y-3">
                {data.patterns.spending.slice(0, 5).map((pattern) => (
                  <div key={pattern.category} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{pattern.category.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-500">{pattern.transactionCount} transactions</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(pattern.monthlyAverage)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recurring Expenses */}
          {data.patterns.recurring.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recurring Expenses</h3>
              <div className="space-y-3">
                {data.patterns.recurring.slice(0, 5).map((expense, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{expense.merchantName}</p>
                      {expense.nextExpected && (
                        <p className="text-sm text-gray-500">
                          Next: {formatDistanceToNow(new Date(expense.nextExpected), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}/{expense.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictions */}
          {data.predictions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Spending</h3>
              <div className="space-y-3">
                {data.predictions.slice(0, 3).map((pred, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{pred.category.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(pred.probability * 100)}% likely
                      </p>
                    </div>
                    {pred.expectedAmount && (
                      <p className="text-lg font-semibold text-gray-900">
                        ~{formatCurrency(pred.expectedAmount)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <NearbyRewards />
            </div>
            <div className="space-y-4">
              <Link
                href="/transactions"
                className="block bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition-shadow tap-target"
              >
                <p className="text-2xl mb-2">💳</p>
                <p className="font-medium">View Transactions</p>
              </Link>
              <Link
                href="/recommendations"
                className="block bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition-shadow tap-target"
              >
                <p className="text-2xl mb-2">🎯</p>
                <p className="font-medium">Card Recommendations</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


