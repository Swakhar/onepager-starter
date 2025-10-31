export const fontOptions = {
  system: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  modern: {
    heading: '"Inter", -apple-system, sans-serif',
    body: '"Inter", -apple-system, sans-serif',
  },
  elegant: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Lato", -apple-system, sans-serif',
  },
  creative: {
    heading: '"Poppins", -apple-system, sans-serif',
    body: '"Open Sans", -apple-system, sans-serif',
  },
  professional: {
    heading: '"Roboto", -apple-system, sans-serif',
    body: '"Roboto", -apple-system, sans-serif',
  },
  minimal: {
    heading: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
}

export const headingSizes = {
  h1: 'text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-2xl md:text-3xl lg:text-4xl',
}

export type FontFamily = keyof typeof fontOptions
