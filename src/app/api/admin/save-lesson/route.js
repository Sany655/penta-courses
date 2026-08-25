import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import { z } from 'zod';

const lessonSchema = z.object({
  metadata: z.object({
    lessonTitle: z.string().min(1),
    courseId: z.string().min(1),
    moduleId: z.string().min(1)
  }),
  blocks: z.array(z.any()),
  savedBy: z.string().email(),
});

export async function POST(request) {
  try {
    const json = await request.json();
    const validatedData = lessonSchema.parse(json);

    // Using Firestore structure: courses/{courseId}/modules/{moduleId}/lessons/{lessonId}
    // Alternatively, a flat 'lessons' collection with courseId and moduleId fields.
    // Let's use a flat 'lessons' collection for easier querying.
    const lessonsRef = adminDb.collection('lessons');
    const newLessonRef = lessonsRef.doc();

    const lessonData = {
      title: validatedData.metadata.lessonTitle,
      moduleId: validatedData.metadata.moduleId,
      courseId: validatedData.metadata.courseId,
      orderIndex: Date.now(), // Fallback for ordering
      contentJson: validatedData.blocks,
      createdAt: new Date().toISOString()
    };

    await newLessonRef.set(lessonData);

    return NextResponse.json({ success: true, lesson: { id: newLessonRef.id, ...lessonData } });

  } catch (error) {
    console.error('Error saving lesson:', error);
    return NextResponse.json(
      { error: 'Failed to save lesson.' },
      { status: 400 }
    );
  }
}
