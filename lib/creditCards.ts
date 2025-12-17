// Static dataset of US credit cards for recommendations
export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  rewards: {
    category: string;
    rate: number; // Percentage or multiplier
    cap?: number; // Annual cap in USD
    notes?: string;
  }[];
  annualFee: number;
  signupBonus?: {
    amount: number;
    spendRequirement: number;
    timeframe: number; // months
    notes?: string;
  };
  exclusions?: string[]; // Categories that don't earn rewards
}

export const creditCards: CreditCard[] = [
  // CHASE
  {
    id: 'chase-freedom-flex',
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', rate: 3, notes: '3% cash back on dining' },
      { category: 'drugstores', rate: 3, notes: '3% cash back at drugstores' },
      { category: 'gas_stations', rate: 5, cap: 1500, notes: '5% rotating quarterly categories' },
      { category: 'grocery_stores', rate: 5, cap: 12000, notes: '5% at grocery stores first year (via offer)' },
      { category: 'all', rate: 1, notes: '1% on all other purchases' },
    ],
    annualFee: 0,
    signupBonus: {
      amount: 200,
      spendRequirement: 500,
      timeframe: 3,
      notes: 'Earn $200 bonus after $500 spend in 3 months',
    },
  },
  {
    id: 'chase-sapphire-preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    rewards: [
      { category: 'travel', rate: 5, notes: '5x on travel purchased through Chase' },
      { category: 'travel_general', rate: 2, notes: '2x on other travel' },
      { category: 'dining', rate: 3, notes: '3x on dining' },
      { category: 'streaming', rate: 3, notes: '3x on select streaming services' },
      { category: 'online_grocery', rate: 3, notes: '3x on online grocery (excluding Target/Walmart)' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 95,
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 3,
      notes: '60k Ultimate Rewards points after $4k/3mo',
    },
  },

  // AMEX
  {
    id: 'amex-gold',
    name: 'American Express Gold',
    issuer: 'American Express',
    rewards: [
      { category: 'dining', rate: 4, notes: '4x points at restaurants' },
      { category: 'grocery_stores', rate: 4, cap: 25000, notes: '4x at U.S. supermarkets (up to $25k/year)' },
      { category: 'travel_general', rate: 3, notes: '3x on flights booked directly or via Amex Travel' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 250,
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 6,
      notes: '60k Membership Rewards points after $4k/6mo',
    },
  },
  {
    id: 'amex-blue-cash-preferred',
    name: 'Blue Cash Preferred® Card from American Express',
    issuer: 'American Express',
    rewards: [
      { category: 'grocery_stores', rate: 6, cap: 6000, notes: '6% cash back at U.S. supermarkets (up to $6k/year)' },
      { category: 'streaming', rate: 6, notes: '6% on select U.S. streaming services' },
      { category: 'transit', rate: 3, notes: '3% on transit (taxi, rideshare, parking, etc.)' },
      { category: 'gas_stations', rate: 3, notes: '3% at U.S. gas stations' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 95,
    signupBonus: {
      amount: 300,
      spendRequirement: 3000,
      timeframe: 6,
      notes: 'Earn $300 back after $3k/6mo',
    },
  },

  // CITI
  {
    id: 'citi-double-cash',
    name: 'Citi Double Cash',
    issuer: 'Citi',
    rewards: [
      { category: 'all', rate: 2, notes: '2% cash back on everything (1% when you buy, 1% when you pay)' },
    ],
    annualFee: 0,
  },
  {
    id: 'citi-premier',
    name: 'Citi Premier',
    issuer: 'Citi',
    rewards: [
      { category: 'travel_general', rate: 3, notes: '3x on air travel and hotels' },
      { category: 'gas_stations', rate: 3, notes: '3x at gas stations' },
      { category: 'dining', rate: 3, notes: '3x on dining' },
      { category: 'grocery_stores', rate: 3, notes: '3x at supermarkets' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 95,
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 3,
      notes: '60k ThankYou points after $4k/3mo',
    },
  },

  // CAPITAL ONE
  {
    id: 'capital-one-venture',
    name: 'Capital One Venture',
    issuer: 'Capital One',
    rewards: [
      { category: 'travel_general', rate: 2, notes: '2x miles on every purchase' },
      { category: 'all', rate: 2, notes: 'Flat 2x everywhere (for demo simplicity)' },
    ],
    annualFee: 95,
    signupBonus: {
      amount: 75000,
      spendRequirement: 4000,
      timeframe: 3,
      notes: '75k miles after $4k/3mo',
    },
  },
  {
    id: 'capital-one-savor-one',
    name: 'Capital One SavorOne',
    issuer: 'Capital One',
    rewards: [
      { category: 'dining', rate: 3, notes: '3% cash back on dining' },
      { category: 'entertainment', rate: 3, notes: '3% on entertainment' },
      { category: 'streaming', rate: 3, notes: '3% on popular streaming services' },
      { category: 'grocery_stores', rate: 3, notes: '3% at grocery stores' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 0,
    signupBonus: {
      amount: 200,
      spendRequirement: 500,
      timeframe: 3,
      notes: 'Earn $200 after $500/3mo',
    },
  },

  // DISCOVER
  {
    id: 'discover-it-cash-back',
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    rewards: [
      { category: 'gas_stations', rate: 5, cap: 1500, notes: '5% rotating quarterly categories (gas, etc.)' },
      { category: 'grocery_stores', rate: 5, cap: 1500, notes: '5% at supermarkets in applicable quarters' },
      { category: 'restaurants', rate: 5, cap: 1500, notes: '5% at restaurants in applicable quarters' },
      { category: 'online_shopping', rate: 5, cap: 1500, notes: '5% at select online retailers in applicable quarters' },
      { category: 'all', rate: 1, notes: '1% on all other purchases' },
    ],
    annualFee: 0,
    signupBonus: {
      amount: 0,
      spendRequirement: 0,
      timeframe: 12,
      notes: 'Cashback Match: Discover matches all cash back at end of first year',
    },
  },
];

// Map Plaid categories to our reward categories
export function mapPlaidCategoryToRewardCategory(plaidCategory: string[]): string {
  const primary = plaidCategory[0]?.toLowerCase() || '';
  const secondary = plaidCategory[1]?.toLowerCase() || '';
  
  const categoryMap: Record<string, string> = {
    'food and drink': 'dining',
    'restaurants': 'dining',
    'fast food': 'dining',
    'bars': 'dining',
    'gas stations': 'gas_stations',
    'gas': 'gas_stations',
    'groceries': 'grocery_stores',
    'supermarkets': 'grocery_stores',
    'convenience stores': 'grocery_stores',
    'travel': 'travel_general',
    'airlines and aviation services': 'travel_general',
    'lodging': 'travel_general',
    'drug stores and pharmacies': 'drugstores',
    'drugstores': 'drugstores',
    'entertainment': 'entertainment',
    'movies and music': 'entertainment',
    'shopping': 'shopping',
    'online shopping': 'online_shopping',
    'subscription': 'streaming',
    'subscription services': 'streaming',
    'public transportation services': 'transit',
    'taxicabs and limousines': 'transit',
  };
  
  return categoryMap[primary] || categoryMap[secondary] || 'all';
}

export function getBestCardForCategory(
  category: string,
  monthlySpend: number = 0
): CreditCard | null {
  let bestCard: CreditCard | null = null;
  let bestReward = 0;
  
  for (const card of creditCards) {
    for (const reward of card.rewards) {
      if (reward.category === category || reward.category === 'all') {
        const effectiveRate = reward.category === category ? reward.rate : 0;
        const annualSpend = monthlySpend * 12;
        const cappedSpend = reward.cap ? Math.min(annualSpend, reward.cap) : annualSpend;
        const annualReward = (cappedSpend * effectiveRate) / 100;
        const netReward = annualReward - card.annualFee;
        
        if (netReward > bestReward) {
          bestReward = netReward;
          bestCard = card;
        }
      }
    }
  }
  
  return bestCard;
}

