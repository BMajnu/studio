/**
 * Observability utilities for extension API monitoring
 * Logs latency, errors, and usage patterns
 */

import { getFirestore } from 'firebase-admin/firestore';

export interface ApiLog {
  timestamp: Date;
  userId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  error?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface AggregatedMetrics {
  endpoint: string;
  date: string;
  totalCalls: number;
  successCount: number;
  errorCount: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorTypes: Record<string, number>;
}

/**
 * Log an API call with timing and error information
 */
export async function logApiCall(
  userId: string,
  endpoint: string,
  startTime: number,
  statusCode: number,
  error?: string,
  metadata?: Record<string, any>
): Promise<void> {
  const latencyMs = Date.now() - startTime;
  
  const log: ApiLog = {
    timestamp: new Date(),
    userId,
    endpoint,
    method: 'POST',
    statusCode,
    latencyMs,
    error,
    metadata
  };
  
  try {
    const db = getFirestore();
    
    // Log to real-time collection (auto-deleted after 7 days)
    await db.collection('extension_logs')
      .doc()
      .set({
        ...log,
        ttl: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days TTL
      });
    
    // Update aggregated metrics
    await updateAggregatedMetrics(log);
    
    // Log errors to separate collection for analysis
    if (error || statusCode >= 400) {
      await logError(log);
    }
    
    // Log slow requests (>3 seconds)
    if (latencyMs > 3000) {
      await logSlowRequest(log);
    }
  } catch (err) {
    // Don't let logging errors affect the main flow
    console.error('Failed to log API call:', err);
  }
}

/**
 * Update aggregated metrics for the endpoint
 */
async function updateAggregatedMetrics(log: ApiLog): Promise<void> {
  const db = getFirestore();
  const date = new Date().toISOString().split('T')[0];
  const docId = `${log.endpoint}_${date}`;
  
  const metricsRef = db.collection('extension_metrics').doc(docId);
  
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(metricsRef);
    
    let metrics: Partial<AggregatedMetrics>;
    if (doc.exists) {
      metrics = doc.data() as AggregatedMetrics;
    } else {
      metrics = {
        endpoint: log.endpoint,
        date,
        totalCalls: 0,
        successCount: 0,
        errorCount: 0,
        avgLatencyMs: 0,
        p50LatencyMs: 0,
        p95LatencyMs: 0,
        p99LatencyMs: 0,
        errorTypes: {}
      };
    }
    
    // Update counts
    metrics.totalCalls = (metrics.totalCalls || 0) + 1;
    if (log.statusCode < 400) {
      metrics.successCount = (metrics.successCount || 0) + 1;
    } else {
      metrics.errorCount = (metrics.errorCount || 0) + 1;
      
      // Track error types
      const errorType = log.error || `HTTP_${log.statusCode}`;
      metrics.errorTypes = metrics.errorTypes || {};
      metrics.errorTypes[errorType] = (metrics.errorTypes[errorType] || 0) + 1;
    }
    
    // Update average latency (simplified - in production, store all latencies for percentiles)
    const currentAvg = metrics.avgLatencyMs || 0;
    const currentTotal = metrics.totalCalls || 1;
    metrics.avgLatencyMs = ((currentAvg * (currentTotal - 1)) + log.latencyMs) / currentTotal;
    
    transaction.set(metricsRef, metrics);
  });
}

/**
 * Log error details for debugging
 */
async function logError(log: ApiLog): Promise<void> {
  const db = getFirestore();
  
  await db.collection('extension_errors').add({
    ...log,
    errorType: log.error ? 'application' : 'http',
    httpStatus: log.statusCode,
    createdAt: new Date(),
    resolved: false
  });
}

/**
 * Log slow request for performance analysis
 */
async function logSlowRequest(log: ApiLog): Promise<void> {
  const db = getFirestore();
  
  await db.collection('extension_slow_requests').add({
    ...log,
    threshold: 3000,
    createdAt: new Date(),
    analyzed: false
  });
}

/**
 * Get metrics for a specific endpoint
 */
export async function getEndpointMetrics(
  endpoint: string,
  days: number = 7
): Promise<AggregatedMetrics[]> {
  const db = getFirestore();
  const metrics: AggregatedMetrics[] = [];
  
  // Generate date strings for the past N days
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // Fetch metrics documents
  const snapshot = await db.collection('extension_metrics')
    .where('endpoint', '==', endpoint)
    .where('date', 'in', dates)
    .orderBy('date', 'desc')
    .get();
  
  snapshot.forEach(doc => {
    metrics.push(doc.data() as AggregatedMetrics);
  });
  
  return metrics;
}

/**
 * Get overall system health metrics
 */
export async function getSystemHealth(): Promise<{
  healthy: boolean;
  endpoints: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    errorRate: number;
    avgLatency: number;
    recentErrors: string[];
  }>;
  overallErrorRate: number;
  overallAvgLatency: number;
}> {
  const db = getFirestore();
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch today's metrics for all endpoints
  const snapshot = await db.collection('extension_metrics')
    .where('date', '==', today)
    .get();
  
  const endpoints: Record<string, any> = {};
  let totalCalls = 0;
  let totalErrors = 0;
  let totalLatency = 0;
  
  snapshot.forEach(doc => {
    const metrics = doc.data() as AggregatedMetrics;
    const errorRate = metrics.totalCalls > 0 
      ? (metrics.errorCount / metrics.totalCalls) * 100 
      : 0;
    
    totalCalls += metrics.totalCalls;
    totalErrors += metrics.errorCount;
    totalLatency += metrics.avgLatencyMs * metrics.totalCalls;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (errorRate < 1 && metrics.avgLatencyMs < 1000) {
      status = 'healthy';
    } else if (errorRate < 5 && metrics.avgLatencyMs < 3000) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    endpoints[metrics.endpoint] = {
      status,
      errorRate: Math.round(errorRate * 100) / 100,
      avgLatency: Math.round(metrics.avgLatencyMs),
      recentErrors: Object.keys(metrics.errorTypes || {}).slice(0, 5)
    };
  });
  
  const overallErrorRate = totalCalls > 0 
    ? Math.round((totalErrors / totalCalls) * 10000) / 100 
    : 0;
  const overallAvgLatency = totalCalls > 0 
    ? Math.round(totalLatency / totalCalls) 
    : 0;
  
  return {
    healthy: overallErrorRate < 5 && overallAvgLatency < 2000,
    endpoints,
    overallErrorRate,
    overallAvgLatency
  };
}

/**
 * Create a middleware wrapper for automatic logging
 */
export function withObservability<T extends (...args: any[]) => Promise<any>>(
  endpoint: string,
  handler: T
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    let statusCode = 200;
    let error: string | undefined;
    
    try {
      const result = await handler(...args);
      
      // Extract status code if it's a NextResponse
      if (result && typeof result === 'object' && 'status' in result) {
        statusCode = result.status;
      }
      
      return result;
    } catch (err) {
      statusCode = 500;
      error = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      // Extract userId from the request if available
      const request = args[0];
      let userId = 'unknown';
      
      if (request && typeof request === 'object' && 'userId' in request) {
        userId = request.userId;
      }
      
      await logApiCall(
        userId,
        endpoint,
        startTime,
        statusCode,
        error
      );
    }
  }) as T;
}
