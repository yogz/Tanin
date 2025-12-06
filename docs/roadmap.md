# Implementation Roadmap

## Phase 1: Setup & Foundation
- [ ] Initialize Next.js project with TypeScript.
- [ ] Configure ESLint / Prettier for strict code quality.
- [ ] Set up design tokens (CSS Variables for colors, spacing, fonts).
- [ ] Install dependencies: `drizzle-orm`, `postgres` (or `@neondatabase/serverless`), `better-auth`, `framer-motion`, `lucide-react`.
- [ ] Initialize shadcn/ui.

## Phase 2: Database Layer
- [ ] Design Drizzle Schema (`Wine`, `Tasting`, `Producer`, etc.).
    - *Decision*: Normalize `Producer` and `Region` or keep as strings? -> Suggest keeping strings for V1 simplicity/flexibility, or simple lookup tables if autocomplete is desired.
- [ ] Create seed script to parse and import `Cave Little - Cave détaillée.csv`.

## Phase 3: Core UI Components (The "System")
- [ ] Build adaptable `Layout` (Mobile navigation bar).
- [ ] Create `Card` component (Glassmorphism style).
- [ ] Create `Badge` (for Wine Type, Vintage).
- [ ] Create `Rating` display (Stars/Points).

## Phase 4: Feature - Cellar Browser
- [ ] Implement `WineList` with search and filters.
- [ ] Implement `WineCard` showing key info (Name, Year, Quantity).
- [ ] Optimization: Virtualized list if inventory is huge (1000+), though standard pagination covers most.

## Phase 5: Feature - Wine Details & Management
- [ ] Detail View: Rich header, history of tastings.
- [ ] "Drink" Action: Decrement stock.
- [ ] "Add Tasting" Action: Modal form to add note/rating.

## Phase 6: Polish
- [ ] Add Page Transitions.
- [ ] Add Loading Skeletons (Premium feel).
- [ ] Deployment setup (Vercel).
