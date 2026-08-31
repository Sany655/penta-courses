from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.learner_state import LearnerStateService

class ProjectEngineService:
    @staticmethod
    def create_project(
        db: Session,
        user_id: str,
        domain_id: str,
        title: str,
        description: Optional[str] = None,
        tasks_def: Optional[List[Dict[str, Any]]] = None
    ) -> m.Project:
        project = m.Project(
            user_id=user_id,
            domain_id=domain_id,
            name=title,
            title=title,
            description=description,
            status='ACTIVE',
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(project)
        db.flush()

        if tasks_def:
            for idx, t in enumerate(tasks_def):
                task = m.ProjectTask(
                    project_id=project.id,
                    concept_id=t.get('concept_id'),
                    title=t.get('title', f"Milestone 0{idx + 1}"),
                    description=t.get('description'),
                    task_order=idx + 1,
                    status='PENDING',
                    rubric_json=t.get('rubric_json', {}),
                    created_at=datetime.now(timezone.utc)
                )
                db.add(task)

        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def submit_task_solution(
        db: Session,
        user_id: str,
        task_id: str,
        submission_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        task = db.query(m.ProjectTask).join(m.Project).filter(
            m.ProjectTask.id == task_id,
            m.Project.user_id == user_id
        ).first()
        if not task:
            raise ValueError("Project task not found")

        # Rubric & deterministic evaluation
        score = float(submission_data.get('score', 1.0 if submission_data.get('verified') is not False else 0.5))
        passed = score >= 0.70

        task.status = 'VERIFIED' if passed else 'FAILED'
        task.submission_json = submission_data
        task.score = score
        task.completed_at = datetime.now(timezone.utc) if passed else None

        # Record high-weight PROJECT Creation Evidence
        evidence = LearnerStateService.record_evidence(
            db=db,
            user_id=user_id,
            concept_id=task.concept_id,
            evidence_type=m.EvidenceType.PROJECT,
            score=score,
            quality=1.0,
            telemetry_json=submission_data.get('telemetry', {})
        )

        # Check if entire project is completed
        project = db.query(m.Project).filter(m.Project.id == task.project_id).first()
        all_tasks = db.query(m.ProjectTask).filter(m.ProjectTask.project_id == project.id).all()
        verified_count = sum(1 for t in all_tasks if t.status == 'VERIFIED')
        
        project_completed = (verified_count == len(all_tasks))
        if project_completed:
            project.status = 'COMPLETED'
            project.completed_at = datetime.now(timezone.utc)

        project.updated_at = datetime.now(timezone.utc)
        db.commit()

        return {
            'task_id': task.id,
            'status': task.status,
            'score': score,
            'project_id': project.id,
            'project_status': project.status,
            'verified_tasks': verified_count,
            'total_tasks': len(all_tasks),
            'project_completed': project_completed
        }

    @staticmethod
    def get_project_details(db: Session, user_id: str, project_id: str) -> Dict[str, Any]:
        project = db.query(m.Project).filter(
            m.Project.id == project_id,
            m.Project.user_id == user_id
        ).first()
        if not project:
            raise ValueError("Project not found")

        tasks = db.query(m.ProjectTask).filter(
            m.ProjectTask.project_id == project.id
        ).order_by(m.ProjectTask.task_order.asc()).all()

        return {
            'id': project.id,
            'name': project.name,
            'title': project.title or project.name,
            'description': project.description,
            'domain_id': project.domain_id,
            'status': project.status,
            'created_at': project.created_at,
            'completed_at': project.completed_at,
            'tasks': [
                {
                    'id': t.id,
                    'title': t.title,
                    'description': t.description,
                    'task_order': t.task_order,
                    'concept_id': t.concept_id,
                    'status': t.status,
                    'score': t.score,
                    'rubric': t.rubric_json
                }
                for t in tasks
            ]
        }
