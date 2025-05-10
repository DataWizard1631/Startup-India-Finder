# Startup India Finder

A one-stop dashboard to help Indian founders discover and track government funding schemes, state policies, and nationwide hackathons without hopping between sites.

## Features

- **Dashboard**: View featured schemes and upcoming hackathons
- **Schemes**: Browse and filter government funding schemes
- **Hackathons**: View hackathons in list or calendar view
- **Profile**: Set interests, notification preferences, and track reminders
- **PWA Support**: Works offline with cached data

## Tech Stack

- Next.js 13 (App Router)
- JavaScript
- Tailwind CSS
- Lucide-react icons
- next-pwa for offline support
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/startup-india-finder.git
cd startup-india-finder
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
startup-india-finder/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── hackathons/       # Hackathons page
│   ├── profile/          # Profile page
│   ├── schemes/          # Schemes page
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   ├── manifest.js       # PWA manifest
│   └── page.js           # Dashboard page
├── components/           # React components
│   ├── BottomNav.js      # Bottom navigation
│   ├── CalendarView.js   # Calendar view for hackathons
│   ├── FilterBar.js      # Filter component
│   ├── HackathonCard.js  # Hackathon card component
│   ├── SchemeCard.js     # Scheme card component
│   ├── SearchBar.js      # Search component
│   └── ui/               # shadcn/ui components
├── context/              # React context
│   └── SearchContext.js  # Search context
├── hooks/                # Custom hooks
│   ├── useFilters.js     # Hook for filter state
│   └── useLocalStorage.js # Hook for localStorage
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
└── tailwind.config.js    # Tailwind CSS configuration
\`\`\`

## PWA Setup

The application is configured as a Progressive Web App (PWA) with the following features:

- Offline support
- Installable on mobile devices
- Caching of API data and assets

## API Routes

The application includes mock API routes:

- `/api/schemes`: Returns a list of government funding schemes
- `/api/hackathons`: Returns a list of hackathons

## License

This project is licensed under the MIT License.
