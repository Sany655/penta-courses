import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
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

    // Assuming course and module already exist in DB for this to work
    // In a real app we'd verify they exist.
    const lesson = await prisma.lesson.create({
      data: {
        title: validatedData.metadata.lessonTitle,
        moduleId: validatedData.metadata.moduleId,
        orderIndex: Date.now(), // Fallback for ordering
        contentJson: validatedData.blocks,
      }
    });

    return NextResponse.json({ success: true, lesson });

  } catch (error) {
    console.error('Error saving lesson:', error);
    return NextResponse.json(
      { error: 'Failed to save lesson.' },
      { status: 400 }
    );
  }
}
