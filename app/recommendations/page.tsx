'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { creditCards } from '@/lib/creditCards';

interface Recommendation {
  type: string;
  category: string;
  monthlySpend?: number;
  probability?: number;
  expectedAmount?: number;
  recommendedCard: typeof creditCards[0];
  reason: string;
}

interface RecommendationsData {
  recommendations: Recommendation[];
  topCards: typeof creditCards;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return;
        }
        return fetch('/api/recommendations');
      })
      .then((res) => {
        if (!res) return;
        if (!res.ok) {
          setError('Failed to load recommendations');
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
            <p className="text-red-600 mb-4">{error || 'Failed to load recommendations'}</p>
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
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Credit Card Recommendations</h1>

          {/* Personalized Recommendations */}
          {data.recommendations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">For Your Spending</h2>
              <div className="space-y-4">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {rec.recommendedCard.name}
                        </h3>
                        <p className="text-sm text-gray-600">{rec.recommendedCard.issuer}</p>
                      </div>
                      <div className="text-right">
                        {rec.recommendedCard.annualFee > 0 ? (
                          <p className="text-sm text-gray-600">
                            ${rec.recommendedCard.annualFee}/yr
                          </p>
                        ) : (
                          <p className="text-sm text-green-600 font-medium">No Annual Fee</p>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{rec.reason}</p>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Rewards:</p>
                      <div className="space-y-1">
                        {rec.recommendedCard.rewards.map((reward, rIdx) => (
                          <div key={rIdx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {reward.category.replace(/_/g, ' ')}
                            </span>
                            <span className="font-medium text-gray-900">
                              {reward.rate}x {reward.cap && `(up to ${formatCurrency(reward.cap)})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {rec.recommendedCard.signupBonus && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-green-600">
                          Sign-up Bonus: {formatCurrency(rec.recommendedCard.signupBonus.amount)} 
                          {' '}after spending {formatCurrency(rec.recommendedCard.signupBonus.spendRequirement)} 
                          {' '}in {rec.recommendedCard.signupBonus.timeframe} months
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Cards */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Cards</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {data.topCards.map((card) => (
                <div key={card.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{card.name}</h3>
                      <p className="text-sm text-gray-600">{card.issuer}</p>
                    </div>
                    {card.annualFee > 0 ? (
                      <p className="text-sm text-gray-600">${card.annualFee}/yr</p>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">No Fee</p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {card.rewards.slice(0, 3).map((reward, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 capitalize">
                          {reward.category.replace(/_/g, ' ')}
                        </span>
                        <span className="font-medium">{reward.rate}x</span>
                      </div>
                    ))}
                  </div>

                  {card.signupBonus && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-green-600 font-medium">
                        Bonus: {formatCurrency(card.signupBonus.amount)} after{' '}
                        {formatCurrency(card.signupBonus.spendRequirement)} spend
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

