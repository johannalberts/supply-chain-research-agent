# Supply Chain Risk Research Platform - Async Architecture

This project has been upgraded to use an asynchronous task processing architecture with Django Celery, replacing the previous synchronous request handling.

## 🏗️ Architecture Overview

### New Architecture Components
- **Django API**: Handles HTTP requests and returns task IDs
- **Celery Workers**: Execute research tasks in background
- **Redis**: Message broker and result backend
- **PostgreSQL**: Data persistence
- **Celery Beat**: Scheduler for automated research tasks

### Task Processing Flow
```
User Request → API → Task Queue → Celery Worker → Research Agent → Database
     ↓
Immediate Response with Task ID → Frontend Polls Status → Show Progress
```

## 🚀 Getting Started

### 1. Environment Setup

Ensure your `.env` file contains:
```bash
GOOGLE_API_KEY=your_google_api_key
TAVILY_API_KEY=your_tavily_api_key
DATABASE_URL=postgresql://user:password@db:5432/dbname
REDIS_URL=redis://redis:6379/0
POSTGRES_DB=supply_chain_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

### 2. Run the Application

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

This starts:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Celery Worker**: Background task processing
- **Celery Beat**: Task scheduler
- **Redis**: Message broker
- **PostgreSQL**: Database

## 🎨 Frontend Features

The dashboard features a futuristic teal-based UI with comprehensive accessibility support:

### Design Highlights
- **Numerical Gauges**: Animated 10-segment progress bars for risk visualization (0-10 scale)
- **WCAG AAA Compliant**: Text contrast ratios exceed 7:1 for optimal readability
- **ARIA Support**: Full screen reader accessibility with descriptive labels
- **Real-time Updates**: Live task progress tracking with status polling
- **Background Patterns**: 5 customizable overlay patterns (grid, hexagon, circuit, dots)
- **Custom Scrollbars**: Styled with teal/purple gradient for visual consistency

### Risk Score Interpretation
- **LOW (0-3.9)**: Minimal risk - Teal indicators
- **MEDIUM (4-6.9)**: Moderate concern - Amber indicators
- **HIGH (7-10)**: Critical risk - Red indicators with faster pulse animation

### Components
- **NumericalGauge**: Segmented progress bars with adaptive pulse speeds
- **ReportsSidebar**: Collapsible mission logs with status filtering
- **ReportDetail**: Comprehensive risk analysis visualization
- **BackgroundPatternSelector**: Runtime theme customization

See [frontend/README.md](frontend/README.md) for detailed UI documentation.

### 3. Database Setup

```bash
# Run migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
docker-compose exec backend python manage.py createsuperuser
```

### 4. Setup Scheduled Tasks

```bash
# Setup daily scheduled research tasks
docker-compose exec backend python manage.py setup_scheduled_tasks
```

## 📡 API Endpoints

### New Async Endpoints

#### Submit Research Request
```http
POST /api/research/requests/
Content-Type: application/json

{
    "industry": "Automotive"
}
```

**Response:**
```json
{
    "task_id": "550e8400-e29b-41d4-a716-446655440000",
    "task_type": "MANUAL",
    "industry": "Automotive",
    "status": "PENDING",
    "progress": 0,
    "created_at": "2025-12-22T20:16:34.636Z"
}
```

#### Check Task Status
```http
GET /api/research/requests/{task_id}/status
```

**Response:**
```json
{
    "task_id": "550e8400-e29b-41d4-a716-446655440000",
    "task_type": "MANUAL",
    "industry": "Automotive",
    "status": "PROCESSING",
    "progress": 50,
    "created_at": "2025-12-22T20:16:34.636Z",
    "started_at": "2025-12-22T20:16:35.123Z",
    "duration": 15.5
}
```

#### Get Completed Report
```http
GET /api/research/requests/{task_id}/report
```

**Response:**
```json
{
    "id": 123,
    "industry": "Automotive",
    "fragility_score": 7,
    "executive_summary": "High risk due to semiconductor shortages...",
    "critical_alerts": ["CRITICAL: Immediate action recommended"],
    "risk_metrics": [
        {
            "category": "Logistics",
            "impact_score": 8,
            "description": "Port congestion affecting..."
        }
    ],
    "created_at": "2025-12-22T20:17:30.123Z",
    "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### List Tasks
```http
GET /api/research/requests/?status=PROCESSING&limit=10
```

#### Cancel Task
```http
DELETE /api/research/requests/{task_id}/
Content-Type: application/json

{
    "reason": "User requested cancellation"
}
```

#### Trigger Scheduled Research
```http
POST /api/research/scheduled/run/
```

### Legacy Endpoints (Deprecated)

The old synchronous endpoints still exist but return 410 Gone errors:
- `POST /api/run-research` → Use `/api/research/requests/` instead
- `GET /api/reports` → Use `/api/research/requests/` instead
- `GET /api/reports/{id}` → Use `/api/research/requests/{task_id}/report` instead

## ⏰ Scheduled Tasks

### Automated Research
The system automatically runs daily research for key industries:
- Automotive
- Technology
- Healthcare
- Manufacturing
- Energy
- Pharmaceuticals
- Semiconductors

**Schedule**: Daily at 9:00 AM UTC

**Logic**: Creates research tasks only for industries that don't have reports from the last 7 days.

### Manual Scheduled Task Trigger
```bash
# Trigger scheduled research manually
docker-compose exec backend python manage.py setup_scheduled_tasks

# Or via API
curl -X POST http://localhost:8000/api/research/scheduled/run/
```

## 🔄 Frontend Integration

### Polling Pattern
1. Submit request → Get task ID
2. Poll status every 5-10 seconds
3. Show progress updates
4. Display report when completed

### Example JavaScript Integration
```javascript
async function submitResearch(industry) {
    // Step 1: Submit request
    const response = await fetch('/api/research/requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry })
    });
    
    const { task_id } = await response.json();
    
    // Step 2: Poll for status
    const pollStatus = async () => {
        const statusResponse = await fetch(`/api/research/requests/${task_id}/status`);
        const status = await statusResponse.json();
        
        updateUI(status);
        
        if (status.status === 'COMPLETED') {
            // Step 3: Get report
            const reportResponse = await fetch(`/api/research/requests/${task_id}/report`);
            const report = await reportResponse.json();
            displayReport(report);
        } else if (status.status === 'FAILED') {
            showError(status.error_message);
        } else {
            // Continue polling
            setTimeout(pollStatus, 5000);
        }
    };
    
    pollStatus();
}
```

## 🛠️ Development

### Running Individual Services
```bash
# Django development server
docker-compose up backend

# Celery worker only
docker-compose up celery-worker

# Celery beat scheduler only
docker-compose up celery-beat

# Redis only
docker-compose up redis
```

### Monitoring Tasks
```bash
# View Celery worker logs
docker-compose logs celery-worker

# View Celery beat logs
docker-compose logs celery-beat

# Monitor task queue
docker-compose exec redis redis-cli monitor
```

### Database Management
```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Access PostgreSQL
docker-compose exec db psql -U postgres -d supply_chain_db

# View task status records
docker-compose exec backend python manage.py shell -c "
from app.models import TaskStatus;
print(TaskStatus.objects.all().values())
"
```

## 📊 Task Status Types

- **PENDING**: Task created, waiting in queue
- **PROCESSING**: Currently being executed
- **COMPLETED**: Successfully finished
- **FAILED**: Encountered an error
- **CANCELLED**: Manually cancelled

## 🔧 Configuration

### Celery Settings (in `backend/backend/settings.py`)
```python
# Task processing settings
CELERY_TASK_ALWAYS_EAGER = False
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TASK_REJECT_ON_WORKER_LOST = True

# Scheduling
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
```

### Environment Variables
- `REDIS_URL`: Redis connection string
- `GOOGLE_API_KEY`: Google Generative AI API key
- `TAVILY_API_KEY`: Tavily search API key

## 🚨 Troubleshooting

### Common Issues

#### 1. Celery Beat/Worker "Module has no attribute 'celery'" Error
**Error**: `Module 'backend' has no attribute 'celery'`

**Solution**: 
```bash
# Rebuild containers to ensure proper imports
docker-compose down
docker-compose up --build

# Check celery app is properly exported
docker-compose exec backend python -c "from backend import celery; print('Celery app loaded successfully')"
```

**If still failing**, manually restart the services:
```bash
docker-compose restart celery-worker celery-beat
```

#### 2. Tasks not processing
```bash
# Check Celery worker is running
docker-compose ps

# Check Redis connection
docker-compose exec redis redis-cli ping

# Check worker logs
docker-compose logs celery-worker
```

#### 3. Import errors in tasks
- Ensure all dependencies are in requirements.txt
- Check Django app is in INSTALLED_APPS
- Verify task functions use `@shared_task` decorator

#### 4. Database connection errors
- Verify DATABASE_URL in .env
- Ensure PostgreSQL container is running
- Check database migrations: `docker-compose exec backend python manage.py migrate`

#### 5. API endpoints returning 404
- Verify router is included in main urls.py
- Check Ninja API configuration

### Logs and Debugging
```bash
# View all service logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f celery-worker
docker-compose logs -f backend

# Test Celery directly
docker-compose exec backend celery -A backend inspect active

# Check scheduled tasks
docker-compose exec backend celery -A backend beat
```

### Reset and Clean Restart
```bash
# Stop all services
docker-compose down -v

# Remove all volumes (WARNING: This deletes all data)
docker system prune -a

# Rebuild and restart
docker-compose up --build
```

## 🎯 Benefits of Async Architecture

- ✅ **Non-blocking requests**: Immediate response with task ID
- ✅ **Scalability**: Multiple workers can process tasks concurrently
- ✅ **Reliability**: Automatic retry on failure
- ✅ **Monitoring**: Real-time task status and progress tracking
- ✅ **Scheduling**: Automated research for key industries
- ✅ **User Experience**: Better feedback and progress indication
- ✅ **Error Handling**: Graceful failure recovery and reporting

## 📝 Migration Notes

- Legacy endpoints are deprecated but still return helpful error messages
- Existing reports in the database remain accessible
- Task status tracking is completely new
- Frontend integration requires updating to async polling pattern
