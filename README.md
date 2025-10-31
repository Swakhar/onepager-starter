# OnePager Starter (Next.js + Tailwind + Supabase)

This is a starter scaffold that includes:
- Next.js + TypeScript
- Tailwind CSS
- Supabase client integration (placeholder)
- Simple template component + editor form
- A placeholder spot to integrate Puck (visual editor) later

## Quickstart
1. Install dependencies:
   ```
   npm install
   ```
2. Create a Supabase project and get `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Create a `.env.local` in the project root with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run dev server:
   ```
   npm run dev
   ```

## Files of interest
- `pages/index.tsx` – landing + preview
- `pages/editor.tsx` – editor workspace (EditorPanel + VisualEditor placeholder)
- `components/TemplateA.tsx` – example template component
- `components/EditorPanel.tsx` – form-based editor (react-hook-form)
- `lib/supabaseClient.ts` – supabase client wrapper (falls back to localStorage)

## Puck integration
This scaffold includes a `components/VisualEditorWrapper.tsx` file that is a placeholder where you can integrate Puck or other React visual editors. See comments in the file.
