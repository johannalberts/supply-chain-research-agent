from django.db import models

class TaskStatus(models.Model):
    """Track async task status and progress"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    TASK_TYPE_CHOICES = [
        ('MANUAL', 'Manual Research'),
        ('SCHEDULED', 'Scheduled Research'),
        ('RETRY', 'Retry Task'),
    ]
    
    # Task identification
    task_id = models.UUIDField(unique=True, db_index=True)
    task_type = models.CharField(max_length=20, choices=TASK_TYPE_CHOICES, default='MANUAL')
    industry = models.CharField(max_length=100)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    progress = models.IntegerField(default=0, help_text="Progress percentage 0-100")
    
    # Timing information
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Error handling
    error_message = models.TextField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Related report (created when task completes successfully)
    report = models.OneToOneField(
        'SupplyChainReport', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='task_status'
    )
    
    def __str__(self):
        return f"Task {self.task_id} - {self.status}"
    
    @property
    def is_completed(self):
        return self.status in ['COMPLETED', 'FAILED', 'CANCELLED']
    
    @property
    def duration(self):
        """Calculate task duration in seconds"""
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        elif self.started_at:
            from django.utils import timezone
            return (timezone.now() - self.started_at).total_seconds()
        return None


class SupplyChainReport(models.Model):
    industry = models.CharField(max_length=100)
    fragility_score = models.IntegerField()
    executive_summary = models.TextField()
    
    # Store the list of strings (alerts) and list of dicts (metrics)
    critical_alerts = models.JSONField(default=list)
    risk_metrics = models.JSONField(default=list) 
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.industry} Report - {self.created_at.date()}"