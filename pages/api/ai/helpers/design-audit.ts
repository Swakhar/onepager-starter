/**
 * Design Audit Helper Functions
 * 
 * Functions for automated design quality checks:
 * - WCAG color contrast validation
 * - Font readability assessment
 * - Section order best practices
 */

/**
 * Check if colors have sufficient WCAG contrast
 * @returns true if contrast is LOW (< 4.5:1), false if good
 */
export function checkColorContrast(colors: any): boolean {
  if (!colors.text || !colors.background) return false
  
  const textLuminance = getRelativeLuminance(colors.text)
  const bgLuminance = getRelativeLuminance(colors.background)
  const contrast = (Math.max(textLuminance, bgLuminance) + 0.05) / 
                  (Math.min(textLuminance, bgLuminance) + 0.05)
  
  return contrast < 4.5 // WCAG AA minimum for normal text
}

/**
 * Calculate relative luminance for WCAG contrast formula
 * @param hex - Hex color code (e.g., "#FF0000")
 * @returns Relative luminance value (0-1)
 */
export function getRelativeLuminance(hex: string): number {
  // Convert hex to RGB
  const rgb = parseInt(hex.replace('#', ''), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = rgb & 0xff
  
  // Convert to relative luminance using sRGB formula
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Check if fonts have readability issues
 * @returns true if issues found, false if good
 */
export function checkFontReadability(fonts: any): boolean {
  if (!fonts.heading || !fonts.body) return true
  
  // Issue if same font for both (no hierarchy)
  if (fonts.heading === fonts.body) return true
  
  // Issue if using difficult-to-read decorative fonts
  const decorativeFonts = ['Comic Sans', 'Papyrus', 'Brush Script', 'Curlz']
  return decorativeFonts.some(font => 
    fonts.heading?.includes(font) || fonts.body?.includes(font)
  )
}

/**
 * Check if section order follows best practices
 * @returns true if issues found, false if good
 */
export function checkSectionOrder(sections: string[]): boolean {
  if (!sections || sections.length === 0) return false
  
  // Best practice: Hero should be first
  if (sections[0] !== 'hero') return true
  
  // Contact should typically be last or near last
  const contactIndex = sections.indexOf('contact')
  if (contactIndex !== -1 && contactIndex < sections.length - 2) return true
  
  return false
}
