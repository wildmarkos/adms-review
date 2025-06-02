'use client';

import { useEffect, useState } from 'react';
import { useSurveyStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BarChart3, Home, Users } from 'lucide-react';
import spanishTranslations from '@/lib/translations';

export default function SurveyCompletePage() {
  const { resetSurvey } = useSurveyStore();
  const [completionStats, setCompletionStats] = useState({
    completed: 0,
    total: 0,
    role: 'unknown'
  });
  const [dynamicStats, setDynamicStats] = useState({
    totalResponses: 0,
    avgResponseTime: 0,
    improvements: {
      dataEntry: 25,
      leadResponse: 40,
      productivity: 60
    }
  });

  useEffect(() => {
    // Get completion stats from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const completed = parseInt(urlParams.get('completed') || '0');
    const total = parseInt(urlParams.get('total') || '0');
    const role = urlParams.get('role') || 'unknown';
    
    setCompletionStats({ completed, total, role });

    // Fetch dynamic statistics from API
    fetch('/api/completion-stats')
      .then(response => response.json())
      .then(data => setDynamicStats(data))
      .catch(error => {
        console.error('Error fetching completion stats:', error);
        // Keep default fallback values
      });

    // Clear survey data after a delay to allow for viewing the completion page
    const timer = setTimeout(() => {
      resetSurvey();
    }, 30000); // Clear after 30 seconds

    return () => clearTimeout(timer);
  }, [resetSurvey]);

  const completionRate = completionStats.total > 0 ? (completionStats.completed / completionStats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="text-center mb-8">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4">
                <CheckCircle className="w-20 h-20 text-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                {spanishTranslations.completion.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {spanishTranslations.completion.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Completion Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{Math.round(completionRate)}%</div>
                  <p className="text-sm text-muted-foreground">{spanishTranslations.completion.completionRate}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{completionStats.completed}</div>
                  <p className="text-sm text-muted-foreground">{spanishTranslations.completion.questionsAnswered}</p>
                </div>
              </div>

              {/* Role Badge */}
              {completionStats.role !== 'unknown' && (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="text-sm px-4 py-2">
                    {completionStats.role === 'manager' ? spanishTranslations.completion.managerSurveyCompleted : spanishTranslations.completion.salesSurveyCompleted}
                  </Badge>
                </div>
              )}

              {/* What Happens Next */}
              <div className="bg-muted border border-border rounded-lg p-6 text-left">
                <h3 className="font-semibold text-foreground mb-3">{spanishTranslations.completion.whatHappensNext.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {spanishTranslations.completion.whatHappensNext.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-foreground mt-0.5 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {dynamicStats.avgResponseTime > 0 && (
                  <div className="mt-4 p-3 bg-secondary rounded-md">
                    <p className="text-xs text-muted-foreground">
                      {spanishTranslations.completion.whatHappensNext.avgCompletionTime.replace('{minutes}', Math.round(dynamicStats.avgResponseTime / 60).toString())}
                    </p>
                  </div>
                )}
              </div>

              {/* Impact Message */}
              <div className="bg-secondary border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">{spanishTranslations.completion.impact.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {spanishTranslations.completion.impact.description}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{dynamicStats.improvements.dataEntry}%</div>
                    <p className="text-xs text-muted-foreground">{spanishTranslations.completion.impact.dataEntryReduction}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{dynamicStats.improvements.leadResponse}%</div>
                    <p className="text-xs text-muted-foreground">{spanishTranslations.completion.impact.leadResponseImprovement}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{dynamicStats.improvements.productivity}%</div>
                    <p className="text-xs text-muted-foreground">{spanishTranslations.completion.impact.productivityIncrease}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => window.location.href = '/analytics'}
                  className="flex items-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {spanishTranslations.completion.actions.viewAnalytics}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex items-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  {spanishTranslations.completion.actions.returnHome}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{spanishTranslations.completion.methodology.title}</CardTitle>
              <CardDescription>
                {spanishTranslations.completion.methodology.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">{spanishTranslations.completion.methodology.analysisFramework}</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {spanishTranslations.completion.methodology.frameworkItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{spanishTranslations.completion.methodology.privacySecurity}</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {spanishTranslations.completion.methodology.privacyItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}