# Architecture Overview - Visual AI Builder

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Editor Page - editor.tsx)                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              VisualAIBuilder.tsx (438 lines)                    │
│                    Main Orchestrator                             │
├─────────────────────────────────────────────────────────────────┤
│  • Mode selection UI                                            │
│  • State management (command, screenshots, options)             │
│  • API call orchestration                                       │
│  • Apply changes to parent                                      │
│  • Error handling                                               │
└───┬─────────────┬─────────────┬─────────────┬──────────────┬───┘
    │             │             │             │              │
    ▼             ▼             ▼             ▼              ▼
┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐   ┌──────────┐
│Natural│   │Screen │   │Style  │   │Smart  │   │Before/   │
│Command│   │shot   │   │Transfer   │Suggest│   │After     │
│Mode   │   │Mode   │   │Mode   │   │Mode   │   │Compare   │
└───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘   └────┬─────┘
    │           │           │           │            │
    └───────────┴───────────┴───────────┴────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOM HOOKS LAYER                          │
├─────────────────┬───────────────────┬───────────────────────────┤
│ useVoiceCommand │ useCommandHistory │ useSnapshot               │
│  (Voice input)  │  (History/Favs)   │  (Before/After)          │
└─────────────────┴───────────────────┴───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│              /pages/api/ai/visual-builder.ts                    │
│                    (Main Router - 67 lines)                     │
└───┬─────────────┬─────────────┬─────────────┬──────────────┬───┘
    │             │             │             │              │
    ▼             ▼             ▼             ▼              ▼
┌────────┐  ┌──────────┐  ┌───────┐  ┌───────┐  ┌──────────┐
│prompts │  │design    │  │screen │  │style  │  │natural   │
│.ts     │  │-audit.ts │  │shot   │  │transfer  │-command  │
│        │  │          │  │-analyze│  │.ts    │  │.ts       │
└────────┘  └──────────┘  └───────┘  └───────┘  └──────────┘
                                                  ┌──────────┐
                                                  │smart     │
                                                  │-suggest  │
                                                  │ions.ts   │
                                                  └──────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  • OpenAI GPT-4o-mini (Vision)                                 │
│  • OpenAI GPT-3.5-turbo (Text)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow - Natural Command Example

```
1. USER INPUT
   ↓
   User types: "Make it blue"
   ↓
   
2. COMPONENT
   ↓
   NaturalCommandMode.tsx
   • Displays textarea
   • User clicks "Process Command"
   • Calls onProcess() callback
   ↓
   
3. MAIN ORCHESTRATOR
   ↓
   VisualAIBuilder.tsx
   • processCommand() function runs
   • Captures snapshot via useSnapshot hook
   • Prepares API payload
   ↓
   
4. API ROUTE
   ↓
   /api/ai/visual-builder
   • Routes to natural-command handler
   ↓
   
5. HELPER MODULE
   ↓
   natural-command.ts
   • Gets prompt from prompts.ts
   • Calls OpenAI GPT-3.5-turbo
   • Parses response
   • Returns structured changes
   ↓
   
6. MAIN ORCHESTRATOR
   ↓
   VisualAIBuilder.tsx
   • Receives API response
   • Calls applyNaturalCommandChanges()
   • Transforms to editor format
   • Calls onApplyChanges() callback
   ↓
   
7. PARENT EDITOR
   ↓
   editor.tsx
   • Receives updated colors/fonts/data
   • Updates preview
   • Saves to storage
   ↓
   
8. UI UPDATE
   ↓
   User sees blue design! ✨
```

---

## 🔄 Data Flow - Screenshot Analysis Example

```
1. USER INPUT
   ↓
   User uploads screenshot.png
   ↓
   
2. COMPONENT
   ↓
   ScreenshotMode.tsx
   • Displays file upload
   • Converts to base64
   • Shows preview
   • User clicks "Analyze"
   • Calls onAnalyze() callback
   ↓
   
3. MAIN ORCHESTRATOR
   ↓
   VisualAIBuilder.tsx
   • processScreenshot() function runs
   • Prepares API payload with base64 image
   ↓
   
4. API ROUTE
   ↓
   /api/ai/visual-builder
   • Routes to analyze-screenshot handler
   ↓
   
5. HELPER MODULE
   ↓
   screenshot-analyzer.ts
   • Gets prompt from prompts.ts
   • Calls OpenAI GPT-4o-mini (vision)
   • Parses JSON response
   • Extracts colors, fonts, layout
   ↓
   
6. MAIN ORCHESTRATOR
   ↓
   VisualAIBuilder.tsx
   • Receives analysis
   • Displays in ScreenshotMode
   • User clicks "Apply"
   • Calls applyScreenshotDesign()
   • Captures snapshot first
   • Calls onApplyChanges()
   ↓
   
7. PARENT EDITOR
   ↓
   editor.tsx
   • Updates colors from palette
   • Updates fonts from typography
   • Re-renders preview
   ↓
   
8. UI UPDATE
   ↓
   User sees design matching screenshot! ✨
```

---

## 📦 Component Hierarchy

```
VisualAIBuilder.tsx (Main)
├── Mode Selector (4 buttons)
├── Error Display (conditional)
└── Active Mode Content
    ├── NaturalCommandMode
    │   ├── Command Input (textarea)
    │   ├── Voice Button (useVoiceCommand)
    │   ├── Process Button
    │   ├── Result Display
    │   ├── Recent Commands (useCommandHistory)
    │   └── Favorites Panel (useCommandHistory)
    │
    ├── ScreenshotMode
    │   ├── File Upload
    │   ├── Image Preview
    │   ├── Analyze Button
    │   ├── Analysis Result
    │   │   ├── Adaptation Strategy
    │   │   ├── Color Palette
    │   │   ├── Typography
    │   │   └── Tags
    │   └── Action Buttons (Apply/Cancel)
    │
    ├── StyleTransferMode
    │   ├── File Upload
    │   ├── Image Preview
    │   ├── Transfer Options
    │   │   ├── Colors Checkbox
    │   │   ├── Fonts Checkbox
    │   │   ├── Layout Checkbox
    │   │   └── Spacing Checkbox
    │   ├── Transfer Button
    │   └── Success Message
    │
    ├── SmartSuggestionsMode
    │   ├── Generate Button (or Loading)
    │   ├── Design Score Card
    │   │   ├── Overall Score
    │   │   ├── Strengths List
    │   │   └── Areas to Improve List
    │   └── Suggestions List
    │       └── Suggestion Card
    │           ├── Priority Badge
    │           ├── Type Label
    │           ├── Description
    │           ├── Expected Impact
    │           └── Apply Button
    │
    └── BeforeAfterComparison (conditional)
        ├── Toggle Button (fixed position)
        └── Modal (when open)
            ├── Close Button
            ├── Two-Column Comparison
            │   ├── Before State (red)
            │   │   ├── Colors
            │   │   ├── Fonts
            │   │   ├── Content
            │   │   └── Section Order
            │   └── After State (green)
            │       ├── Colors
            │       ├── Fonts
            │       ├── Content
            │       └── Section Order
            ├── Change Summary
            └── Restore Button
```

---

## 🔌 Props Flow

### Main Component → Mode Components

```typescript
// VisualAIBuilder.tsx passes to mode components:

NaturalCommandMode({
  command: string,              // ← Local state
  setCommand: function,         // ← Local state setter
  isProcessing: boolean,        // ← Local state
  isListening: boolean,         // ← From useVoiceCommand
  voiceSupported: boolean,      // ← From useVoiceCommand
  result: any,                  // ← Local state
  commandHistory: array,        // ← From useCommandHistory
  favoriteCommands: array,      // ← From useCommandHistory
  onProcess: function,          // ← Local function
  onVoiceStart: function,       // ← From useVoiceCommand
  onRerunCommand: function,     // ← Local function
  onToggleFavorite: function,   // ← From useCommandHistory
})

ScreenshotMode({
  screenshotPreview: string,    // ← Local state
  isProcessing: boolean,        // ← Local state
  result: any,                  // ← Local state
  onFileUpload: function,       // ← Local function
  onRemoveScreenshot: function, // ← Local function
  onAnalyze: function,          // ← Local function (API call)
  onApply: function,            // ← Local function
  onCancel: function,           // ← Local function
})

StyleTransferMode({
  styleReferenceScreenshot: string,  // ← Local state
  transferOptions: object,           // ← Local state
  isProcessing: boolean,             // ← Local state
  result: any,                       // ← Local state
  onScreenshotUpload: function,      // ← Local function
  onRemoveScreenshot: function,      // ← Local function
  onTransferOptionsChange: function, // ← Local function
  onTransfer: function,              // ← Local function (API call)
})

SmartSuggestionsMode({
  isProcessing: boolean,        // ← Local state
  suggestions: array,           // ← Local state
  result: any,                  // ← Local state
  onGenerate: function,         // ← Local function (API call)
  onApplySuggestion: function,  // ← Local function
})

BeforeAfterComparison({
  isOpen: boolean,              // ← Local state
  beforeSnapshot: object,       // ← From useSnapshot
  currentColors: ColorScheme,   // ← From parent props
  currentFonts: FontScheme,     // ← From parent props
  currentData: TemplateData,    // ← From parent props
  currentSectionOrder: array,   // ← Derived from props
  onClose: function,            // ← Local function
  onRestore: function,          // ← Local function (uses snapshot)
})
```

### Parent Editor → Main Component

```typescript
// editor.tsx passes to VisualAIBuilder:

VisualAIBuilder({
  currentData: TemplateData,    // ← Editor state
  currentColors: ColorScheme,   // ← Editor state
  currentFonts: FontScheme,     // ← Editor state
  currentSectionOrder: array,   // ← Editor state
  onApplyChanges: function,     // ← Editor function
    // Called with: { colors?, fonts?, data?, sectionOrder? }
})
```

---

## 🎯 State Management Strategy

### Local State (in VisualAIBuilder.tsx)
```typescript
// UI State
mode: 'screenshot' | 'style-transfer' | 'natural-command' | 'suggestions'
isProcessing: boolean
error: string | null
result: any
showComparison: boolean

// Mode-Specific State
command: string
screenshotFile: File | null
screenshotPreview: string | null
styleReferenceScreenshot: string | null
transferOptions: { colors, fonts, layout, spacing }
suggestions: any[]
```

### Hook State (managed by custom hooks)
```typescript
// useVoiceCommand
isListening: boolean
voiceSupported: boolean
transcript: string (internal)

// useCommandHistory
commandHistory: CommandHistoryItem[]
favoriteCommands: string[]

// useSnapshot
beforeSnapshot: BeforeSnapshot | null
```

### Prop State (from parent editor)
```typescript
// Passed down from editor.tsx
currentData: TemplateData
currentColors: ColorScheme
currentFonts: FontScheme
currentSectionOrder: string[]
```

---

## 🔀 Decision Flow

### Mode Selection

```
User clicks mode button
    ↓
VisualAIBuilder.setMode(newMode)
    ↓
React re-renders active mode component
    ↓
Conditional render:
    if (mode === 'natural-command') → <NaturalCommandMode />
    if (mode === 'screenshot') → <ScreenshotMode />
    if (mode === 'style-transfer') → <StyleTransferMode />
    if (mode === 'suggestions') → <SmartSuggestionsMode />
```

### Natural Command Processing

```
User types command → State updates
    ↓
User clicks "Process" → onProcess() called
    ↓
processCommand() runs
    ↓
Capture snapshot? → Yes → useSnapshot.captureSnapshot()
    ↓
Call API: POST /api/ai/visual-builder { type: 'natural-command', ... }
    ↓
API routes to natural-command.ts helper
    ↓
Helper gets prompt from prompts.ts
    ↓
Helper calls OpenAI GPT-3.5-turbo
    ↓
Parse response JSON
    ↓
Return changes object
    ↓
Apply changes → applyNaturalCommandChanges()
    ↓
Transform to editor format
    ↓
Call onApplyChanges() → Parent editor updates
    ↓
Add to history → useCommandHistory.addToHistory()
```

### Screenshot Analysis

```
User uploads file → File reader converts to base64
    ↓
Preview displays → State updated
    ↓
User clicks "Analyze" → onAnalyze() called
    ↓
processScreenshot() runs
    ↓
Call API: POST /api/ai/visual-builder { type: 'analyze-screenshot', imageBase64, ... }
    ↓
API routes to screenshot-analyzer.ts helper
    ↓
Helper uses analyzeScreenshotCore()
    ↓
Call OpenAI GPT-4o-mini with vision (~$0.01)
    ↓
Parse response for colors, fonts, layout
    ↓
Return analysis object
    ↓
Display result in UI
    ↓
User clicks "Apply" → applyScreenshotDesign() runs
    ↓
Capture snapshot first → useSnapshot.captureSnapshot()
    ↓
Call onApplyChanges() → Parent editor updates
```

---

## 📡 API Request/Response Format

### Natural Command
**Request:**
```json
{
  "type": "natural-command",
  "command": "Make it blue",
  "currentData": { ... },
  "currentColors": { ... },
  "currentFonts": { ... },
  "currentSectionOrder": ["hero", "about", "contact"]
}
```

**Response:**
```json
{
  "changes": {
    "colors": {
      "primary": "#0000FF",
      "secondary": "#1E90FF"
    },
    "explanation": "Changed primary color to blue",
    "suggestions": ["Consider adjusting text contrast"]
  }
}
```

### Screenshot Analysis
**Request:**
```json
{
  "type": "analyze-screenshot",
  "imageBase64": "data:image/png;base64,iVBORw0KGgo...",
  "currentTemplate": { ... }
}
```

**Response:**
```json
{
  "analysis": {
    "adaptationStrategy": "compatible",
    "colorPalette": {
      "primary": "#FF5733",
      "secondary": "#33FF57",
      "accent": "#3357FF",
      "background": "#FFFFFF"
    },
    "typography": {
      "headingFont": "Montserrat",
      "bodyFont": "Open Sans"
    },
    "mood": ["Modern", "Professional"],
    "industry": ["Tech", "Creative"]
  }
}
```

### Style Transfer
**Request:**
```json
{
  "type": "style-transfer",
  "imageBase64": "data:image/png;base64,iVBORw0KGgo...",
  "currentData": { ... },
  "currentTemplate": { ... },
  "transferOptions": {
    "colors": true,
    "fonts": true,
    "layout": false,
    "spacing": true
  }
}
```

**Response:**
```json
{
  "updatedDesign": {
    "colorScheme": { ... },
    "fonts": { ... },
    "layoutChanges": { ... },
    "explanation": "Transferred colors and fonts from reference",
    "recommendations": ["Consider testing on mobile devices"]
  }
}
```

### Smart Suggestions
**Request:**
```json
{
  "type": "smart-suggestions",
  "currentData": { ... },
  "analytics": { ... }
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "id": "sugg-1",
      "type": "color",
      "priority": "high",
      "title": "Improve text contrast",
      "description": "Current contrast ratio is 3.2:1, below WCAG AA",
      "expectedImpact": "+15% readability score",
      "action": {
        "type": "apply-color",
        "params": { "text": "#000000" }
      }
    }
  ],
  "overallScore": 82,
  "strengths": ["Good font hierarchy", "Clear CTA"],
  "areasToImprove": ["Color contrast", "Mobile spacing"]
}
```

---

## 🧮 Complexity Comparison

### Before Refactoring (Monolithic)

```
visual-builder.ts (605 lines)
├── All prompts inline (200+ lines)
├── Screenshot analysis (150+ lines)
├── Style transfer (150+ lines)
├── Natural command (100+ lines)
└── Smart suggestions (100+ lines)

Complexity: O(n) where n = 605
Finding code: Search entire file
Testing: Must mock entire API
```

### After Refactoring (Modular)

```
visual-builder.ts (67 lines) → Router only
├── prompts.ts (326 lines) → Prompts
├── screenshot-analyzer.ts (130 lines) → Analysis
├── style-transfer.ts (145 lines) → Transfer
├── natural-command.ts (112 lines) → Commands
└── smart-suggestions.ts (115 lines) → Suggestions

Complexity: O(n/6) where n = 67 avg per file
Finding code: Go directly to file
Testing: Test individual modules
```

---

## 🎓 Architectural Patterns Used

### 1. **Separation of Concerns**
- API Layer: Business logic
- Hooks Layer: Stateful logic
- Component Layer: UI presentation

### 2. **Single Responsibility Principle**
- Each file has ONE job
- Easy to understand and modify

### 3. **Composition Over Inheritance**
- Build complex UI from simple components
- Mode components composed together

### 4. **Dependency Injection**
- Components receive dependencies via props
- Easy to test with different props

### 5. **Custom Hooks Pattern**
- Extract reusable stateful logic
- Share across components

### 6. **Strategy Pattern**
- Different modes = different strategies
- Switch strategy without changing structure

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Complete and Production Ready
