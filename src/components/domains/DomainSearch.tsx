import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface DomainSearchProps {
  currentDomain?: string
  onConnect: (domain: string) => void
}

interface DomainResult {
  domain: string
  available: boolean
  price: string
  suggested?: boolean
  premium?: boolean
}

export default function DomainSearch({ currentDomain, onConnect }: DomainSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DomainResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedTLD, setSelectedTLD] = useState<string>('.com')

  const tlds = [
    { name: '.com', popular: true },
    { name: '.io', popular: true },
    { name: '.dev', popular: true },
    { name: '.app', popular: false },
    { name: '.co', popular: false },
    { name: '.net', popular: false },
    { name: '.org', popular: false },
    { name: '.ai', popular: false },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Simulate API call - In production, replace with actual domain API
    setTimeout(() => {
      const baseName = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, '')
      const results: DomainResult[] = []

      // Main domain with selected TLD
      results.push({
        domain: `${baseName}${selectedTLD}`,
        available: Math.random() > 0.5,
        price: selectedTLD === '.com' ? '$12.99' : selectedTLD === '.io' ? '$39.99' : '$19.99',
      })

      // Suggestions
      const suggestions = [
        `get${baseName}.com`,
        `${baseName}hq.com`,
        `try${baseName}.com`,
        `${baseName}.io`,
        `${baseName}.dev`,
        `my${baseName}.com`,
      ]

      suggestions.forEach((domain, idx) => {
        results.push({
          domain,
          available: Math.random() > 0.3,
          price: domain.endsWith('.com') ? '$12.99' : domain.endsWith('.io') ? '$39.99' : '$19.99',
          suggested: true,
          premium: idx === 0 && Math.random() > 0.7,
        })
      })

      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const handleQuickTLD = (tld: string) => {
    setSelectedTLD(tld)
    if (searchQuery.trim()) {
      setTimeout(() => handleSearch(), 100)
    }
  }

  return (
    <div className="h-full bg-[#1a1a1a] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Find Your Perfect Domain</h2>
          <p className="text-gray-400">Search for available domains and connect them instantly</p>
        </div>

        {/* Search Box */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter your domain name..."
              className="flex-1 bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6"
            >
              {isSearching ? '⏳ Searching...' : '🔍 Search'}
            </Button>
          </div>

          {/* Quick TLD Selection */}
          <div className="flex flex-wrap gap-2">
            {tlds.filter(t => t.popular).map((tld) => (
              <button
                key={tld.name}
                onClick={() => handleQuickTLD(tld.name)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedTLD === tld.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {tld.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Search Results</h3>
              <span className="text-sm text-gray-400">
                {searchResults.filter(r => r.available).length} available
              </span>
            </div>

            <div className="space-y-2">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    result.available
                      ? 'bg-[#0f0f0f] border-green-700/30 hover:border-green-700'
                      : 'bg-[#0f0f0f] border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        result.available ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{result.domain}</span>
                          {result.suggested && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              Suggested
                            </span>
                          )}
                          {result.premium && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              ⭐ Premium
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {result.available ? 'Available' : 'Taken'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{result.price}/yr</span>
                      {result.available && (
                        <Button
                          onClick={() => onConnect(result.domain)}
                          size="sm"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
          <div className="p-4 bg-[#0f0f0f] rounded-lg">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold text-white mb-1">Free SSL</h4>
            <p className="text-sm text-gray-400">Automatic HTTPS encryption included</p>
          </div>
          <div className="p-4 bg-[#0f0f0f] rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-white mb-1">Fast DNS</h4>
            <p className="text-sm text-gray-400">Global DNS propagation in minutes</p>
          </div>
          <div className="p-4 bg-[#0f0f0f] rounded-lg">
            <div className="text-2xl mb-2">📧</div>
            <h4 className="font-semibold text-white mb-1">Email Forwarding</h4>
            <p className="text-sm text-gray-400">Forward emails to your inbox</p>
          </div>
        </div>

        {/* Already have a domain */}
        <div className="p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Already have a domain?</h4>
          <p className="text-sm text-gray-400 mb-3">
            Connect your existing domain by updating your DNS settings
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gray-500">1.</span>
              <span className="text-gray-400">Log in to your domain registrar</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">2.</span>
              <span className="text-gray-400">Add a CNAME record pointing to: <code className="text-indigo-400">sites.onepager.com</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">3.</span>
              <span className="text-gray-400">Enter your domain below</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="yourdomain.com"
              className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={() => {
                const input = document.querySelector('input[placeholder="yourdomain.com"]') as HTMLInputElement
                if (input?.value) {
                  onConnect(input.value)
                }
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
