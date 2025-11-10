# OnePager Starter (Next.js + Tailwind + Supabase)

A production-ready one-page website builder with AI-powered design features.

## ✨ Features

- **Next.js + TypeScript** - Modern React framework with type safety
- **Tailwind CSS** - Utility-first styling
- **Supabase Integration** - Authentication & database (or localStorage fallback)
- **Multiple Templates** - Business card, portfolio, resume, and more
- **AI Visual Builder** - ChatGPT-like design commands, screenshot analysis, style transfer
- **Smart Suggestions** - Expert UX/UI improvements with WCAG compliance
- **Voice Commands** - Design with your voice
- **Before/After Comparison** - Compare and restore AI changes
- **Keyboard Shortcuts** - Power user friendly
- **Export Options** - HTML, React, Vue, Angular, Svelte

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
pages/
├── index.tsx              # Landing page
├── editor.tsx             # Main editor workspace
├── dashboard.tsx          # User dashboard
├── templates.tsx          # Template gallery
└── api/                   # API routes
    └── ai/                # AI features
        ├── visual-builder.ts           # Main AI router (67 lines)
        └── helpers/                    # Modular helpers
            ├── prompts.ts              # AI prompts
            ├── design-audit.ts         # WCAG checks
            ├── screenshot-analyzer.ts  # Image analysis
            ├── style-transfer.ts       # Style transfer
            ├── natural-command.ts      # Command processing
            └── smart-suggestions.ts    # UX suggestions

src/
├── components/
│   ├── editor/
│   │   ├── VisualAIBuilder.tsx        # Main AI component (438 lines)
│   │   ├── AIAssistant.tsx            # AI chat assistant
│   │   ├── ImageSuggestions.tsx       # Image recommendations
│   │   └── ai-builder/                # Mode components
│   │       ├── NaturalCommandMode.tsx
│   │       ├── ScreenshotMode.tsx
│   │       ├── StyleTransferMode.tsx
│   │       ├── SmartSuggestionsMode.tsx
│   │       └── BeforeAfterComparison.tsx
│   ├── templates/         # Template components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useVoiceCommand.ts
│   ├── useCommandHistory.ts
│   ├── useSnapshot.ts
│   └── useKeyboardShortcuts.ts
├── lib/                   # Utilities
├── types/                 # TypeScript types
└── config/                # Configuration files
```

## 📚 Documentation

### Core Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flow diagrams

## 🎨 AI Visual Builder

The AI Visual Builder provides 4 powerful modes:

### 1. Natural Commands (ChatGPT-like)
```
"Make it blue"
"Change hero title to 'Welcome to my portfolio'"
"Remove the about section"
"Reorder sections: hero, projects, contact"
```

### 2. Screenshot Analysis
- Upload any website screenshot
- AI extracts colors, fonts, layout patterns
- One-click apply to your design
- **Cost:** ~$0.01 per screenshot (GPT-4o-mini vision)

### 3. Style Transfer
- Upload a reference design
- Choose what to transfer (colors, fonts, layout, spacing)
- AI adapts style to your template
- Works with ANY website screenshot

### 4. Smart Suggestions
- AI analyzes your design
- WCAG compliance checks (contrast, readability)
- Expert UX/UI improvements
- One-click apply suggestions
- **Cost:** ~$0.002 per analysis (GPT-3.5-turbo)

**All modes include:**
- ⏪ Before/After comparison with restore
- 🎤 Voice commands (browser-supported)
- 📝 Command history and favorites
- ⚡ Real-time preview updates

## 🧪 Testing Checklist

Before deploying, test these core features:

- [ ] Create new site from template
- [ ] Edit content in panels
- [ ] Use natural command: "Make it blue"
- [ ] Upload screenshot and analyze
- [ ] Transfer style from reference
- [ ] Generate smart suggestions
- [ ] Compare before/after and restore
- [ ] Test voice commands (Chrome/Safari)
- [ ] Export to HTML/React/Vue
- [ ] Publish site and view preview

## 🔧 Development

### Key Files to Understand

**Main Editor:**
- `pages/editor.tsx` - Editor workspace and layout
- `src/components/editor/VisualAIBuilder.tsx` - AI builder orchestrator

**Templates:**
- `src/components/templates/` - All template components
- `src/config/templates.ts` - Template registry

**API Routes:**
- `pages/api/ai/visual-builder.ts` - Main AI router
- `pages/api/ai/helpers/` - Modular AI helpers

**Custom Hooks:**
- `src/hooks/useVoiceCommand.ts` - Voice input
- `src/hooks/useCommandHistory.ts` - History management
- `src/hooks/useSnapshot.ts` - Before/after snapshots

### Adding a New Template

1. **Create Template Component:**
   ```typescript
   // src/components/templates/my-template/index.tsx
   export const MyTemplate = ({ data, colors, fonts }) => {
     return <div>...</div>
   }
   ```

2. **Register Template:**
   ```typescript
   // src/config/templates.ts
   export const templates = [
     {
       id: 'my-template',
       name: 'My Template',
       description: 'Description here',
       category: 'business',
       component: MyTemplate
     }
   ]
   ```

3. **Add Template Purpose (for AI):**
   ```typescript
   // pages/api/ai/helpers/prompts.ts
   export function getTemplatePurpose(templateType: string): string {
     switch (templateType) {
       case 'my-template':
         return 'A professional template for XYZ with sections: hero, about, services'
       // ...
     }
   }
   ```

4. **Done!** All AI modes automatically work with your new template.

### Adding a New AI Mode

1. **Create Mode Component:**
   ```typescript
   // src/components/editor/ai-builder/MyNewMode.tsx
   interface MyNewModeProps {
     isProcessing: boolean
     onGenerate: () => void
     // ... other props
   }
   
   export const MyNewMode: React.FC<MyNewModeProps> = ({ ... }) => {
     return <div>Mode UI here</div>
   }
   ```

2. **Add to Main Component:**
   ```typescript
   // src/components/editor/VisualAIBuilder.tsx
   
   // Add to mode type
   type BuilderMode = 'screenshot' | 'style-transfer' | 'natural-command' | 'suggestions' | 'my-mode'
   
   // Add to mode selector
   { id: 'my-mode', label: '🆕 My Mode', desc: 'Does cool stuff' }
   
   // Add to mode content
   {mode === 'my-mode' && <MyNewMode {...props} />}
   ```

3. **Add API Handler:**
   ```typescript
   // pages/api/ai/helpers/my-feature.ts
   export async function processMyFeature(params: any) {
     // Your logic here
   }
   ```

4. **Update Router:**
   ```typescript
   // pages/api/ai/visual-builder.ts
   case 'my-feature':
     return await processMyFeature(body)
   ```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
Works with any Next.js hosting:
- Netlify
- AWS Amplify  
- Railway
- Render

## 🤝 Contributing

Contributions welcome! Please read the documentation first to understand the architecture.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and OpenAI**
