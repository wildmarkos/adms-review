'use client';

import { useState, useEffect } from 'react';
import { useSurveyStore } from '@/lib/store';
import { SurveyInterface } from '@/components/SurveyInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserCog, Shield } from 'lucide-react';
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

interface Survey {
  id: number;
  name: string;
  description: string;
  target_role: string;
  version: number;
  is_active: boolean;
}

export default function SurveyPage() {
  const {
    currentSurveyId,
    setUserRole,
    startSurvey,
    resetSurvey,
  } = useSurveyStore();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'manager' | 'sales' | null>(null);

  // Always start fresh - don't check for existing userRole
  const handleRoleSelection = async (role: 'manager' | 'sales') => {
    setSelectedRole(role);
    setUserRole(role);
    
    // Determine survey ID based on role
    const surveyId = role === 'manager' ? 1 : 2;
    
    // Start the survey
    startSurvey(surveyId, 0); // Will update total questions after loading
    
    // Load survey data
    await loadSurveyDataAndStart(surveyId);
  };

  const loadSurveyDataAndStart = async (surveyId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/surveys/${surveyId}/questions`);
      if (!response.ok) {
        throw new Error('Failed to load survey');
      }
      
      const data = await response.json();
      setSurvey(data.survey);
      setQuestions(data.questions);
      
      // Update the survey with correct question count
      startSurvey(surveyId, data.questions.length);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load survey');
      resetSurvey();
    } finally {
      setLoading(false);
    }
  };


  const handleRestart = () => {
    resetSurvey();
    setSurvey(null);
    setQuestions([]);
    setError(null);
    setSelectedRole(null);
  };

  // Always show role selection first
  if (!selectedRole || !currentSurveyId) {
    return (
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-semibold mb-1">
                {spanishTranslations.roleSelection.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {spanishTranslations.roleSelection.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h3 className="font-semibold text-blue-800 mb-1 text-sm">
                  {spanishTranslations.roleSelection.aboutTitle}
                </h3>
                <p className="text-blue-700 text-xs leading-snug">
                  {spanishTranslations.roleSelection.aboutDescription}
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-base font-semibold mb-1">
                  {spanishTranslations.roleSelection.selectRoleTitle}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {spanishTranslations.roleSelection.selectRoleSubtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Card
                  className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                  onClick={() => handleRoleSelection('manager')}
                >
                  <CardHeader className="text-center pb-2">
                    <UserCog className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-base">{spanishTranslations.roleSelection.managerRole.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {spanishTranslations.roleSelection.managerRole.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>{spanishTranslations.roleSelection.questions}</span>
                        <Badge variant="secondary" className="text-xs">{spanishTranslations.roleSelection.managerRole.questions}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{spanishTranslations.roleSelection.time}</span>
                        <Badge variant="secondary" className="text-xs">{spanishTranslations.roleSelection.managerRole.time}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{spanishTranslations.roleSelection.focus}</span>
                        <Badge variant="secondary" className="text-xs">{spanishTranslations.roleSelection.managerRole.focus}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                  onClick={() => handleRoleSelection('sales')}
                >
                  <CardHeader className="text-center pb-2">
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-base">{spanishTranslations.roleSelection.salesRole.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {spanishTranslations.roleSelection.salesRole.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>{spanishTranslations.roleSelection.questions}</span>
                        <Badge variant="secondary" className="text-xs">{spanishTranslations.roleSelection.salesRole.questions}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{spanishTranslations.roleSelection.time}</span>
                        <Badge variant="secondary" className="text-xs">{spanishTranslations.roleSelection.salesRole.time}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{spanishTranslations.roleSelection.focus}</span>
                        <Badge variant="secondary" className="text-xs">{spanishTranslations.roleSelection.salesRole.focus}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {spanishTranslations.roleSelection.anonymousNotice}
                </p>
              </div>

              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-xs">{error}</p>
                  <Button variant="outline" onClick={() => setError(null)} className="mt-1 text-xs" size="sm">
                    {spanishTranslations.roleSelection.tryAgain}
                  </Button>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">{spanishTranslations.roleSelection.loadingSurvey}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show survey interface if role is selected and survey is loaded
  if (survey && questions.length > 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">{survey.name}</h1>
              <p className="text-sm text-muted-foreground">{survey.description}</p>
            </div>
            <Button variant="outline" onClick={handleRestart} size="sm" className="text-xs">
              {spanishTranslations.roleSelection.restartSurvey}
            </Button>
          </div>
          
          <SurveyInterface surveyId={survey.id} questions={questions} />
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto text-center">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm">{spanishTranslations.roleSelection.loadingSurvey}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}