/**
 * Cache Statistics Endpoint
 * 
 * Returns detailed statistics about all AI caches.
 * Use this to monitor cache performance and optimize settings.
 * 
 * Usage:
 * GET /api/ai/cache-stats
 * 
 * Returns:
 * {
 *   "siteGenerator": { size: "3/100", hits: 15, misses: 42, hitRate: "26.3%" },
 *   "promptAnalysis": { ... },
 *   "contentGeneration": { ... }
 * }
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { 
  siteGeneratorCache, 
  promptAnalysisCache, 
  contentGenerationCache 
} from './helpers/cache'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Optional: Add authentication here
    // const token = req.headers.authorization
    // if (!isValidAdminToken(token)) {
    //   return res.status(401).json({ error: 'Unauthorized' })
    // }

    // Get stats from all caches
    const siteGenStats = siteGeneratorCache.getStats()
    const promptStats = promptAnalysisCache.getStats()
    const contentStats = contentGenerationCache.getStats()

    // Format for display
    const formatStats = (stats: any, maxSize: number) => {
      const now = Date.now()
      return {
        size: `${stats.size}/${maxSize}`,
        hits: stats.hits,
        misses: stats.misses,
        hitRate: `${(stats.hitRate * 100).toFixed(1)}%`,
        oldestEntryAge: stats.oldestEntry 
          ? `${Math.round((now - stats.oldestEntry) / 60000)}m ago`
          : 'N/A',
        newestEntryAge: stats.newestEntry
          ? `${Math.round((now - stats.newestEntry) / 60000)}m ago`
          : 'N/A',
      }
    }

    const response = {
      timestamp: new Date().toISOString(),
      caches: {
        siteGenerator: formatStats(siteGenStats, 100),
        promptAnalysis: formatStats(promptStats, 200),
        contentGeneration: formatStats(contentStats, 100),
      },
      // Calculate estimated cost savings
      savings: {
        siteGenerator: {
          apiCallsAvoided: siteGenStats.hits,
          estimatedSavings: `$${(siteGenStats.hits * 0.01).toFixed(2)}`,
        },
        promptAnalysis: {
          apiCallsAvoided: promptStats.hits,
          estimatedSavings: `$${(promptStats.hits * 0.003).toFixed(3)}`,
        },
        contentGeneration: {
          apiCallsAvoided: contentStats.hits,
          estimatedSavings: `$${(contentStats.hits * 0.006).toFixed(3)}`,
        },
        total: {
          apiCallsAvoided: siteGenStats.hits + promptStats.hits + contentStats.hits,
          estimatedSavings: `$${(
            siteGenStats.hits * 0.01 +
            promptStats.hits * 0.003 +
            contentStats.hits * 0.006
          ).toFixed(3)}`,
        },
      },
      // Add recommendations
      recommendations: generateRecommendations(siteGenStats, promptStats, contentStats),
    }

    // Also log to console for quick checking
    console.log('\n📊 Cache Statistics Report:')
    console.log('='.repeat(60))
    console.log('Site Generator:', formatStats(siteGenStats, 100))
    console.log('Prompt Analysis:', formatStats(promptStats, 200))
    console.log('Content Generation:', formatStats(contentStats, 100))
    console.log('\n💰 Cost Savings:', response.savings.total)
    console.log('='.repeat(60) + '\n')

    return res.status(200).json(response)
  } catch (error: any) {
    console.error('❌ Error fetching cache stats:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch cache statistics',
      message: error.message 
    })
  }
}

/**
 * Generate recommendations based on cache performance
 */
function generateRecommendations(
  siteGenStats: any,
  promptStats: any,
  contentStats: any
): string[] {
  const recommendations: string[] = []

  // Check site generator hit rate
  if (siteGenStats.hitRate < 0.05 && siteGenStats.hits + siteGenStats.misses > 20) {
    recommendations.push(
      'Site generator hit rate is low (<5%). Consider increasing cache TTL or size.'
    )
  }

  // Check if cache is getting full
  if (siteGenStats.size > 80) {
    recommendations.push(
      'Site generator cache is >80% full. Consider increasing maxSize to avoid frequent evictions.'
    )
  }

  // Check for high hit rate (good performance)
  if (siteGenStats.hitRate > 0.2) {
    recommendations.push(
      `✅ Excellent site generator hit rate (${(siteGenStats.hitRate * 100).toFixed(1)}%)! Cache is saving significant costs.`
    )
  }

  // Check total savings
  const totalSavings = 
    siteGenStats.hits * 0.01 +
    promptStats.hits * 0.003 +
    contentStats.hits * 0.006

  if (totalSavings > 1) {
    recommendations.push(
      `✅ Cache has saved $${totalSavings.toFixed(2)} in API costs! Keep monitoring.`
    )
  }

  // If no issues, give positive feedback
  if (recommendations.length === 0) {
    recommendations.push(
      'Cache performance looks good. Continue monitoring as traffic grows.'
    )
  }

  return recommendations
}
