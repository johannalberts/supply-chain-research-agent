# Supply Chain Risk Research Platform - Frontend

A futuristic Next.js dashboard for visualizing supply chain risk analysis with real-time task monitoring and interactive data visualization.

## 🎨 Design System

### Futuristic UI Theme
The interface features a teal-based color palette inspired by advanced command systems, designed for optimal readability and visual hierarchy.

**Key Design Elements:**
- **Typography**: Antonio (headings) and Orbitron (monospace) fonts for a technical aesthetic
- **Color Palette**: Teal primary (#14b8a6), Cyan accents (#06b6d4), with Coral (#f97316) and Purple (#a855f7) highlights
- **Components**: Rounded pill-shaped buttons, segmented progress bars, and decorative corner brackets
- **Animations**: Pulsing risk indicators, staggered segment animations, smooth transitions

### Accessibility Features
- ✅ **WCAG AAA Compliant**: Text contrast ratios exceed 7:1 for all color combinations
- ✅ **ARIA Labels**: Comprehensive screen reader support with descriptive labels
- ✅ **Semantic HTML**: Proper roles (region, progressbar) for assistive technologies
- ✅ **Keyboard Navigation**: Full keyboard support for all interactive elements
- ✅ **Visual + Text Indicators**: Risk levels conveyed through both color and text labels
- ✅ **Font Loading**: Optimized with `display=swap` to prevent blocking

## 🧩 Core Components

### NumericalGauge
Displays risk scores (0-10 scale) with animated segmented progress bars.

**Features:**
- 10-segment vertical progress bar with gradient coloring (teal → amber → red)
- Adaptive pulse animation speed based on risk level
- Staggered segment light-up effect (0.05s delay per segment)
- ARIA progressbar role with valuenow/min/max attributes
- Status badges: LOW (0-3.9), MEDIUM (4-6.9), HIGH (7-10)

**Usage:**
```tsx
<NumericalGauge 
  value={7.5} 
  label="OVERALL FRAGILITY"
  size={220}
/>
```

### ReportsSidebar
Collapsible sidebar for mission logs and task filtering.

**Features:**
- Edge-mounted toggle button with smooth slide animation
- Task grouping by date with status color indicators
- Real-time progress bars for active tasks
- Custom scrollbar styling with teal/purple gradient
- Status filtering (All, Completed, Processing, Pending, Failed)
- Responsive overlay for mobile

### BackgroundPattern
Dynamic background pattern overlay system.

**Available Patterns:**
- **None**: Solid background
- **Grid**: Technical grid lines
- **Hexagon**: Honeycomb structure
- **Circuit**: Circuit board traces
- **Dots**: Offset dot matrix

**Pattern Selector:**
Dropdown component for runtime pattern switching with localStorage persistence.

### ReportDetail
Comprehensive risk report visualization with multiple sections:
- Executive summary with icon indicators
- Risk metrics grid with category-specific gauges
- Critical alerts with numbered priority list
- Decorative LCARS-style bars and accent elements

## 🎨 CSS Variables

All colors are centralized in `globals.css` for easy theme customization:

```css
/* Primary Colors */
--primary-teal: #14b8a6;
--primary-cyan: #06b6d4;
--primary-emerald: #10b981;

/* Accent Colors */
--accent-coral: #f97316;
--accent-purple: #a855f7;

/* Status Colors */
--status-critical: #ef4444;
--status-warning: #f59e0b;
--status-normal: #14b8a6;
--status-success: #10b981;

/* Text Colors */
--text-primary: #14b8a6;    /* 7.95:1 contrast ratio */
--text-secondary: #06b6d4;  /* 8.15:1 contrast ratio */

/* Dimensions */
--sidebar-toggle-width: 40px;
--sidebar-toggle-height: 80px;
--sidebar-toggle-radius: 12px;
```

## 🚀 Getting Started

### Development Server

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Docker Deployment

The frontend runs in a containerized environment:

```bash
# From project root
docker-compose up --build

# Frontend only
docker-compose up frontend
```

## 🔌 API Integration

### Authentication Context
Provides user session management and authentication state:

```tsx
const { user, login, logout, isLoading } = useAuth();
```

### Settings Context
Manages user preferences with localStorage persistence:

```tsx
const { backgroundPattern, setBackgroundPattern } = useSettings();
```

### Task Status Polling
Real-time task monitoring with automatic status updates:

```tsx
// Polls every 5 seconds until task completes
const { taskStatus, error } = useTaskPolling(taskId);
```

## 📊 Data Visualization

### Risk Score Interpretation
- **0-3.9 (LOW)**: Minimal supply chain risk - Teal indicators
- **4-6.9 (MEDIUM)**: Moderate concern - Amber indicators  
- **7-10 (HIGH)**: Critical risk - Red indicators

### Task Status States
- **PENDING**: Queued for processing - Amber
- **PROCESSING**: Active analysis with progress % - Cyan
- **COMPLETED**: Report ready - Green
- **FAILED**: Error occurred - Red
- **CANCELLED**: User terminated - Purple

## 🎯 Features

### Interactive Dashboard
- Real-time task creation and monitoring
- Background pattern customization
- Responsive layout with collapsible sidebar
- Status filtering and sorting
- Progress tracking for active tasks

### Report Visualization
- Executive summary with key insights
- Multi-category risk metrics with individual gauges
- Critical alerts with priority ranking
- Timestamp and date metadata
- Color-coded risk indicators

### User Experience
- Smooth animations and transitions
- Custom scrollbar styling
- Hover effects and visual feedback
- Loading states and error handling
- Empty state messaging

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **UI Library**: React 19.2.1
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + CSS Variables
- **Fonts**: Google Fonts (Antonio, Orbitron)
- **State Management**: React Context API
- **API Client**: Fetch API with async/await

## 📁 Project Structure

```
frontend/
├── app/
│   ├── auth/          # Login/signup pages
│   ├── dashboard/     # Main dashboard view
│   ├── globals.css    # CSS variables and utilities
│   ├── layout.tsx     # Root layout with fonts
│   └── page.tsx       # Landing/redirect
├── components/
│   ├── BackgroundPattern.tsx          # Pattern overlay
│   ├── BackgroundPatternSelector.tsx  # Pattern dropdown
│   ├── NumericalGauge.tsx            # Risk score gauge
│   ├── ReportDetail.tsx              # Report viewer
│   └── ReportsSidebar.tsx            # Task sidebar
├── lib/
│   ├── auth-context.tsx     # Authentication provider
│   ├── settings-context.tsx # User preferences
│   └── types.ts            # TypeScript definitions
└── public/              # Static assets
```

## 🎨 Customization

### Changing the Theme
Edit CSS variables in `app/globals.css`:

```css
:root {
  --primary-teal: #your-color;
  --text-primary: #your-color;
  /* etc. */
}
```

All components automatically update to use the new colors.

### Adding Background Patterns
1. Define pattern CSS in `globals.css`
2. Add to `BackgroundPattern.tsx` inline styles
3. Update `BackgroundPatternSelector.tsx` options array

### Modifying Risk Thresholds
Update thresholds in `NumericalGauge.tsx`:

```tsx
const getColor = () => {
  if (value >= 7) return 'var(--status-critical)';  // High
  if (value >= 4) return 'var(--status-warning)';   // Medium
  return 'var(--status-normal)';                    // Low
};
```

## 📝 Component API

### NumericalGauge Props
```tsx
interface NumericalGaugeProps {
  value: number;      // 0-10 scale
  label: string;      // Display label
  size?: number;      // Pixel width (default: 180)
}
```

### ReportsSidebar Props
```tsx
interface ReportsSidebarProps {
  tasks: TaskStatus[];           // Task array
  selectedTaskId: string | null; // Active task
  onSelectTask: (id: string) => void;
  filterStatus: string;          // Filter value
  onFilterChange: (status: string) => void;
}
```

## 🧪 Testing Accessibility

```bash
# Install axe DevTools browser extension
# Run Lighthouse audit in Chrome DevTools
# Test with screen reader (NVDA/JAWS/VoiceOver)
# Verify keyboard navigation
```

## 📚 Learn More

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Web accessibility standards

## 🚢 Deployment

The frontend is containerized and deployed via Docker Compose alongside the backend services.

**Production Considerations:**
- Environment variables for API endpoints
- Image optimization and lazy loading
- Bundle size monitoring
- Error boundary implementation
- Analytics integration

See the main project [README.md](../README.md) for full deployment instructions.
