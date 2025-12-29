# app/api.py
import uuid
from typing import List
from ninja import Router, Schema
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import TaskStatus, SupplyChainReport
from .tasks import run_research_task, setup_scheduled_research

# We use a Router so this can be plugged into backend/api.py
router = Router()

# --- INPUT SCHEMAS ---
class ResearchRequest(Schema):
    industry: str

class CancelTaskRequest(Schema):
    reason: str = "User requested cancellation"

# --- OUTPUT SCHEMAS ---
class TaskStatusSchema(Schema):
    task_id: str
    task_type: str
    industry: str
    status: str
    progress: int
    created_at: str
    started_at: str | None = None
    completed_at: str | None = None
    error_message: str | None = None
    duration: float | None = None

class RiskMetricSchema(Schema):
    category: str
    impact_score: int
    description: str

class SourceSchema(Schema):
    url: str
    title: str

class ReportSchema(Schema):
    id: int
    industry: str
    fragility_score: int
    executive_summary: str
    critical_alerts: List[str]
    risk_metrics: List[RiskMetricSchema]
    sources: List[SourceSchema]
    created_at: str
    task_id: str = None

class TaskResponse(Schema):
    task: TaskStatusSchema
    report: ReportSchema = None

# --- ENDPOINTS ---

@router.post("/research/requests/", response=TaskStatusSchema)
def submit_research_request(request, data: ResearchRequest):
    """
    Submit a new research request asynchronously.
    Returns a task status that can be polled for completion.
    """
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Create task status record
    task_status = TaskStatus.objects.create(
        task_id=task_id,
        task_type='MANUAL',
        industry=data.industry,
        status='PENDING'
    )
    
    # Queue the research task
    run_research_task.delay(task_id, data.industry)
    
    return TaskStatusSchema(
        task_id=str(task_status.task_id),
        task_type=task_status.task_type,
        industry=task_status.industry,
        status=task_status.status,
        progress=task_status.progress,
        created_at=task_status.created_at.isoformat(),
        started_at=task_status.started_at.isoformat() if task_status.started_at else None,
        completed_at=task_status.completed_at.isoformat() if task_status.completed_at else None,
        error_message=task_status.error_message,
        duration=task_status.duration
    )

@router.get("/research/requests/{task_id}/status", response=TaskStatusSchema)
def get_task_status(request, task_id: str):
    """
    Get the status of a research task.
    """
    task_status = get_object_or_404(TaskStatus, task_id=task_id)
    
    return TaskStatusSchema(
        task_id=str(task_status.task_id),
        task_type=task_status.task_type,
        industry=task_status.industry,
        status=task_status.status,
        progress=task_status.progress,
        created_at=task_status.created_at.isoformat(),
        started_at=task_status.started_at.isoformat() if task_status.started_at else None,
        completed_at=task_status.completed_at.isoformat() if task_status.completed_at else None,
        error_message=task_status.error_message,
        duration=task_status.duration
    )

@router.get("/research/requests/{task_id}/report", response=ReportSchema)
def get_task_report(request, task_id: str):
    """
    Get the completed research report for a task.
    Only returns data if the task is completed successfully.
    """
    task_status = get_object_or_404(TaskStatus, task_id=task_id)
    
    if task_status.status != 'COMPLETED':
        from ninja import HttpError
        raise HttpError(400, "Task is not completed yet")
    
    if not task_status.report:
        from ninja import HttpError
        raise HttpError(404, "Report not found for this task")
    
    report = task_status.report
    
    return ReportSchema(
        id=report.id,
        industry=report.industry,
        fragility_score=report.fragility_score,
        executive_summary=report.executive_summary,
        critical_alerts=report.critical_alerts,
        risk_metrics=report.risk_metrics,
        sources=report.sources,
        created_at=report.created_at.isoformat(),
        task_id=task_id
    )

@router.get("/research/requests/", response=List[TaskStatusSchema])
def list_tasks(request, status: str = None, limit: int = 50):
    """
    List research tasks with optional status filter and limit.
    """
    queryset = TaskStatus.objects.all().order_by('-created_at')
    
    if status:
        queryset = queryset.filter(status=status)
    
    queryset = queryset[:limit]
    
    tasks = []
    for task_status in queryset:
        tasks.append(TaskStatusSchema(
            task_id=str(task_status.task_id),
            task_type=task_status.task_type,
            industry=task_status.industry,
            status=task_status.status,
            progress=task_status.progress,
            created_at=task_status.created_at.isoformat(),
            started_at=task_status.started_at.isoformat() if task_status.started_at else None,
            completed_at=task_status.completed_at.isoformat() if task_status.completed_at else None,
            error_message=task_status.error_message,
            duration=task_status.duration
        ))
    
    return tasks

@router.delete("/research/requests/{task_id}/")
def cancel_task(request, task_id: str, data: CancelTaskRequest = None):
    """
    Cancel a pending or processing task.
    """
    task_status = get_object_or_404(TaskStatus, task_id=task_id)
    
    if task_status.is_completed:
        from ninja import HttpError
        raise HttpError(400, "Cannot cancel a completed task")
    
    # Update task status to cancelled
    task_status.status = 'CANCELLED'
    task_status.completed_at = timezone.now()
    task_status.error_message = data.reason if data else "Cancelled by user"
    task_status.save()
    
    # Note: We don't revoke the Celery task here as it's more complex
    # The task will continue running but the result will be ignored
    
    return {"message": "Task cancelled successfully", "task_id": task_id}

@router.post("/research/scheduled/run/")
def trigger_scheduled_research(request):
    """
    Manually trigger the scheduled research task setup.
    This will create research tasks for industries that don't have recent reports.
    """
    result = setup_scheduled_research.delay()
    
    return {
        "message": "Scheduled research setup triggered",
        "task_id": result.id
    }

# Keep the old endpoints for backward compatibility (but mark as deprecated)
@router.post("/run-research", response=ReportSchema)
def trigger_research_legacy(request, data: ResearchRequest):
    """
    LEGACY: This endpoint is deprecated. Use /research/requests/ instead.
    This creates a task and waits for completion (not recommended for production).
    """
    from ninja import HttpError
    raise HttpError(410, "This endpoint is deprecated. Use /research/requests/ for async processing.")

@router.get("/reports", response=List[ReportSchema])
def list_reports_legacy(request):
    """
    LEGACY: This endpoint is deprecated. Use /research/requests/ instead.
    Returns all previous research reports for the dashboard history.
    """
    from ninja import HttpError
    raise HttpError(410, "This endpoint is deprecated. Use /research/requests/ for task management.")

@router.get("/reports/{report_id}", response=ReportSchema)
def get_report_legacy(request, report_id: int):
    """
    LEGACY: This endpoint is deprecated. Use /research/requests/{task_id}/report instead.
    Fetches a single specific report by ID.
    """
    from ninja import HttpError
    raise HttpError(410, "This endpoint is deprecated. Use /research/requests/{task_id}/report instead.")
