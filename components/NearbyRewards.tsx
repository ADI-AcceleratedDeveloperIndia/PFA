'use client';

import { useState } from 'react';
import type { CreditCard } from '@/lib/creditCards';

interface NearbyMerchantZone {
  name: string;
  category: string;
  lat: number;
  lng: number;
}

interface ByCategoryResponse {
  category: string;
  card: CreditCard;
}

// Simple demo zones (no tracking, only used when user explicitly taps the button)
const DEMO_ZONES: NearbyMerchantZone[] = [
  {
    name: 'Downtown Coffee (Demo)',
    category: 'dining',
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    name: 'City Supermarket (Demo)',
    category: 'groceries',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    name: 'Urban Gas Station (Demo)',
    category: 'gas',
    lat: 34.0522,
    lng: -118.2437,
  },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NearbyRewards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    merchantName: string;
    category: string;
    card?: CreditCard;
  } | null>(null);

  const handleCheckNearby = () => {
    setError(null);
    setSuggestion(null);

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setError('Location is not available on this device.');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Find the closest demo zone (purely for sandbox/demo)
        let closest = DEMO_ZONES[0];
        let closestDist = Infinity;

        DEMO_ZONES.forEach((zone) => {
          const d = haversineDistance(latitude, longitude, zone.lat, zone.lng);
          if (d < closestDist) {
            closestDist = d;
            closest = zone;
          }
        });

        try {
          const res = await fetch(
            `/api/recommendations/by-category?category=${encodeURIComponent(
              closest.category
            )}`
          );
          if (!res.ok) {
            throw new Error('Failed to load card recommendations');
          }
          const data: ByCategoryResponse = await res.json();

          setSuggestion({
            merchantName: closest.name,
            category: closest.category,
            card: data.card,
          });
        } catch (e) {
          setError(
            e instanceof Error ? e.message : 'Could not load recommendations'
          );
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission denied. You can still use all features manually.');
        } else {
          setError('Could not read your location. Try again in an open area.');
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Nearby rewards (demo)</h3>
          <p className="text-sm text-gray-500">
            Check which card to use based on your current area. Location is only read when you tap.
          </p>
        </div>
        <span className="text-2xl">📍</span>
      </div>

      <button
        onClick={handleCheckNearby}
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed tap-target"
      >
        {loading ? 'Checking nearby rewards...' : 'Check nearby rewards'}
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {suggestion && suggestion.card && (
        <div className="mt-2 border border-teal-100 rounded-xl p-4 bg-teal-50">
          <p className="text-sm text-gray-600 mb-1">
            You&apos;re near a <span className="font-semibold capitalize">{suggestion.category}</span> place
            (demo: {suggestion.merchantName}).
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            Use <span className="text-primary-700">{suggestion.card.name}</span> for best rewards here.
          </p>
          {suggestion.card.rewards && (
            <p className="text-xs text-gray-600 mt-1">
              Top rewards category:{" "}
              <span className="font-medium">
                {suggestion.card.rewards[0].category.replace(/_/g, " ")} –{" "}
                {suggestion.card.rewards[0].rate}x
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}


