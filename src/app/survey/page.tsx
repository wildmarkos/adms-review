'use client';

import { useState, useEffect } from 'react';
import { useSurveyStore } from '@/lib/store';
import { SurveyInterface } from '@/components/SurveyInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserCog, Shield } from 'lucide-react';

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
    userRole,
    currentSurveyId,
    isAnonymous,
    setUserRole,
    setAnonymous,
    startSurvey,
    resetSurvey,
  } = useSurveyStore();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load survey data if we have a current survey ID (from persisted state)
  useEffect(() => {
    if (currentSurveyId && userRole && !survey && !loading) {
      loadSurveyDataAndStart(currentSurveyId);
    }
  }, [currentSurveyId, userRole, survey, loading]);

  // Role selection step
  const handleRoleSelection = async (role: 'manager' | 'sales') => {
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

  const handleAnonymousToggle = () => {
    setAnonymous(!isAnonymous);
  };

  const handleRestart = () => {
    resetSurvey();
    setSurvey(null);
    setQuestions([]);
    setError(null);
  };

  // If no role selected, show role selection
  if (!userRole || !currentSurveyId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-2">
                Eduscore Feedback System
              </CardTitle>
              <CardDescription className="text-lg">
                Help us improve our admissions process by sharing your insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">About This Survey</h3>
                <p className="text-blue-700 text-sm">
                  This feedback system uses proven methodologies including the Kirkpatrick Model, 
                  Net Promoter Score (NPS), and Root Cause Analysis to identify specific areas 
                  for improvement in our Eduscore CRM platform. Your responses will help us 
                  reduce workflow inefficiencies and improve team productivity.
                </p>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-4">Select Your Role</h3>
                <p className="text-muted-foreground mb-6">
                  Choose the option that best describes your current position
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleRoleSelection('manager')}
                >
                  <CardHeader className="text-center">
                    <UserCog className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle>Manager</CardTitle>
                    <CardDescription>
                      Team leaders, supervisors, and management staff
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Questions:</span>
                        <Badge variant="secondary">18 strategic</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time:</span>
                        <Badge variant="secondary">~15 minutes</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Focus:</span>
                        <Badge variant="secondary">Process & ROI</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleRoleSelection('sales')}
                >
                  <CardHeader className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle>Sales Representative</CardTitle>
                    <CardDescription>
                      Sales team members and representatives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Questions:</span>
                        <Badge variant="secondary">21 tactical</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time:</span>
                        <Badge variant="secondary">~12 minutes</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Focus:</span>
                        <Badge variant="secondary">Daily workflow</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Privacy Option</span>
                  </div>
                  <Button
                    variant={isAnonymous ? "default" : "outline"}
                    onClick={handleAnonymousToggle}
                    size="sm"
                  >
                    {isAnonymous ? "Anonymous Mode" : "Make Anonymous"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {isAnonymous 
                    ? "Your responses will be completely anonymous. No personal information will be collected."
                    : "Your responses may be linked to your role for targeted improvements. Click to enable anonymous mode."
                  }
                </p>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                  <Button variant="outline" onClick={() => setError(null)} className="mt-2">
                    Try Again
                  </Button>
                </div>
              )}

              {loading && (
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground">Loading survey...</p>
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{survey.name}</h1>
              <p className="text-muted-foreground">{survey.description}</p>
            </div>
            <Button variant="outline" onClick={handleRestart} size="sm">
              Restart Survey
            </Button>
          </div>
          
          <SurveyInterface surveyId={survey.id} questions={questions} />
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <Card>
          <CardContent className="py-8">
            <p className="text-lg">Loading survey...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}