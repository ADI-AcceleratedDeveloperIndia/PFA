'use client';

import { useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';

type DemoScenarioKey =
  | 'coffee'
  | 'groceries'
  | 'gas'
  | 'fine_dining'
  | 'fast_food'
  | 'online_shopping'
  | 'streaming'
  | 'rideshare'
  | 'hotel'
  | 'flight';

interface Scenario {
  key: DemoScenarioKey;
  title: string;
  subtitle: string;
  category: string;
  merchantName: string;
  emoji: string;
}

interface RecommendationCard {
  name: string;
  issuer: string;
  network: string;
  bestForCategories: string[];
  rewardRateDescription: string;
}

interface RecommendationsResponse {
  topCards: RecommendationCard[];
}

const SCENARIOS: Scenario[] = [
  {
    key: 'coffee',
    title: 'Coffee shop visit',
    subtitle: 'Morning at Downtown Coffee',
    category: 'dining',
    merchantName: 'Downtown Coffee',
    emoji: '☕️',
  },
  {
    key: 'fine_dining',
    title: 'Dinner out',
    subtitle: 'Evening at Oceanview Steakhouse',
    category: 'dining',
    merchantName: 'Oceanview Steakhouse',
    emoji: '🍽️',
  },
  {
    key: 'fast_food',
    title: 'Quick bite',
    subtitle: 'Lunch at Burger Planet',
    category: 'dining',
    merchantName: 'Burger Planet',
    emoji: '🍔',
  },
  {
    key: 'groceries',
    title: 'Groceries run',
    subtitle: 'Weekly visit to City Supermarket',
    category: 'grocery_stores',
    merchantName: 'City Supermarket',
    emoji: '🛒',
  },
  {
    key: 'gas',
    title: 'Fuel stop',
    subtitle: 'Evening at Urban Gas Station',
    category: 'gas_stations',
    merchantName: 'Urban Gas Station',
    emoji: '⛽️',
  },
  {
    key: 'online_shopping',
    title: 'Online shopping',
    subtitle: 'Electronics at ShopNow.com',
    category: 'online_shopping',
    merchantName: 'ShopNow Electronics',
    emoji: '🛍️',
  },
  {
    key: 'streaming',
    title: 'Streaming subscription',
    subtitle: 'Monthly charge from StreamFlix',
    category: 'streaming',
    merchantName: 'StreamFlix',
    emoji: '📺',
  },
  {
    key: 'rideshare',
    title: 'Rideshare trip',
    subtitle: 'Airport ride with QuickRide',
    category: 'transit',
    merchantName: 'QuickRide',
    emoji: '🚗',
  },
  {
    key: 'hotel',
    title: 'Hotel stay',
    subtitle: 'Weekend at Grandview Hotel',
    category: 'travel_general',
    merchantName: 'Grandview Hotel',
    emoji: '🏨',
  },
  {
    key: 'flight',
    title: 'Flight booking',
    subtitle: 'Round trip with Skyline Air',
    category: 'travel_general',
    merchantName: 'Skyline Air',
    emoji: '✈️',
  },
];

export default function DemoPage() {
  const [selected, setSelected] = useState<Scenario | null>(SCENARIOS[0]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<RecommendationCard | null>(null);

  const handleScenarioChange = (scenario: Scenario) => {
    setSelected(scenario);
    setStep(1);
    setCard(null);
    setError(null);
  };

  const handleStart = () => {
    setStep(2);
    setError(null);
  };

  const handleShowSuggestion = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setCard(null);

    try {
      const res = await fetch('/api/recommendations');
      if (!res.ok) {
        throw new Error('Failed to load recommendations');
      }
      const data: RecommendationsResponse = await res.json();

      // Choose a card whose demo categories best match this scenario
      const match =
        data.topCards.find((c) =>
          c.bestForCategories?.includes(selected.category)
        ) || data.topCards[0];

      setCard(match || null);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Live trip simulation (demo)
            </h1>
            <p className="text-sm text-gray-600">
              This page walks through a simple story: you go to a place, the system
              understands the type of spend from your data, and recommends the best
              card you should use there. It uses Plaid sandbox data plus the rules-based
              card engine—no Google billing or tracking required.
            </p>
          </div>

          {/* Scenario picker */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              1. Pick a visit scenario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCENARIOS.map((scenario) => {
                const active = selected?.key === scenario.key;
                return (
                  <button
                    key={scenario.key}
                    type="button"
                    onClick={() => handleScenarioChange(scenario)}
                    className={`text-left rounded-xl border p-4 flex flex-col gap-1 tap-target ${
                      active
                        ? 'border-primary-600 bg-teal-50'
                        : 'border-gray-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <span className="text-2xl">{scenario.emoji}</span>
                    <span className="font-medium text-gray-900">{scenario.title}</span>
                    <span className="text-xs text-gray-500">{scenario.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: simulate arrival */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              2. Arrive at the shop
            </h2>
            <p className="text-sm text-gray-600">
              Imagine you&apos;ve just walked into{' '}
              <span className="font-semibold">{selected?.merchantName}</span>. In a
              production build, we would combine recent card transactions plus optional
              location context to recognize you&apos;re at a{' '}
              <span className="font-semibold capitalize">{selected?.category}</span>{' '}
              merchant.
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium tap-target w-full sm:w-auto"
            >
              I&apos;m here – continue
            </button>
          </div>

          {/* Step 3: card suggestion */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              3. See what PFA would suggest
            </h2>

            {step < 2 && (
              <p className="text-sm text-gray-500">
                Pick a scenario above and click &quot;I&apos;m here&quot; to simulate
                arriving at a shop.
              </p>
            )}

            {step >= 2 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Based on your spending patterns and the type of place you&apos;re at
                  (
                  <span className="font-semibold capitalize">
                    {selected?.category}
                  </span>
                  ), PFA picks the card that should give you the best rewards.
                </p>
                <button
                  type="button"
                  onClick={handleShowSuggestion}
                  disabled={loading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium tap-target w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Calculating best card…' : 'Show card suggestion'}
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {card && selected && (
              <div className="mt-3 border border-teal-100 bg-teal-50 rounded-xl p-4 space-y-1">
                <p className="text-sm text-gray-600">
                  For this visit to{' '}
                  <span className="font-semibold">{selected.merchantName}</span> (
                  <span className="capitalize">{selected.category}</span>), PFA
                  recommends:
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {card.name}{' '}
                  <span className="text-xs text-gray-500">
                    ({card.issuer} · {card.network})
                  </span>
                </p>
                <p className="text-xs text-gray-700">
                  {card.rewardRateDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


