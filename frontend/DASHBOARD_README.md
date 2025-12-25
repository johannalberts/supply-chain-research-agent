# Supply Chain Intelligence Dashboard

A modern, real-time dashboard for monitoring supply chain risks and fragility across industries.

## Features

### 🎯 Core Functionality
- **Real-time Monitoring**: Live updates for pending and processing research tasks
- **Report Management**: List, filter, and view completed supply chain research reports
- **New Research Requests**: Submit new research requests for any industry
- **Detailed Analytics**: View fragility scores, risk metrics, and critical alerts

### 📊 Dashboard Components

#### 1. Reports List
- Filter by status (Completed, Processing, Pending, Failed, Cancelled)
- Auto-refresh for active tasks (polls every 5 seconds)
- Progress indicators for running tasks
- Error messages for failed tasks

#### 2. Report Detail View
- **Fragility Score**: 0-10 scale with color-coded severity
- **Executive Summary**: High-level analysis of supply chain risks
- **Critical Alerts**: Prioritized warnings requiring immediate attention
- **Risk Metrics**: Categorized risks (Logistics, Labor, Geopolitical) with impact scores

#### 3. New Research Modal
- Select from predefined industries or enter custom industry
- Real-time submission with progress feedback
- Estimated completion time: 2-5 minutes

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **API Communication**: REST API with automatic retry logic

## API Integration

The dashboard connects to the Django backend via these endpoints:

- `POST /api/research/requests/` - Submit new research
- `GET /api/research/requests/{task_id}/status` - Get task status
- `GET /api/research/requests/{task_id}/report` - Get completed report
- `GET /api/research/requests/` - List all tasks (with filters)
- `DELETE /api/research/requests/{task_id}/` - Cancel task

## File Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Home page (redirects to dashboard)
│   └── globals.css            # Global styles
├── components/
│   ├── ReportsList.tsx        # Task list with filtering
│   ├── ReportDetail.tsx       # Individual report view
│   └── NewResearchModal.tsx   # Research submission modal
├── lib/
│   ├── api.ts                 # API client utilities
│   └── types.ts               # TypeScript type definitions
└── next.config.ts             # Next.js configuration with API proxy
```

## Development

### Running Locally (Docker)
```bash
# From project root
docker compose up frontend
```

The dashboard will be available at `http://localhost:3000` and automatically redirects to `/dashboard`.

### Running Standalone (Development)
```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in your environment or `.env.local` file.

## Design Features

### 🎨 Visual Design
- **Modern Gradient Header**: Blue gradient with white text for report details
- **Color-Coded Risk Levels**: 
  - Critical (8-10): Red
  - High (6-7): Orange
  - Moderate (4-5): Yellow
  - Low (0-3): Green
- **Category Badges**: Color-coded badges for risk categories
- **Responsive Layout**: Grid layout that adapts to screen size
- **Dark Mode Support**: Full dark mode styling throughout

### ⚡ UX Features
- **Auto-refresh**: Polls for updates when tasks are processing
- **Loading States**: Skeleton loaders and spinners for async operations
- **Error Handling**: User-friendly error messages with retry options
- **Empty States**: Helpful messages when no data is available
- **Selection Highlight**: Selected reports highlighted in blue
- **Accessibility**: Semantic HTML and ARIA labels

## Usage Guide

### Viewing Existing Reports
1. Navigate to the dashboard (automatic on page load)
2. Reports list shows all completed research tasks
3. Click any completed report to view details
4. Use the status filter to show specific task states

### Submitting New Research
1. Click "+ New Research" button in header
2. Select an industry from the dropdown (or choose "Custom")
3. If custom, enter the industry name
4. Click "Start Research"
5. Task appears in the list with "PENDING" status
6. Monitor progress as it moves to "PROCESSING" (with % indicator)
7. When "COMPLETED", click to view the full report

### Understanding Reports
- **Fragility Score**: Higher = more fragile supply chain
- **Critical Alerts**: Most urgent issues listed first
- **Risk Metrics**: Detailed breakdown by category with impact scores
- **Executive Summary**: Overview suitable for C-suite presentation

## API Error Handling

The dashboard handles various error scenarios:
- **Network errors**: Retry logic with user notification
- **404 errors**: Report not found or task doesn't exist
- **400 errors**: Task not completed yet (shown as info, not error)
- **500 errors**: Backend errors with detailed messages

## Future Enhancements

Potential additions for future versions:
- Export reports to PDF
- Email notifications for completed research
- Historical trend analysis
- Comparison view for multiple industries
- Custom alert thresholds
- Integration with external data sources
- Real-time WebSocket updates instead of polling
