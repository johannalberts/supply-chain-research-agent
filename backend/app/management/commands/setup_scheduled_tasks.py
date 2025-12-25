# app/management/commands/setup_scheduled_tasks.py
from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from datetime import timedelta
import json


class Command(BaseCommand):
    help = 'Setup scheduled research tasks for key industries'

    def handle(self, *args, **options):
        """Create periodic tasks for automated research"""
        
        # Key industries to monitor
        industries = [
            'Automotive',
            'Technology', 
            'Healthcare',
            'Manufacturing',
            'Energy',
            'Pharmaceuticals',
            'Semiconductors'
        ]
        
        # Create or get crontab schedule (daily at 9 AM UTC)
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute='0',
            hour='9',
            day_of_week='*',
            day_of_month='*',
            month_of_year='*'
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('Created daily schedule at 9:00 AM UTC')
            )
        
        # Create periodic task for each industry
        for industry in industries:
            task_name = f'daily_research_{industry.lower()}'
            
            # Check if task already exists
            if PeriodicTask.objects.filter(name=task_name).exists():
                self.stdout.write(
                    self.style.WARNING(f'Periodic task "{task_name}" already exists')
                )
                continue
            
            # Create the periodic task
            PeriodicTask.objects.create(
                crontab=schedule,
                name=task_name,
                task='app.tasks.setup_scheduled_research',
                enabled=True,
                kwargs=json.dumps({
                    'industries': [industry],
                    'force_update': True
                })
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Created periodic task: {task_name}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully setup {len(industries)} scheduled research tasks'
            )
        )