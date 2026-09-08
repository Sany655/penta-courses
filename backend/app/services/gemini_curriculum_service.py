import os
import re
import json
import logging
import requests
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
import backend.app.models as m

logger = logging.getLogger("penta.gemini_curriculum")

class GeminiCurriculumService:
    @staticmethod
    def _get_api_key() -> str:
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured in environment.")
        return api_key

    @staticmethod
    def _call_gemini_json(system_instruction: str, user_prompt: str, timeout: int = 60) -> Dict[str, Any]:
        api_key = GeminiCurriculumService._get_api_key()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

        payload = {
            "contents": [{"parts": [{"text": user_prompt}]}],
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.4
            }
        }

        response = requests.post(url, json=payload, timeout=timeout)
        if not response.ok:
            logger.error(f"[GeminiService] API call failed: {response.status_code} - {response.text}")
            raise RuntimeError(f"Gemini API returned {response.status_code}: {response.text}")

        res_data = response.json()
        candidates = res_data.get("candidates", [])
        if not candidates or "content" not in candidates[0]:
            raise RuntimeError("Gemini did not return any candidates.")

        raw_text = candidates[0]["content"]["parts"][0]["text"]
        return json.loads(raw_text)

    @classmethod
    def generate_lesson_blocks(cls, topic: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Synthesizes a complete, multi-block interactive lesson based on our draft-07 block schema.
        Generates markdown theory, terminal simulation, code stepper, and network diagram.
        """
        system_instruction = """You are an elite educational technologist and instructional architect on a universal cognitive learning platform.
Given a topic, concept, or curriculum unit, you synthesize a complete, production-ready, interactive lesson following the exact cognitive block architecture.

You MUST respond with a single valid JSON object adhering to this schema:
{
  "lessonTitle": "Precise, professional lesson title",
  "difficulty": "Beginner" | "Intermediate" | "Advanced" | "Expert",
  "blocks": [
    {
      "type": "markdown",
      "content": {
        "content": "### Section Heading\\nIn-depth technical explanation, core principles, real-world utility, and key formulas using Markdown formatting."
      }
    },
    {
      "type": "terminal_animation",
      "content": {
        "command": "realistic command line or tool invocation e.g. ping -c 4 or python script.py",
        "expectedOutput": "realistic stdout/telemetry demonstrating the concept",
        "typingSpeedMs": 30
      }
    },
    {
      "type": "code_stepper",
      "content": {
        "script": "Clean, syntactically valid code sample (Python, C, JS, Bash, or SQL)",
        "language": "python",
        "steps": [
          {"lines": [1, 2], "tooltip": "Explanation of initialization/import"},
          {"lines": [4, 5], "tooltip": "Core algorithmic transformation or execution logic"}
        ]
      }
    },
    {
      "type": "network_diagram",
      "content": {
        "nodes": ["Entity A", "Entity B", "Entity C", "Target/Output"],
        "animationFlow": [
          {"step": 1, "source": "Entity A", "target": "Entity B", "description": "Protocol handshake or data transmission"},
          {"step": 2, "source": "Entity B", "target": "Entity C", "description": "Intermediate processing and filtering"},
          {"step": 3, "source": "Entity C", "target": "Target/Output", "description": "Final state convergence or response"}
        ]
      }
    }
  ],
  "quiz": {
    "passingScore": 80,
    "questions": [
      {
        "question": "Rigorous conceptual question testing understanding?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Detailed explanation of why the correct option is right."
      }
    ]
  }
}
Generate 4 to 6 alternating, high-yield blocks ensuring theory is interleaved with practical terminal, code, or network flow."""

        user_prompt = f"Topic to synthesize into an interactive lesson: {topic}"
        if context:
            user_prompt += f"\nCourse / Unit Context: {context}"

        return cls._call_gemini_json(system_instruction, user_prompt, timeout=60)

    @classmethod
    def parse_and_synthesize_syllabus(cls, syllabus_text: str) -> Dict[str, Any]:
        """
        Parses unorganized or scraped textbook syllabus text into a structured Course and Module hierarchy.
        """
        system_instruction = """You are a senior academic curriculum architect.
Given raw syllabus text, extract and organize the full curriculum into a structured course with modules and suggested lesson prompts.

You MUST respond with a single valid JSON object adhering to this schema:
{
  "title": "Clean, authoritative Course Title",
  "courseCode": "Official course code or generated slug e.g. 216002",
  "category": "COMPUTER_SCIENCE" | "CYBERSECURITY" | "WEB_DEVELOPMENT" | "GENERAL_TECH" | "DATA_SCIENCE",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "credits": 1,
  "estimatedHours": 24,
  "description": "Comprehensive, compelling 2-3 sentence overview of what students will achieve in this course.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "modules": [
    {
      "unitNumber": 1,
      "title": "Unit-1: Unit Title",
      "summary": "1 sentence overview of this module's scope",
      "topics": ["Topic A", "Topic B", "Topic C"],
      "suggestedLessons": [
        {
          "title": "Lesson Title",
          "prompt": "Specific, detailed topic prompt ready to be passed to the lesson generator"
        }
      ]
    }
  ]
}
Ensure every unit in the syllabus is captured as a module, with 2-4 granular suggested lessons per module."""

        return cls._call_gemini_json(system_instruction, syllabus_text, timeout=60)

    @classmethod
    def create_course_from_syllabus(cls, db: Session, syllabus_data: Dict[str, Any], instructor_name: str = "Penta Faculty") -> m.Course:
        """
        Persists a synthesized syllabus as a real Course with Modules in the database.
        """
        title = syllabus_data.get("title", "New Applied Course")
        raw_slug = syllabus_data.get("courseCode") or title
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', raw_slug.lower()).strip('-')

        # Check existing course
        existing = db.query(m.Course).filter(m.Course.slug == slug).first()
        if existing:
            slug = f"{slug}-{int(os.urandom(2).hex(), 16)}"

        course = m.Course(
            title=title,
            slug=slug,
            description=syllabus_data.get("description", "Comprehensive applied course track."),
            category=syllabus_data.get("category", "COMPUTER_SCIENCE"),
            difficulty=syllabus_data.get("difficulty", "Beginner"),
            price_in_cents=0,  # default free for foundational / university tracks
            bypass_fee_in_cents=0,
            thumbnail_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
            instructor_name=instructor_name,
            stats_json={
                "modules": len(syllabus_data.get("modules", [])),
                "estimatedHours": syllabus_data.get("estimatedHours", 24),
                "credits": syllabus_data.get("credits", 1),
                "courseCode": syllabus_data.get("courseCode", "")
            },
            skills_json=syllabus_data.get("skills", []),
            is_active=True
        )
        db.add(course)
        db.flush()

        # Add Modules
        for idx, mod_data in enumerate(syllabus_data.get("modules", [])):
            module = m.Module(
                course_id=course.id,
                title=mod_data.get("title", f"Module {idx + 1}"),
                order_index=idx,
                bypass_fee_in_cents=0
            )
            db.add(module)

        db.commit()
        db.refresh(course)
        return course

    @classmethod
    def parse_uploaded_document(cls, file_bytes: bytes, filename: str, mime_type: str, mode: str = "TOC") -> Dict[str, Any]:
        """
        Parses uploaded documents (PDFs, Markdown, text, or syllabus exports) natively via Gemini 2.5 Flash.
        Handles up to 20MB inline PDF documents.
        """
        import base64

        api_key = cls._get_api_key()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

        system_instruction = """You are a senior academic curriculum architect on a universal cognitive learning platform.
Analyze the provided document (such as a book Table of Contents, full syllabus, or textbook unit).
Extract and structure the entire curriculum into a clean JSON object adhering to this schema:
{
  "title": "Clean Course or Book Title",
  "courseCode": "Course Code or generated slug",
  "category": "COMPUTER_SCIENCE" | "CYBERSECURITY" | "WEB_DEVELOPMENT" | "GENERAL_TECH" | "DATA_SCIENCE" | "EARLY_LEARNING",
  "targetAudience": "Children | Primary | High School | University | Professional",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "credits": 1,
  "estimatedHours": 24,
  "description": "Comprehensive 2-3 sentence overview of this curriculum.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "modules": [
    {
      "unitNumber": 1,
      "title": "Unit-1: Chapter/Unit Title",
      "summary": "1 sentence scope overview",
      "topics": ["Topic 1", "Topic 2"],
      "suggestedLessons": [
        {
          "title": "Lesson Title",
          "prompt": "Specific detailed topic prompt to generate an interactive lesson"
        }
      ]
    }
  ]
}
Ensure all chapters or units in the document are captured as distinct modules with suggested lesson prompts."""

        parts = []
        is_pdf = mime_type == "application/pdf" or filename.lower().endswith(".pdf")
        if is_pdf:
            b64_pdf = base64.b64encode(file_bytes).decode("utf-8")
            parts.append({
                "inlineData": {
                    "mimeType": "application/pdf",
                    "data": b64_pdf
                }
            })
            parts.append({
                "text": "Extract and structure the complete course, chapters, units, and lesson blueprint from this uploaded book/document."
            })
        else:
            text_content = file_bytes.decode("utf-8", errors="ignore")
            parts.append({
                "text": f"Document content ({filename}):\n\n{text_content}"
            })

        payload = {
            "contents": [{"parts": parts}],
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.3
            }
        }

        response = requests.post(url, json=payload, timeout=90)
        if not response.ok:
            logger.error(f"[GeminiService] Document upload parsing failed: {response.status_code} - {response.text}")
            raise RuntimeError(f"Gemini API returned {response.status_code}: {response.text}")

        res_data = response.json()
        raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(raw_text)

    @classmethod
    def synthesize_and_commit_chapter(cls, db: Session, course_id: str, module_id: str, chapter_title: str, chapter_prompt: str) -> Dict[str, Any]:
        """
        Synthesizes an interactive lesson for a chapter and commits it directly to the database.
        """
        module = db.query(m.Module).filter(m.Module.id == module_id, m.Module.course_id == course_id).first()
        if not module:
            raise ValueError(f"Module {module_id} not found for course {course_id}")

        lesson_data = cls.generate_lesson_blocks(topic=chapter_prompt or chapter_title)
        
        lesson = m.Lesson(
            module_id=module.id,
            title=lesson_data.get("lessonTitle") or chapter_title,
            order_index=len(module.lessons),
            content_blocks=lesson_data.get("blocks", [])
        )
        db.add(lesson)
        db.commit()
        db.refresh(lesson)

        return {
            "id": lesson.id,
            "title": lesson.title,
            "blocks_count": len(lesson_data.get("blocks", [])),
            "lesson_data": lesson_data
        }
