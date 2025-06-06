import { NextRequest, NextResponse } from 'next/server';
import { databaseAdapter } from '@/lib/database-adapter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surveyId = parseInt(id);
    
    if (isNaN(surveyId)) {
      return NextResponse.json(
        { error: 'Invalid survey ID' },
        { status: 400 }
      );
    }

    // Get survey details
    const survey = await databaseAdapter.getSurvey(surveyId);
    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    // Get questions for this survey
    const questions = await databaseAdapter.getQuestionsBySurvey(surveyId);

    // Parse JSON fields with error handling
    const parsedQuestions = questions.map((question: any) => {
      let options = null;
      let validation_rules = null;

      if (question.options) {
        try {
          options = JSON.parse(question.options);
        } catch (error) {
          console.error('Error parsing options for question', question.id, ':', error);
          options = [];
        }
      }

      if (question.validation_rules) {
        try {
          validation_rules = JSON.parse(question.validation_rules);
        } catch (error) {
          console.error('Error parsing validation_rules for question', question.id, ':', error);
          validation_rules = {};
        }
      }

      return {
        ...question,
        options,
        validation_rules,
      };
    });

    return NextResponse.json({
      survey,
      questions: parsedQuestions,
    });

  } catch (error) {
    console.error('Error fetching survey questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey questions' },
      { status: 500 }
    );
  }
}