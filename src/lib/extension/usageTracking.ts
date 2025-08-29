/**
 * Server-side usage tracking for extension API calls
 * Tracks usage per user per day in Firestore
 */

import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export interface UsageStats {
  date: string;
  userId: string;
  endpoints: Record<string, number>;
  totalCalls: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageLimits {
  daily: {
    totalCalls: number;
    perEndpoint: Record<string, number>;
  };
}

// Default daily limits
export const DEFAULT_USAGE_LIMITS: UsageLimits = {
  daily: {
    totalCalls: 1000,
    perEndpoint: {
      'rewrite': 100,
      'translate-chunks': 200,
      'analyze-page': 50,
      'chat': 150,
      'actions': 100,
      'memo/save': 200,
      'slash-prompts': 100,
    }
  }
};

/**
 * Get today's date string in YYYY-MM-DD format
 */
function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get or create usage document for a user for today
 */
export async function getOrCreateUsageDoc(userId: string): Promise<UsageStats> {
  const db = getFirestore();
  const today = getTodayString();
  const docId = `${userId}_${today}`;
  const docRef = db.collection('extension_usage').doc(docId);
  
  const doc = await docRef.get();
  
  if (doc.exists) {
    return doc.data() as UsageStats;
  }
  
  // Create new usage document for today
  const newUsage: UsageStats = {
    date: today,
    userId,
    endpoints: {},
    totalCalls: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await docRef.set(newUsage);
  return newUsage;
}

/**
 * Increment usage counter for an endpoint
 */
export async function incrementUsage(
  userId: string, 
  endpoint: string
): Promise<{ allowed: boolean; usage: UsageStats; limit?: number }> {
  const db = getFirestore();
  const today = getTodayString();
  const docId = `${userId}_${today}`;
  const docRef = db.collection('extension_usage').doc(docId);
  
  try {
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      
      let usage: UsageStats;
      if (doc.exists) {
        usage = doc.data() as UsageStats;
      } else {
        usage = {
          date: today,
          userId,
          endpoints: {},
          totalCalls: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      // Check limits
      const dailyLimit = DEFAULT_USAGE_LIMITS.daily.totalCalls;
      const endpointLimit = DEFAULT_USAGE_LIMITS.daily.perEndpoint[endpoint] || 100;
      const currentEndpointUsage = usage.endpoints[endpoint] || 0;
      
      if (usage.totalCalls >= dailyLimit) {
        return { allowed: false, usage, limit: dailyLimit };
      }
      
      if (currentEndpointUsage >= endpointLimit) {
        return { allowed: false, usage, limit: endpointLimit };
      }
      
      // Increment counters
      usage.endpoints[endpoint] = (usage.endpoints[endpoint] || 0) + 1;
      usage.totalCalls += 1;
      usage.updatedAt = new Date();
      
      transaction.set(docRef, usage);
      
      return { allowed: true, usage };
    });
    
    return result;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    // Allow the request if tracking fails
    return {
      allowed: true,
      usage: {
        date: today,
        userId,
        endpoints: {},
        totalCalls: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  }
}

/**
 * Get usage statistics for a user
 */
export async function getUserUsageStats(
  userId: string, 
  days: number = 7
): Promise<UsageStats[]> {
  const db = getFirestore();
  const stats: UsageStats[] = [];
  
  // Generate date strings for the past N days
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // Fetch usage documents
  const snapshot = await db.collection('extension_usage')
    .where('userId', '==', userId)
    .where('date', 'in', dates)
    .orderBy('date', 'desc')
    .get();
  
  snapshot.forEach(doc => {
    stats.push(doc.data() as UsageStats);
  });
  
  return stats;
}

/**
 * Reset usage for a user (for testing)
 */
export async function resetUserUsage(userId: string): Promise<void> {
  const db = getFirestore();
  const today = getTodayString();
  const docId = `${userId}_${today}`;
  
  await db.collection('extension_usage').doc(docId).delete();
}

/**
 * Get remaining quota for a user
 */
export async function getRemainingQuota(
  userId: string
): Promise<{
  daily: {
    total: { used: number; limit: number; remaining: number };
    endpoints: Record<string, { used: number; limit: number; remaining: number }>;
  };
}> {
  const usage = await getOrCreateUsageDoc(userId);
  const limits = DEFAULT_USAGE_LIMITS;
  
  const dailyTotal = {
    used: usage.totalCalls,
    limit: limits.daily.totalCalls,
    remaining: Math.max(0, limits.daily.totalCalls - usage.totalCalls)
  };
  
  const endpoints: Record<string, any> = {};
  for (const [endpoint, limit] of Object.entries(limits.daily.perEndpoint)) {
    const used = usage.endpoints[endpoint] || 0;
    endpoints[endpoint] = {
      used,
      limit,
      remaining: Math.max(0, limit - used)
    };
  }
  
  return {
    daily: {
      total: dailyTotal,
      endpoints
    }
  };
}
