export const colorPalettes = {
  modern: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
  },
  elegant: {
    primary: '#1e293b',
    secondary: '#475569',
    accent: '#0ea5e9',
    background: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
  },
  vibrant: {
    primary: '#f97316',
    secondary: '#eab308',
    accent: '#ef4444',
    background: '#fffbeb',
    text: '#78350f',
    textSecondary: '#92400e',
  },
  minimal: {
    primary: '#000000',
    secondary: '#404040',
    accent: '#737373',
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#525252',
  },
  ocean: {
    primary: '#0891b2',
    secondary: '#06b6d4',
    accent: '#14b8a6',
    background: '#f0fdfa',
    text: '#134e4a',
    textSecondary: '#115e59',
  },
  sunset: {
    primary: '#dc2626',
    secondary: '#ea580c',
    accent: '#f59e0b',
    background: '#fff7ed',
    text: '#7c2d12',
    textSecondary: '#9a3412',
  },
}

export type PaletteName = keyof typeof colorPalettes
