import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { analyzeSpendingByCategory, predictNextSpends } from '@/lib/intelligence';
import { getBestCardForCategory, creditCards, mapPlaidCategoryToRewardCategory } from '@/lib/creditCards';

// Mark as dynamic since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Get spending patterns
    const spendingPatterns = await analyzeSpendingByCategory(userId, 3);
    const predictions = await predictNextSpends(userId);
    
    // Generate recommendations for top spending categories
    const recommendations: any[] = [];
    
    // Current spending recommendations
    for (const pattern of spendingPatterns.slice(0, 5)) {
      const rewardCategory = mapPlaidCategoryToRewardCategory([pattern.category]);
      const bestCard = getBestCardForCategory(rewardCategory, pattern.monthlyAverage);
      
      if (bestCard) {
        recommendations.push({
          type: 'current_spending',
          category: pattern.category,
          monthlySpend: pattern.monthlyAverage,
          recommendedCard: bestCard,
          reason: `You spend $${pattern.monthlyAverage.toFixed(2)}/month on ${pattern.category}. ${bestCard.name} offers the best rewards for this category.`,
        });
      }
    }
    
    // Predicted spending recommendations
    for (const prediction of predictions.slice(0, 3)) {
      if (prediction.probability > 0.5) {
        const rewardCategory = mapPlaidCategoryToRewardCategory([prediction.category]);
        const monthlySpend = (prediction.expectedAmount || 0) * 30;
        const bestCard = getBestCardForCategory(rewardCategory, monthlySpend);
        
        if (bestCard) {
          recommendations.push({
            type: 'predicted_spending',
            category: prediction.category,
            probability: prediction.probability,
            expectedAmount: prediction.expectedAmount,
            recommendedCard: bestCard,
            reason: `You're likely to spend on ${prediction.category} soon. Consider using ${bestCard.name} for this purchase.`,
          });
        }
      }
    }
    
    // General recommendations (best overall cards for key demo categories)
    const demoCategories = [
      'dining',
      'grocery_stores',
      'gas_stations',
      'online_shopping',
      'streaming',
      'transit',
      'travel_general',
    ];

    const seen = new Set<string>();
    const topCards = demoCategories
      .map((cat) => getBestCardForCategory(cat, 500))
      .filter((card): card is NonNullable<typeof card> => !!card)
      .filter((card) => {
        if (seen.has(card.id)) return false;
        seen.add(card.id);
        return true;
      })
      .slice(0, 6);
    
    return NextResponse.json({
      recommendations,
      topCards,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

