# app/tasks.py
import uuid
import traceback
from datetime import datetime
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .models import TaskStatus, SupplyChainReport
from .agent import supply_chain_app


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 60})
def run_research_task(self, task_id: str, industry: str):
    """
    Celery task for running supply chain research asynchronously.
    
    Args:
        task_id: UUID string of the TaskStatus record
        industry: Industry to research
    """
    try:
        # Get or update task status
        task_status = TaskStatus.objects.get(task_id=task_id)
        task_status.status = 'PROCESSING'
        task_status.started_at = timezone.now()
        task_status.progress = 10
        task_status.save()
        
        # Update progress
        task_status.progress = 25
        task_status.save()
        
        # Initial State for the LangGraph
        initial_state = {
            "industry": industry,
            "raw_data": [],
            "risk_report": "",
            "critical_alerts": [],
            "fragility_score": 0,
            "risk_metrics": []
        }
        
        task_status.progress = 50
        task_status.save()
        
        # Run the Agent (Gemini + Tavily logic happens here)
        final_state = supply_chain_app.invoke(initial_state)
        
        task_status.progress = 90
        task_status.save()
        
        # Create report and update task status in a transaction
        with transaction.atomic():
            report = SupplyChainReport.objects.create(
                industry=industry,
                fragility_score=final_state["fragility_score"],
                executive_summary=final_state["risk_report"],
                critical_alerts=final_state["critical_alerts"],
                risk_metrics=final_state["risk_metrics"]
            )
            
            # Update task status to completed
            task_status.status = 'COMPLETED'
            task_status.progress = 100
            task_status.completed_at = timezone.now()
            task_status.report = report
            task_status.save()
        
        return {
            'task_id': task_id,
            'status': 'COMPLETED',
            'report_id': report.id,
            'industry': industry
        }
        
    except TaskStatus.DoesNotExist:
        # Task status record was deleted, task should be cancelled
        return {
            'task_id': task_id,
            'status': 'CANCELLED',
            'error': 'Task status record not found'
        }
    except Exception as exc:
        # Update task status to failed
        try:
            task_status = TaskStatus.objects.get(task_id=task_id)
            task_status.status = 'FAILED'
            task_status.error_message = str(exc)
            task_status.completed_at = timezone.now()
            task_status.save()
        except TaskStatus.DoesNotExist:
            pass
        
        # Re-raise exception to trigger Celery retry mechanism
        raise


@shared_task
def setup_scheduled_research(industries=None, force_update=False):
    """
    Setup periodic research tasks for key industries.
    This task can be scheduled to run daily/weekly to keep reports fresh.
    
    Args:
        industries: List of industries to research (default: all key industries)
        force_update: If True, ignore recent report check and create tasks anyway
    """
    # Default key industries to monitor
    default_industries = [
        'Automotive',
        'Technology',
        'Healthcare',
        'Manufacturing',
        'Energy',
        'Pharmaceuticals',
        'Semiconductors'
    ]
    
    # Use provided industries or default
    industries_to_check = industries or default_industries
    
    created_tasks = []
    
    for industry in industries_to_check:
        # Check if we already have a recent report for this industry
        recent_report = SupplyChainReport.objects.filter(
            industry=industry,
            created_at__gte=timezone.now() - timezone.timedelta(days=7)  # Within last 7 days
        ).exists()
        
        if not recent_report or force_update:
            # Create a new scheduled research task
            task_id = str(uuid.uuid4())
            
            task_status = TaskStatus.objects.create(
                task_id=task_id,
                task_type='SCHEDULED',
                industry=industry,
                status='PENDING'
            )
            
            # Queue the research task
            run_research_task.delay(task_id, industry)
            
            created_tasks.append({
                'task_id': task_id,
                'industry': industry,
                'task_status_id': task_status.id
            })
    
    return {
        'created_tasks': created_tasks,
        'total_created': len(created_tasks),
        'industries_checked': industries_to_check
    }