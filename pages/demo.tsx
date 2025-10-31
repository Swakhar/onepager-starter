import ModernPortfolio from '@/components/templates/modern-portfolio'
import { modernPortfolioSampleData } from '@/config/sampleData'
import { templates } from '@/config/templates'

export default function TemplateDemoPage() {
  const template = templates['modern-portfolio']
  
  return (
    <div>
      <ModernPortfolio
        data={modernPortfolioSampleData}
        colors={template.defaultColors}
        fonts={template.defaultFonts}
      />
    </div>
  )
}
