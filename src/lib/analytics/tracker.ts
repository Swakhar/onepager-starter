/**
 * Analytics Tracker for Published Sites
 * This script should be injected into every published onepager site
 * It tracks page views, time on page, and other user interactions
 */

export function initAnalytics(siteId: string) {
  // Check if force tracking is enabled (for testing)
  const urlParams = new URLSearchParams(window.location.search)
  const forceTracking = urlParams.get('debug_analytics') === 'true' || 
                        localStorage.getItem('debug_analytics') === 'true'
  
  // Don't track if running locally or in development (unless force tracking enabled)
  if (typeof window === 'undefined') {
    return
  }
  
  if (window.location.hostname === 'localhost' && !forceTracking) {
    console.log('[Analytics] Skipping tracking - localhost (add ?debug_analytics=true to enable)')
    return
  }

  // Generate or retrieve visitor ID (persists across sessions)
  let visitorId = localStorage.getItem('onepager_visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('onepager_visitor_id', visitorId)
  }

  console.log('[Analytics] Initialized for site:', siteId, 'visitor:', visitorId)

  // Detect device type
  const detectDevice = (): string => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile'
    }
    return 'desktop'
  }

  // Detect browser
  const detectBrowser = (): string => {
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
    if (ua.includes('Edg')) return 'Edge'
    if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE'
    return 'Unknown'
  }

  // Track page view
  const trackPageView = async () => {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          visitorId,
          event: 'page_view',
          pagePath: window.location.pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
          deviceType: detectDevice(),
          browser: detectBrowser(),
          os: navigator.platform,
        }),
      })

      if (response.ok) {
        console.log('[Analytics] Page view tracked')
      } else {
        console.error('[Analytics] Failed to track page view')
      }
    } catch (error) {
      console.error('[Analytics] Tracking error:', error)
    }
  }

  // Track time on page (when user leaves)
  const startTime = Date.now()
  
  const trackTimeOnPage = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000) // seconds
    
    if (timeSpent < 1) return // Don't track if < 1 second

    const data = JSON.stringify({
      siteId,
      visitorId,
      event: 'time_on_page',
      pagePath: timeSpent.toString(), // Store seconds in pagePath for now
      referrer: null,
      userAgent: navigator.userAgent,
      deviceType: detectDevice(),
      browser: detectBrowser(),
      os: navigator.platform,
    })

    // Use sendBeacon for reliable tracking on page unload
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/track', blob)
      console.log(`[Analytics] Time on page tracked: ${timeSpent}s`)
    } else {
      // Fallback for older browsers
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(console.error)
    }
  }

  // Track click events
  const trackClick = (element: HTMLElement) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        visitorId,
        event: 'click',
        pagePath: window.location.pathname,
        referrer: element.tagName + (element.id ? `#${element.id}` : ''),
        userAgent: navigator.userAgent,
        deviceType: detectDevice(),
        browser: detectBrowser(),
        os: navigator.platform,
      }),
    }).catch(console.error)
  }

  // Track scroll depth
  let maxScrollDepth = 0
  const trackScrollDepth = () => {
    const scrollPercentage = Math.round(
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    )
    
    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = scrollPercentage
      
      // Track at 25%, 50%, 75%, 100% milestones
      if ([25, 50, 75, 100].includes(scrollPercentage)) {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            visitorId,
            event: 'scroll_depth',
            pagePath: `${scrollPercentage}%`,
            referrer: window.location.pathname,
            userAgent: navigator.userAgent,
            deviceType: detectDevice(),
            browser: detectBrowser(),
            os: navigator.platform,
          }),
        }).catch(console.error)
        console.log(`[Analytics] Scroll depth: ${scrollPercentage}%`)
      }
    }
  }

  // Track form submissions
  const trackFormSubmit = (form: HTMLFormElement) => {
    const formId = form.id || form.name || 'unnamed-form'
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        visitorId,
        event: 'form_submit',
        pagePath: window.location.pathname,
        referrer: formId,
        userAgent: navigator.userAgent,
        deviceType: detectDevice(),
        browser: detectBrowser(),
        os: navigator.platform,
      }),
    }).catch(console.error)
    console.log(`[Analytics] Form submitted: ${formId}`)
  }

  // Track outbound links
  const trackOutboundLink = (url: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        visitorId,
        event: 'outbound_click',
        pagePath: window.location.pathname,
        referrer: url,
        userAgent: navigator.userAgent,
        deviceType: detectDevice(),
        browser: detectBrowser(),
        os: navigator.platform,
      }),
    }).catch(console.error)
    console.log(`[Analytics] Outbound link clicked: ${url}`)
  }

  // Track file downloads
  const trackDownload = (filename: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        visitorId,
        event: 'download',
        pagePath: window.location.pathname,
        referrer: filename,
        userAgent: navigator.userAgent,
        deviceType: detectDevice(),
        browser: detectBrowser(),
        os: navigator.platform,
      }),
    }).catch(console.error)
    console.log(`[Analytics] File downloaded: ${filename}`)
  }

  // Initialize tracking
  try {
    // Track page view immediately
    trackPageView()

    // Track time on page when user leaves
    window.addEventListener('beforeunload', trackTimeOnPage)
    window.addEventListener('pagehide', trackTimeOnPage) // Mobile Safari

    // Track scroll depth
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(trackScrollDepth, 300)
    }, { passive: true })

    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      
      // Track clicks on links, buttons, and CTAs
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cta') ||
        target.closest('.cta')
      ) {
        trackClick(target)
      }

      // Track outbound links
      const link = target.closest('a') as HTMLAnchorElement
      if (link && link.href && !link.href.includes(window.location.hostname)) {
        trackOutboundLink(link.href)
      }

      // Track file downloads
      if (link && link.href) {
        const downloadExtensions = ['.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv']
        if (downloadExtensions.some(ext => link.href.toLowerCase().includes(ext))) {
          trackDownload(link.href.split('/').pop() || 'unknown')
        }
      }
    }, { passive: true })

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement
      if (form.tagName === 'FORM') {
        trackFormSubmit(form)
      }
    }, { passive: true })

    console.log('[Analytics] Event listeners registered (page view, time, clicks, scroll, forms, downloads)')
  } catch (error) {
    console.error('[Analytics] Initialization error:', error)
  }
}

// Export for use in published sites
if (typeof window !== 'undefined') {
  (window as any).initOnePagerAnalytics = initAnalytics
}
