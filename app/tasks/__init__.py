from app.tasks.celery_app import celery_app
from app.tasks.ingestion_tasks import process_document_task

__all__ = ["celery_app", "process_document_task"]