# shadcn/ui Integration Guide

## Overview

The project has been fully integrated with shadcn/ui components, replacing custom components with reusable, accessible, and well-designed UI components.

## Installed Components

The following shadcn/ui components have been installed and are ready to use:

- ✅ **Button** (`components/ui/button.tsx`) - Versatile button component with variants
- ✅ **Card** (`components/ui/card.tsx`) - Container component with header, content, footer
- ✅ **Input** (`components/ui/input.tsx`) - Text input component
- ✅ **Label** (`components/ui/label.tsx`) - Form label component
- ✅ **Select** (`components/ui/select.tsx`) - Dropdown select component
- ✅ **Badge** (`components/ui/badge.tsx`) - Badge/status indicator component
- ✅ **Textarea** (`components/ui/textarea.tsx`) - Multi-line text input

## Configuration

### components.json
Located at `frontend/components.json`, this file configures shadcn/ui:
- Style: `default`
- RSC: `true` (React Server Components enabled)
- CSS Variables: `true` (for theming)
- Aliases configured for easy imports

### Tailwind Configuration
Updated `tailwind.config.ts` with:
- CSS variables for theming
- shadcn/ui color system
- `tailwindcss-animate` plugin for animations

### Global Styles
Updated `styles/globals.css` with:
- CSS variables for light/dark mode
- shadcn/ui color tokens
- Base styles for components

## Usage Examples

### Button
```tsx
import { Button } from '@/components/ui/button'

// Primary button
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// As link
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Input & Label
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>
```

### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## Component Structure

```
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   └── textarea.tsx
├── layout/                # Layout components
└── theme/                 # Theme components
```

## Best Practices

1. **Always use shadcn/ui components** for new features
2. **Use Tailwind utilities** for custom styling when needed
3. **Leverage variants** instead of custom classes when possible
4. **Follow the component API** - don't override internal styles
5. **Use `cn()` utility** from `@/lib/utils` for conditional classes

## Adding New Components

To add more shadcn/ui components:

```bash
cd frontend
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

## Theming

The project uses CSS variables for theming, which automatically work with dark mode:
- `--primary` - Primary brand color
- `--background` - Page background
- `--foreground` - Text color
- `--card` - Card background
- `--border` - Border color
- `--muted` - Muted text/background

All components automatically adapt to light/dark mode via the theme system.

## Migration Status

✅ All pages updated to use shadcn/ui components:
- Login page
- OTP verification page
- Role selection page
- Dashboard page
- Contact page
- Properties page
- Home page

✅ Components replaced:
- Custom Card → shadcn/ui Card
- Custom buttons → shadcn/ui Button
- Native inputs → shadcn/ui Input
- Native selects → shadcn/ui Select
- Custom badges → shadcn/ui Badge

## Next Steps

1. Install additional shadcn/ui components as needed:
   - Dialog (for modals)
   - Dropdown Menu
   - Toast (for notifications)
   - Form (for form validation)
   - Table (for data tables)

2. Create custom components using shadcn/ui as base:
   - PropertyCard
   - SearchBar
   - FilterPanel
   - etc.

3. Continue using shadcn/ui + Tailwind for all new features
