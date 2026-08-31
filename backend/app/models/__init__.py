from backend.app.models.user import User, DeviceSession, UserRole
from backend.app.models.domain import (
    Domain, Concept, Skill, ConceptRelation, SkillRelation, ConceptSkill,
    Resource, ResourceConcept, ConceptRelationType, ConceptType
)
from backend.app.models.course import Course, Module, Lesson, CourseDomainMap, LessonConceptMap
from backend.app.models.learner import (
    LearnerProfile, LearnerDomainState, LearnerConceptState, LearnerSkillState,
    Goal, ExplorationItem, GoalType
)
from backend.app.models.session import (
    LearningSession, Activity, Attempt, LearningEvidence, FailureEvent,
    Project, ProjectTask, EvidenceType, FailureCategory, RecommendationAudit
)
from backend.app.models.commerce import (
    Product, Transaction, Entitlement, Enrollment, ModuleBypass, Certificate, AdminAuditLog
)
from backend.app.models.event import LearningEvent, EventType
