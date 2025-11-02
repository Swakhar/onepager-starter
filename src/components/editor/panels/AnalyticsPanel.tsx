import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Site } from '@/types/site'
import { createClient } from '@supabase/supabase-js'

interface AnalyticsPanelProps {
  site: Site
  onUpdate: (updates: Partial<Site>) => void
}

interface AnalyticsData {
  views: number
  visitors: number
  clickThroughRate: number
  avgTimeOnPage: string
  bounceRate?: number
  engagementRate?: number
  conversionRate?: number
  topSources: { name: string; count: number }[]
  topPages?: { path: string; views: number }[]
  topDownloads?: { filename: string; count: number }[]
  topExitPages?: { path: string; exits: number }[]
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  recentVisitors: { country: string; city: string; time: string }[]
  growthRate?: {
    views: string
    visitors: string
    avgTime: string
    clickRate: string
  }
}

// Initialize Supabase client for real-time updates
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export function AnalyticsPanel({ site, onUpdate }: AnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    views: 0,
    visitors: 0,
    clickThroughRate: 0,
    avgTimeOnPage: '0s',
    bounceRate: 0,
    engagementRate: 0,
    conversionRate: 0,
    topSources: [],
    topPages: [],
    topDownloads: [],
    topExitPages: [],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    recentVisitors: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch analytics data from API
  const fetchAnalytics = async () => {
    if (!site.published || !site.id) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/get?siteId=${site.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (site.published && site.id) {
      // Initial fetch
      fetchAnalytics()
      
      // Refresh analytics every 30 seconds
      const interval = setInterval(fetchAnalytics, 30000)

      // Set up real-time updates with Supabase Realtime
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.log('[Analytics] Setting up real-time updates for site:', site.id)
        
        const channel = supabase
          .channel(`analytics-${site.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'analytics_events',
              filter: `site_id=eq.${site.id}`,
            },
            (payload) => {
              console.log('[Analytics] New event received:', payload)
              // Update analytics in real-time
              setAnalytics(prev => ({
                ...prev,
                views: prev.views + 1,
              }))
              // Fetch full analytics to update all metrics
              fetchAnalytics()
            }
          )
          .subscribe((status) => {
            console.log('[Analytics] Realtime subscription status:', status)
          })

        return () => {
          clearInterval(interval)
          channel.unsubscribe()
          console.log('[Analytics] Cleaned up real-time subscription')
        }
      }

      return () => clearInterval(interval)
    } else {
      setIsLoading(false)
    }
  }, [site.published, site.id])

  if (!site.published) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Analytics Yet</h3>
          <p className="text-sm text-gray-400 mb-4">
            Publish your site first to start tracking visitor analytics, engagement metrics, and traffic sources.
          </p>
          <Button
            onClick={() => onUpdate({ published: true })}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Publish Site to Enable Analytics
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Analytics</h3>
        <p className="text-sm text-gray-400">Track your site's performance and visitor behavior</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👁️</span>
            <span className="text-xs text-gray-400 uppercase">Total Views</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {analytics.views.toLocaleString()}
          </div>
          {analytics.growthRate?.views && (
            <div className={`text-xs ${analytics.growthRate.views.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.growthRate.views} from last week
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👤</span>
            <span className="text-xs text-gray-400 uppercase">Unique Visitors</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {analytics.visitors.toLocaleString()}
          </div>
          {analytics.growthRate?.visitors && (
            <div className={`text-xs ${analytics.growthRate.visitors.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.growthRate.visitors} from last week
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⏱️</span>
            <span className="text-xs text-gray-400 uppercase">Avg. Time</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {analytics.avgTimeOnPage}
          </div>
          {analytics.growthRate?.avgTime && (
            <div className={`text-xs ${analytics.growthRate.avgTime.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.growthRate.avgTime} from last week
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎯</span>
            <span className="text-xs text-gray-400 uppercase">Click Rate</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {analytics.clickThroughRate}%
          </div>
          {analytics.growthRate?.clickRate && (
            <div className={`text-xs ${analytics.growthRate.clickRate.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.growthRate.clickRate} from last week
            </div>
          )}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>📍</span> Traffic Sources
        </h4>
        <div className="space-y-3">
          {analytics.topSources.map((source, index) => {
            const percentage = (source.count / analytics.visitors) * 100
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{source.name}</span>
                  <span className="text-sm font-semibold text-white">
                    {source.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-[#0f0f0f] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>📱</span> Device Breakdown
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-3xl mb-2">💻</div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.deviceBreakdown.desktop}%
            </div>
            <div className="text-xs text-gray-400">Desktop</div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-3xl mb-2">📱</div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.deviceBreakdown.mobile}%
            </div>
            <div className="text-xs text-gray-400">Mobile</div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.deviceBreakdown.tablet}%
            </div>
            <div className="text-xs text-gray-400">Tablet</div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      {(analytics.bounceRate !== undefined || analytics.engagementRate !== undefined || analytics.conversionRate !== undefined) && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🚪</span>
              <span className="text-xs text-gray-400 uppercase">Bounce Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.bounceRate?.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Lower is better</div>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">✨</span>
              <span className="text-xs text-gray-400 uppercase">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.engagementRate?.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Clicks, scrolls, forms</div>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎯</span>
              <span className="text-xs text-gray-400 uppercase">Conversion</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.conversionRate?.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Form submissions</div>
          </div>
        </div>
      )}

      {/* Top Pages */}
      {analytics.topPages && analytics.topPages.length > 0 && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span>📄</span> Top Pages
          </h4>
          <div className="space-y-2">
            {analytics.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded-lg">
                <span className="text-sm text-gray-300 truncate flex-1">{page.path}</span>
                <span className="text-sm font-semibold text-white ml-2">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Downloads */}
      {analytics.topDownloads && analytics.topDownloads.length > 0 && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span>📥</span> Popular Downloads
          </h4>
          <div className="space-y-2">
            {analytics.topDownloads.map((download, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded-lg">
                <span className="text-sm text-gray-300 truncate flex-1">{download.filename}</span>
                <span className="text-sm font-semibold text-white ml-2">{download.count} downloads</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Exit Pages */}
      {analytics.topExitPages && analytics.topExitPages.length > 0 && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span>🚪</span> Exit Pages
          </h4>
          <div className="space-y-2">
            {analytics.topExitPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded-lg">
                <span className="text-sm text-gray-300 truncate flex-1">{page.path}</span>
                <span className="text-sm font-semibold text-white ml-2">{page.exits} exits</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Visitors */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>🌍</span> Recent Visitors
          <span className="ml-auto flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400">Live</span>
          </span>
        </h4>
        <div className="space-y-3">
          {analytics.recentVisitors.map((visitor, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold">
                  {visitor.country.split(' ')[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{visitor.country}</div>
                  <div className="text-xs text-gray-400">{visitor.city}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{visitor.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔌</span> Analytics Integrations
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Google Analytics</div>
                <div className="text-xs text-gray-400">Track with GA4</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            >
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Facebook Pixel</div>
                <div className="text-xs text-gray-400">Track conversions</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            >
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Hotjar</div>
                <div className="text-xs text-gray-400">Heatmaps & recordings</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            >
              Connect
            </Button>
          </div>
        </div>
      </div>

      {/* Export Report */}
      <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white mb-1">Analytics Report</h4>
            <p className="text-xs text-gray-400">Download detailed insights</p>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            📥 Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
