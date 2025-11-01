import { Button } from '@/components/ui/Button'
import { Site } from '@/types/site'

interface ExportButtonsProps {
  site: Site
}

export function ExportButtons({ site }: ExportButtonsProps) {
  const handleExportHTML = () => {
    // TODO: Implement HTML export
    alert('HTML export coming soon!')
  }

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon!')
  }

  const handleShare = () => {
    const url = site.customDomain || `${window.location.origin}/preview/${site.id}`
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportHTML}
        className="bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a]"
      >
        📄 HTML
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className="bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a]"
      >
        📑 PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a]"
      >
        🔗 Share
      </Button>
    </div>
  )
}
