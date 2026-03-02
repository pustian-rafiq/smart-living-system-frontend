# Smart Living Ecosystem - Frontend Project Structure

```
frontend/
├── components/              # React components
│   ├── layout/             # Layout components
│   │   ├── Header.tsx      # Top header with theme toggle
│   │   ├── Footer.tsx      # Footer component
│   │   ├── Navbar.tsx      # Navigation bar with role-based links
│   │   └── Layout.tsx      # Main layout wrapper
│   └── theme/              # Theme-related components
│       └── ThemeProvider.tsx  # Theme context provider
│
├── pages/                  # Next.js pages (Pages Router)
│   ├── _app.tsx           # App wrapper with ThemeProvider
│   ├── index.tsx          # Home page
│   ├── about.tsx          # About page
│   ├── contact.tsx        # Contact page
│   ├── properties.tsx     # Properties listing page
│   └── api/               # API routes
│       └── example.ts     # Example API endpoint
│
├── styles/                 # Global styles
│   └── globals.css        # Tailwind imports & global styles
│
├── utils/                  # Utility functions
│   ├── api.ts             # REST API client utilities
│   └── theme.ts           # Theme management utilities
│
├── types/                  # TypeScript type definitions
│   └── index.ts           # Shared types and interfaces
│
├── public/                 # Static assets
│   └── favicon.ico        # Site favicon
│
├── .eslintrc.json         # ESLint configuration
├── .eslintignore          # ESLint ignore patterns
├── .prettierrc            # Prettier configuration
├── .prettierignore        # Prettier ignore patterns
├── .gitignore             # Git ignore patterns
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Key Features

### Mobile-First Design
- Tailwind CSS configured with mobile-first breakpoints
- Responsive components that work on all screen sizes
- Touch-friendly UI elements

### Theme System
- Light & Dark mode support
- Theme persistence in localStorage
- System preference detection
- Smooth theme transitions

### Role-Based Navigation
- Dynamic navigation based on user role (Renter, Owner, Admin)
- Role-specific routes and links
- Mobile-responsive hamburger menu

### API Integration Ready
- REST API client utilities in `utils/api.ts`
- Environment variable support for API base URL
- Error handling and type-safe API calls
- Example API route in `pages/api/`

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Next.js 14 with Pages Router

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API base URL
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Component Usage

### Using the Layout
```tsx
import { Layout } from '@/components/layout/Layout'

export default function MyPage() {
  return (
    <Layout userRole="renter">
      <h1>My Page Content</h1>
    </Layout>
  )
}
```

### Using the Theme
```tsx
import { useTheme } from '@/components/theme/ThemeProvider'

export default function MyComponent() {
  const { theme, toggle } = useTheme()
  
  return (
    <button onClick={toggle}>
      Current theme: {theme}
    </button>
  )
}
```

### Using the API Client
```tsx
import { api } from '@/utils/api'

// GET request
const data = await api.get<MyType>('/endpoint')

// POST request
const result = await api.post<MyType>('/endpoint', { key: 'value' })
```
