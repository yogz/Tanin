# Technical Architecture & Stack

## Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | **Next.js 16 (App Router)** | Best-in-class React framework. Server Components for performance, nice routing. |
| **Language** | **TypeScript** | Type safety is non-negotiable for high-quality apps. |
| **Styling** | **Tailwind CSS + shadcn/ui** | Rapid development with "Premium" accessible components. Custom theming via CSS variables. |
| **Animation** | **Framer Motion** | Industry standard for React animations (layout transitions, swipe gestures, micro-interactions) essential for "Premium" feel. |
| **Icons** | **Lucide React** | Clean, consistent SVG icons. |
| **State** | **React Context + Hooks** | Sufficient for V1. Easy to maintain. |
| **Database** | **Neon PostgreSQL** | Serverless Postgres, perfect for scaling and branching. |
| **ORM** | **Drizzle** | Lightweight, type-safe, and highly performant TypeScript ORM. |
| **Auth** | **Better Auth** | Modern, secure authentication solution. |

## Component Recommendations ("Best in Class")

To achieve "best in class" code, we recommend a **Composition-based** component architecture (Compound Components Pattern) and strict separation of concerns.

### 1. UI Architecture: Atomic Design (Modified)
- **atoms/**: Base accessible primitives (Button, Input, Badge, Typography).
    - *Recommendation*: Use **shadcn/ui** (built on Radix UI) as the foundation. Customize tokens to achieve the "Premium" look.
- **molecules/**: Specific UI blocks (WineCard, TastingRow, RatingStars).
- **organisms/**: Complex sections (WineList, cellarStats).
- **templates/**: Page layouts.

### 2. File Structure (Feature-based)
```
app/
  (routes)/
    dashboard/
    cellar/
      [id]/
components/
  ui/ (The "System")
    card/
    button/
  features/
    wine/
      WineCard.tsx
      WineList.tsx
lib/
  db/ (Drizzle)
  utils/
```

### 3. Key Component Patterns
- **Server Components (RSC)**: Fetch data on the server (Wine lists, details). Pass data to client leaves.
- **Client Components**: Handle interactivity (Swipes, Forms, Animations).
- **Optimistic UI**: When "drinking" a bottle, update UI immediately while validating backend.

## Design System "Premium" Guidelines
- **Typography**: clean sans-serif (e.g., *Inter* or *Outfit*).
- **Spacing**: 4px grid.
- **Glassmorphism**: Subtle backdrops filters for overlays/modals to give depth.
- **Micro-interactions**: 
    - Buttons scale down slightly on press.
    - Lists stagger-animate in.
    - Status badges (Red/White wine) use vibrant, semantic colors.
