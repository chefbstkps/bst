# BST Management

Een moderne web applicatie voor het beheren van radiocommunicatie apparatuur en accessoires voor BST (Brandweer, Politie, Ambulance).

## Features

- **Dashboard**: Overzicht van alle statistieken en recente activiteiten
- **Radio's**: Beheer van alle radiocommunicatie apparatuur met CRUD functionaliteit
- **Radio Details**: Gedetailleerde weergave met geschiedenis van wijzigingen
- **Accessoires**: Beheer van alle accessoires en toebehoren
- **Afgifte**: Registratie van afgifte van apparatuur aan afdelingen
- **Installatie**: Registratie van installaties in voertuigen
- **Dark Mode**: Volledige dark mode interface
- **Nederlandse Taal**: Volledig in het Nederlands
- **PWA Support**: Installeerbaar als Progressive Web App

## Technische Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules met Dark Theme
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Project Structuur

```
src/
├── components/          # Herbruikbare componenten
├── config/             # Configuratie bestanden
├── contexts/           # React Context providers
├── hooks/              # Custom hooks
├── lib/                # Service clients (Supabase)
├── pages/              # Route pagina's
├── services/           # Business logic services
├── types/              # TypeScript type definities
└── utils/              # Utility functies
```

## Setup & Installatie

### 1. Dependencies installeren

```bash
npm install
```

### 2. Supabase configureren

1. Maak een Supabase project aan op [supabase.com](https://supabase.com)
2. Voer het database schema uit uit `supabase-schema.sql`
3. Maak een `.env.local` bestand aan:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Development server starten

```bash
npm run dev
```

De app is nu beschikbaar op `http://localhost:3000`

### 4. Production build

```bash
npm run build
```

## Database Schema

De applicatie gebruikt de volgende tabellen:

- **radios**: Radiocommunicatie apparatuur
- **accessories**: Accessoires en toebehoren
- **radio_history**: Geschiedenis van wijzigingen aan radio's
- **issues**: Afgifte registraties
- **installations**: Installatie registraties

## Features in Detail

### Radio Management
- Volledige CRUD operaties
- Type filtering (Portable, Mobile, Base)
- Zoekfunctionaliteit
- Statistieken overzicht
- Clickable rijen voor details

### Radio Details
- Alle radio informatie
- Geschiedenis van wijzigingen
- Snelle acties (batterij vervangen, service)
- Timestamp tracking

### Accessoires
- Beheer van accessoires
- Optioneel serienummer
- Zoekfunctionaliteit

### Afgifte & Installatie
- Registratie van afgifte aan afdelingen
- Installatie registratie in voertuigen
- Koppeling met radio's en accessoires

## Deployment

### Vercel Deployment

1. Push code naar GitHub
2. Verbind repository met Vercel
3. Configureer environment variables
4. Deploy automatisch

De `vercel.json` configuratie zorgt voor correcte SPA routing.

## Development

### Code Style
- TypeScript strict mode
- ESLint voor code kwaliteit
- BEM-like CSS naming
- Component-scoped styling

### Best Practices
- Service layer voor business logic
- React Query voor data fetching
- Context voor globale state
- Error boundaries voor error handling

## Licentie

Dit project is ontwikkeld voor BST gebruik. Alle rechten voorbehouden.

## Support

Voor vragen of problemen, neem contact op met het development team.