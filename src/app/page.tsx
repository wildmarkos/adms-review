'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Target, TrendingUp, ArrowRight, CheckCircle, UserCog } from 'lucide-react';
import spanishTranslations from '@/lib/translations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">{spanishTranslations.navigation.title}</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/analytics'}>
                {spanishTranslations.navigation.viewAnalytics}
              </Button>
              <Button onClick={() => window.location.href = '/survey'}>
                {spanishTranslations.navigation.takeSurvey}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                {spanishTranslations.landing.heroSection.badge}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {spanishTranslations.landing.heroSection.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {spanishTranslations.landing.heroSection.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/survey'}
                className="text-lg px-8 py-3"
              >
                {spanishTranslations.landing.heroSection.startSurvey}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/analytics'}
                className="text-lg px-8 py-3"
              >
                {spanishTranslations.landing.heroSection.viewInsights}
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>{spanishTranslations.landing.features.roleSpecific.title}</CardTitle>
                <CardDescription>
                  {spanishTranslations.landing.features.roleSpecific.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{spanishTranslations.landing.features.roleSpecific.managerSurvey}</span>
                    <Badge variant="secondary">18 {spanishTranslations.landing.features.roleSpecific.questions}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{spanishTranslations.landing.features.roleSpecific.salesSurvey}</span>
                    <Badge variant="secondary">21 {spanishTranslations.landing.features.roleSpecific.questions}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle>{spanishTranslations.landing.features.evidenceBased.title}</CardTitle>
                <CardDescription>
                  {spanishTranslations.landing.features.evidenceBased.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{spanishTranslations.landing.features.evidenceBased.painPointPrioritization}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{spanishTranslations.landing.features.evidenceBased.workflowMapping}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{spanishTranslations.landing.features.evidenceBased.impactAssessment}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <CardTitle>{spanishTranslations.landing.features.actionableInsights.title}</CardTitle>
                <CardDescription>
                  {spanishTranslations.landing.features.actionableInsights.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{spanishTranslations.landing.features.actionableInsights.quickWins}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{spanishTranslations.landing.features.actionableInsights.mediumTerm}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{spanishTranslations.landing.features.actionableInsights.strategic}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Problem Statement */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">{spanishTranslations.landing.challenges.title}</CardTitle>
              <CardDescription>
                {spanishTranslations.landing.challenges.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-red-600">{spanishTranslations.landing.challenges.criticalIssues}</h3>
                  <ul className="space-y-2">
                    {spanishTranslations.landing.challenges.issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-green-600">{spanishTranslations.landing.challenges.expectedOutcomes}</h3>
                  <ul className="space-y-2">
                    {spanishTranslations.landing.challenges.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Survey Details */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">{spanishTranslations.landing.surveyOverview.title}</CardTitle>
              <CardDescription>
                {spanishTranslations.landing.surveyOverview.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserCog className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{spanishTranslations.landing.surveyOverview.managerSurvey.title}</h3>
                      <p className="text-sm text-muted-foreground">{spanishTranslations.landing.surveyOverview.managerSurvey.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duración:</span>
                      <Badge variant="outline">{spanishTranslations.landing.surveyOverview.managerSurvey.duration}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Preguntas:</span>
                      <Badge variant="outline">{spanishTranslations.landing.surveyOverview.managerSurvey.questions}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Áreas de Enfoque:</span>
                      <Badge variant="outline">{spanishTranslations.landing.surveyOverview.managerSurvey.focusAreas}</Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {spanishTranslations.landing.surveyOverview.managerSurvey.description}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">{spanishTranslations.landing.surveyOverview.salesSurvey.title}</h3>
                      <p className="text-sm text-muted-foreground">{spanishTranslations.landing.surveyOverview.salesSurvey.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duración:</span>
                      <Badge variant="outline">{spanishTranslations.landing.surveyOverview.salesSurvey.duration}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Preguntas:</span>
                      <Badge variant="outline">{spanishTranslations.landing.surveyOverview.salesSurvey.questions}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Áreas de Enfoque:</span>
                      <Badge variant="outline">{spanishTranslations.landing.surveyOverview.salesSurvey.focusAreas}</Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {spanishTranslations.landing.surveyOverview.salesSurvey.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">{spanishTranslations.landing.cta.title}</h2>
              <p className="text-xl mb-8 opacity-90">
                {spanishTranslations.landing.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => window.location.href = '/survey'}
                  className="text-lg px-8 py-3"
                >
                  {spanishTranslations.landing.cta.startSurvey}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/analytics'}
                  className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
                >
                  {spanishTranslations.landing.cta.exploreSample}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}