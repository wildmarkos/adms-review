'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Target, TrendingUp, ArrowRight, UserCog, Clock, FileText } from 'lucide-react';
import spanishTranslations from '@/lib/translations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">{spanishTranslations.navigation.title}</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => window.location.href = '/analytics'}>
                <BarChart3 className="mr-2 h-4 w-4" />
                {spanishTranslations.navigation.viewAnalytics}
              </Button>
              <Button onClick={() => window.location.href = '/survey'}>
                <FileText className="mr-2 h-4 w-4" />
                {spanishTranslations.navigation.takeSurvey}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {spanishTranslations.landing.heroSection.title}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  {spanishTranslations.landing.heroSection.subtitle}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {spanishTranslations.landing.heroSection.badge}
              </Badge>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/survey'}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{spanishTranslations.landing.heroSection.startSurvey}</CardTitle>
                    <CardDescription>Completar evaluación de procesos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>12-15 minutos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>18-21 preguntas por función</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/analytics'}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{spanishTranslations.landing.heroSection.viewInsights}</CardTitle>
                    <CardDescription>Revisar análisis y recomendaciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>Perspectivas ejecutivas</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Roadmap de optimización</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center pb-4">
                <Users className="h-10 w-10 mx-auto text-blue-600 mb-3" />
                <CardTitle className="text-lg">{spanishTranslations.landing.features.roleSpecific.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Encuesta Gerencial</span>
                    <Badge variant="outline">18 preguntas</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Encuesta de Ventas</span>
                    <Badge variant="outline">21 preguntas</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Target className="h-10 w-10 mx-auto text-green-600 mb-3" />
                <CardTitle className="text-lg">{spanishTranslations.landing.features.evidenceBased.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm">
                  <div>✓ {spanishTranslations.landing.features.evidenceBased.painPointPrioritization}</div>
                  <div>✓ {spanishTranslations.landing.features.evidenceBased.workflowMapping}</div>
                  <div>✓ {spanishTranslations.landing.features.evidenceBased.impactAssessment}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <TrendingUp className="h-10 w-10 mx-auto text-purple-600 mb-3" />
                <CardTitle className="text-lg">{spanishTranslations.landing.features.actionableInsights.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm">
                  <div>• {spanishTranslations.landing.features.actionableInsights.quickWins}</div>
                  <div>• {spanishTranslations.landing.features.actionableInsights.mediumTerm}</div>
                  <div>• {spanishTranslations.landing.features.actionableInsights.strategic}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{spanishTranslations.landing.challenges.title}</CardTitle>
              <CardDescription>
                {spanishTranslations.landing.challenges.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg text-blue-700 mb-4">{spanishTranslations.landing.challenges.criticalIssues}</h3>
                  <ul className="space-y-2">
                    {spanishTranslations.landing.challenges.issues.map((issue, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-green-700 mb-4">{spanishTranslations.landing.challenges.expectedOutcomes}</h3>
                  <ul className="space-y-2">
                    {spanishTranslations.landing.challenges.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>{outcome}</span>
                      </li>
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