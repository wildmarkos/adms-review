import { NextRequest, NextResponse } from 'next/server';
import { db, dbHelpers } from '@/lib/database';

interface SubmissionAnswer {
  questionId: number;
  value: string;
  numericValue?: number;
  confidenceScore?: number;
}

interface SubmissionRequest {
  surveyId: number;
  answers: SubmissionAnswer[];
  completedAt: string;
  responseTime: number;
  sessionId?: string;
  startedAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { surveyId, answers, completedAt, responseTime, sessionId, startedAt }: SubmissionRequest = await request.json();

    // Log the incoming data for debugging
    console.log('Survey submission data:', {
      surveyId,
      answersCount: answers?.length,
      questionIds: answers?.map((a: SubmissionAnswer) => a.questionId),
      sessionId,
      startedAt
    });

    // Validate required fields
    if (!surveyId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if we have any answers to submit
    if (answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // Validate that all question IDs exist
    const questionIds = answers.map(a => a.questionId);
    
    // Build dynamic SQL query for validation
    const placeholders = questionIds.map(() => '?').join(',');
    const existingQuestions = db.prepare(`
      SELECT id FROM questions WHERE id IN (${placeholders}) AND survey_id = ?
    `).all(...questionIds, surveyId);

    console.log('Question validation:', {
      submittedIds: questionIds,
      existingIds: existingQuestions.map((q: any) => q.id),
      surveyId,
      answersCount: answers.length
    });

    if (existingQuestions.length !== questionIds.length) {
      const missingIds = questionIds.filter(id => !existingQuestions.find((q: any) => q.id === id));
      console.error('Missing question IDs:', missingIds);
      return NextResponse.json(
        {
          error: 'Invalid question IDs',
          missingIds,
          details: `Question IDs ${missingIds.join(', ')} do not exist for survey ${surveyId}`
        },
        { status: 400 }
      );
    }

    // Start a transaction
    const transaction = db.transaction(() => {
      // Create the response record
      const responseResult = dbHelpers.insertResponse.run(
        surveyId,
        null, // userId - will be null for anonymous responses
        sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        1, // isAnonymous
        startedAt || new Date().toISOString()
      );

      const responseId = responseResult.lastInsertRowid as number;

      // Insert all answers
      for (const answer of answers) {
        dbHelpers.insertAnswer.run(
          responseId,
          answer.questionId,
          answer.value,
          answer.numericValue || null,
          answer.confidenceScore || null
        );
      }

      // Update the response as complete
      dbHelpers.updateResponse.run(
        responseTime || 0,
        responseId
      );

      return responseId;
    });

    const responseId = transaction();

    return NextResponse.json({
      success: true,
      responseId,
      message: 'Survey submitted successfully'
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      {
        error: 'Failed to submit survey',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}