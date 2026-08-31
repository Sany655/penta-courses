from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class LessonOut(BaseModel):
    id: str
    module_id: str
    title: str
    order_index: int
    duration_minutes: int
    content_blocks: List[Dict[str, Any]] = []
    model_config = ConfigDict(from_attributes=True)

class ModuleOut(BaseModel):
    id: str
    course_id: str
    title: str
    order_index: int
    bypass_fee_in_cents: int
    lessons: List[LessonOut] = []
    model_config = ConfigDict(from_attributes=True)

class CourseOut(BaseModel):
    id: str
    domain_id: Optional[str] = None
    title: str
    slug: str
    description: Optional[str] = None
    category: str
    difficulty: str
    price_in_cents: int
    is_published: bool
    instructor_name: str
    thumbnail_url: Optional[str] = None
    stats_json: Dict[str, Any] = {}
    modules: List[ModuleOut] = []
    model_config = ConfigDict(from_attributes=True)
