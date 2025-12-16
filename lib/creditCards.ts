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
  {
    id: 'chase-freedom-flex',
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    rewards: [
      { category: 'gas_stations', rate: 5, cap: 1500, notes: 'Q1 2024' },
      { category: 'grocery_stores', rate: 5, cap: 12000, notes: 'First year only' },
      { category: 'dining', rate: 3 },
      { category: 'drugstores', rate: 3 },
      { category: 'all', rate: 1 },
    ],
    annualFee: 0,
    signupBonus: {
      amount: 200,
      spendRequirement: 500,
      timeframe: 3,
    },
  },
  {
    id: 'amex-gold',
    name: 'American Express Gold',
    issuer: 'American Express',
    rewards: [
      { category: 'dining', rate: 4, notes: '4x Membership Rewards points' },
      { category: 'grocery_stores', rate: 4, cap: 25000, notes: '4x Membership Rewards points' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 250,
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 6,
      notes: '60k Membership Rewards points',
    },
  },
  {
    id: 'citi-double-cash',
    name: 'Citi Double Cash',
    issuer: 'Citi',
    rewards: [
      { category: 'all', rate: 2, notes: '1% on purchase, 1% on payment' },
    ],
    annualFee: 0,
  },
  {
    id: 'chase-sapphire-preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', rate: 3, notes: '3x Ultimate Rewards points' },
      { category: 'travel', rate: 3, notes: '3x Ultimate Rewards points' },
      { category: 'streaming', rate: 3 },
      { category: 'online_grocery', rate: 3 },
      { category: 'all', rate: 1 },
    ],
    annualFee: 95,
    signupBonus: {
      amount: 60000,
      spendRequirement: 4000,
      timeframe: 3,
      notes: '60k Ultimate Rewards points',
    },
  },
  {
    id: 'capital-one-venture',
    name: 'Capital One Venture',
    issuer: 'Capital One',
    rewards: [
      { category: 'travel', rate: 5, notes: '5x miles via portal' },
      { category: 'all', rate: 2, notes: '2x miles on all purchases' },
    ],
    annualFee: 95,
    signupBonus: {
      amount: 75000,
      spendRequirement: 4000,
      timeframe: 3,
      notes: '75k miles',
    },
  },
  {
    id: 'discover-it-cash-back',
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    rewards: [
      { category: 'gas_stations', rate: 5, cap: 1500, notes: 'Q1 2024' },
      { category: 'grocery_stores', rate: 5, cap: 1500, notes: 'Q2 2024' },
      { category: 'restaurants', rate: 5, cap: 1500, notes: 'Q3 2024' },
      { category: 'amazon', rate: 5, cap: 1500, notes: 'Q4 2024' },
      { category: 'all', rate: 1 },
    ],
    annualFee: 0,
    signupBonus: {
      amount: 0,
      spendRequirement: 0,
      timeframe: 0,
      notes: 'Cashback match first year',
    },
  },
];

// Map Plaid categories to our reward categories
export function mapPlaidCategoryToRewardCategory(plaidCategory: string[]): string {
  const primary = plaidCategory[0]?.toLowerCase() || '';
  
  const categoryMap: Record<string, string> = {
    'food and drink': 'dining',
    'restaurants': 'dining',
    'gas stations': 'gas_stations',
    'groceries': 'grocery_stores',
    'supermarkets': 'grocery_stores',
    'travel': 'travel',
    'drugstores': 'drugstores',
    'entertainment': 'entertainment',
    'shopping': 'shopping',
    'online': 'online',
  };
  
  return categoryMap[primary] || 'all';
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

