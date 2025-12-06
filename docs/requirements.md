# Requirements & Data Model

## Project Overview
A "Mobile First" Next.js web application to manage a wine cellar. The app must offer a premium user experience and "best in class" code quality.

## Data Model
Based on `Cave Little - Cave détaillée.csv`, the data entity is a specific wine bottle (or batch of bottles).

### Core Entities

#### 1. Wine Item
Represents a specific wine reference in the cellar.
- **Domaine** (Producer): String
- **Millésime** (Vintage): Year (Number)
- **Appellation**: String
- **Désignation** (Cuvée name): String
- **Cru** (Classification): String (e.g., Grand Cru)
- **Type**: Enum (Rouge, Blanc, Blanc moelleux, Blanc effervescent, Rosé...)
- **Région**: String (Alsace, Bordeaux, etc.)
- **Cépage principal** (Grape varieties): String (List)
- **Apogée** (Drinking Window):
    - Start Year
    - End Year
- **General Rating**: String/Number (Original "Note" column - e.g., 3/5, often external rating)

#### 2. Inventory & Purchase
Details about the acquisition and stock.
- **Prix achat** (Purchase Price): Currency
- **Lieu Achat** (Place): String (Shop, Gift, etc.)
- **Date Achat**: Date
- **Nombre** (Quantity): Integer
- **CA Connu** (Current Value/Estimate): Currency

#### 3. Tasting Notes (Event)
History of tastings associated with this wine.
*Observation: The CSV maps lists of dates, notes, and comments to a single row. The app should model this as a related list.*
- **Date**: Date of tasting
- **Ma Note**: User rating (e.g. 0-5)
- **Commentaire**: Text description

## Functional Requirements

### 1. Authentication & User Management (Better Auth)
- **Sign Up / Login**: Support for Email/Password and Social Providers (Google, etc.).
- **Profile Management**: Update name, avatar.
- **Preferences**: Default currency (EUR/USD), preferred wine regions.

### 2. Cellar Management (The Core)
- **Add Wine**:
    - "Smart" input form with autocomplete for Regions and Appellations.
    - Fields: Producer, Name (Cuvée), Vintage, Type (Red, White, etc.), Region, Grape Varieties, Alcohol %, Price, Purchase Location, Purchase Date.
    - **Quantity & Format**: Manage mostly 75cl, but handle Magnums/Half-bottles.
- **Edit Wine**: Modify any details of existing stock.
- **Drink / Remove**:
    - "Drink One": Decrement stock, prompt for a tasting note immediately.
    - "Delete": Remove erroneous entry.
- **Inventory List**:
    - Virtualized list for performance.
    - Grouping options: By Region, by Vintage, by Producer.

### 3. Search & Discovery
- **Global Search**: Instant search by wine name, producer, or region.
- **Advanced Filters**:
    - *Drink Window*: "Peak Maturity", "Keep", "Past Peak".
    - *Type*: Red, White, Rosé, Sparkling, Sweet.
    - *Region/Country*.
    - *Price Range*.

### 4. Tasting Journal
- **Log a Tasting**: Rate (1-5 stars or 100 points), Date, "Occasion" (optional), visual tags (Fruity, Oaky, Dry...), and textual notes.
- **History**: View all past tastings for a specific wine card.

### 5. Dashboard & Analytics
- **KPIs**: Total Bottles, Estimated Value, Wines at Peak.
- **Visualizations**: Distribution by Color, by Region (Pie chart).
- **Suggestions**: "Wines to drink this year".

### Technical Constraints
- Next.js (React)
- Premium/Polished UI (Animations, Glassmorphism, etc.)
- Strict TypeScript Strictness
