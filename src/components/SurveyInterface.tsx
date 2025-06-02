'use client';

import { useState, useEffect } from 'react';
import { useSurveyStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuestionRenderer } from './QuestionRenderer';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import spanishTranslations from '@/lib/translations';

interface Question {
  id: number;
  survey_id: number;
  section: string;
  question_text: string;
  question_type: 'likert' | 'multiple_choice' | 'text' | 'ranking' | 'percentage';
  question_order: number;
  is_required: boolean;
  options?: string;
  validation_rules?: string;
  analysis_tags?: string;
}

interface SurveyInterfaceProps {
  surveyId: number;
  questions: Question[];
}

export function SurveyInterface({ surveyId, questions }: SurveyInterfaceProps) {
  const {
    currentQuestionIndex,
    currentSection,
    answers,
    errors,
    startTime,
    sessionId,
    userRole,
    setCurrentQuestion,
    setAnswer,
    getProgress,
    validateAnswers,
  } = useSurveyStore();

  const [currentQuestion, setCurrentQuestionState] = useState<Question | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Get current question
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      setCurrentQuestionState(question);
    }
  }, [currentQuestionIndex, questions]);

  // Auto-save functionality (disabled - API endpoint not implemented)
  // TODO: Implement /api/surveys/autosave endpoint
  /*
  useEffect(() => {
    const autoSave = async () => {
      if (Object.keys(answers).length === 0 || !startTime) return;
      
      setAutoSaveStatus('saving');
      try {
        await fetch('/api/surveys/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surveyId,
            answers: Object.values(answers),
            timestamp: new Date().toISOString(),
          }),
        });
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        console.error('Auto-save failed:', error);
      }
    };

    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [answers, surveyId, startTime]);
  */

  const progress = getProgress();
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = currentQuestion ? Boolean(answers[currentQuestion.id]?.value) : false;

  const handleNext = () => {
    if (!isLastQuestion && currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      setCurrentQuestion(nextIndex, nextQuestion.section);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion && currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[prevIndex];
      setCurrentQuestion(prevIndex, prevQuestion.section);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const isValid = validateAnswers();
      if (!isValid) {
        throw new Error(spanishTranslations.survey.errors.completeRequired);
      }

      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId,
          answers: Object.values(answers),
          completedAt: new Date().toISOString(),
          responseTime: startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0,
          sessionId,
          startedAt: startTime?.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Submission error details:', errorData);
        
        // If we get question ID validation errors, clear the store and reload
        if (errorData.error === 'Invalid question IDs') {
          alert(spanishTranslations.survey.errors.outdatedData);
          // Clear the persisted store data
          localStorage.removeItem('survey-storage');
          // Reload the page to get fresh data
          window.location.reload();
          return;
        }
        
        throw new Error(spanishTranslations.survey.errors.submissionFailed);
      }

      // Redirect to thank you page with completion stats
      const completionParams = new URLSearchParams({
        completed: Object.keys(answers).length.toString(),
        total: questions.length.toString(),
        role: userRole || 'unknown'
      });
      window.location.href = `/survey/complete?${completionParams.toString()}`;
    } catch (error) {
      console.error('Submission failed:', error);
      alert(spanishTranslations.survey.errors.submissionFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionQuestions = () => {
    if (!currentSection) return [];
    return questions.filter(q => q.section === currentSection);
  };

  const getCurrentSectionProgress = () => {
    const sectionQuestions = getSectionQuestions();
    const answeredInSection = sectionQuestions.filter(q => answers[q.id]).length;
    return sectionQuestions.length > 0 ? (answeredInSection / sectionQuestions.length) * 100 : 0;
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{spanishTranslations.survey.loadingSurvey}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">{spanishTranslations.survey.title}</CardTitle>
              <CardDescription>
                Pregunta {currentQuestionIndex + 1} de {questions.length} • ID: {currentQuestion?.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {autoSaveStatus && (
                <Badge variant={autoSaveStatus === 'saved' ? 'default' : autoSaveStatus === 'saving' ? 'secondary' : 'destructive'}>
                  {autoSaveStatus === 'saved' && <Save className="w-3 h-3 mr-1" />}
                  {autoSaveStatus === 'saved' ? spanishTranslations.survey.status.saved : autoSaveStatus === 'saving' ? spanishTranslations.survey.status.saving : spanishTranslations.survey.status.saveError}
                </Badge>
              )}
              <Badge variant="outline">{Math.max(1, Math.round(progress))}% {spanishTranslations.survey.complete}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            {currentSection && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{currentSection}</span>
                <Progress value={getCurrentSectionProgress()} className="w-full h-1 mt-1" />
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{currentSection}</Badge>
            {currentQuestion.is_required && (
              <Badge variant="destructive">{spanishTranslations.survey.status.required}</Badge>
            )}
          </div>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionRenderer question={currentQuestion} />
          
          {errors[currentQuestion.id] && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{errors[currentQuestion.id]}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {spanishTranslations.survey.navigation.previous}
            </Button>

            <div className="text-sm text-muted-foreground">
              {hasAnswer ? spanishTranslations.survey.status.answered : currentQuestion.is_required ? spanishTranslations.survey.status.required : spanishTranslations.survey.status.optional}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !hasAnswer}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? spanishTranslations.survey.navigation.submitting : spanishTranslations.survey.navigation.submitSurvey}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestion?.is_required && !hasAnswer}
              >
                {spanishTranslations.survey.navigation.next}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}