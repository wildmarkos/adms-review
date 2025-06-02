'use client';

import { useState, useEffect } from 'react';
import { useSurveyStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Question {
  id: number;
  survey_id: number;
  section: string;
  question_text: string;
  question_type: 'likert' | 'multiple_choice' | 'text' | 'ranking' | 'percentage' | 'checkbox';
  question_order: number;
  is_required: boolean;
  options?: string | string[]; // Can be JSON string or already parsed array
  validation_rules?: string | object; // Can be JSON string or already parsed object
  analysis_tags?: string;
}

interface QuestionRendererProps {
  question: Question;
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
  const { answers, setAnswer, setError, clearError } = useSurveyStore();
  const currentAnswer = answers[question.id];
  
  const [localValue, setLocalValue] = useState(currentAnswer?.value || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // All hook calls must be at the top level - moved from render functions
  const [rankings, setRankings] = useState<Record<string, number>>({});
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Handle options and validation rules (may already be parsed by API)
  const options = (() => {
    if (!question.options) return [];
    // If it's already an array, use it directly
    if (Array.isArray(question.options)) return question.options;
    // If it's a string, try to parse it
    if (typeof question.options === 'string') {
      try {
        return JSON.parse(question.options);
      } catch (error) {
        console.error('Error parsing question options:', error, 'Raw options:', question.options);
        return [];
      }
    }
    return [];
  })();

  const validationRules = (() => {
    if (!question.validation_rules) return {};
    // If it's already an object, use it directly
    if (typeof question.validation_rules === 'object' && !Array.isArray(question.validation_rules)) {
      return question.validation_rules;
    }
    // If it's a string, try to parse it
    if (typeof question.validation_rules === 'string') {
      try {
        return JSON.parse(question.validation_rules);
      } catch (error) {
        console.error('Error parsing validation rules:', error, 'Raw rules:', question.validation_rules);
        return {};
      }
    }
    return {};
  })();

  useEffect(() => {
    setLocalValue(currentAnswer?.value || '');
  }, [currentAnswer]);

  // Rankings useEffect - moved from renderRanking
  useEffect(() => {
    if (question.question_type === 'ranking' && currentAnswer?.value) {
      try {
        setRankings(JSON.parse(currentAnswer.value));
      } catch (e) {
        setRankings({});
      }
    } else if (question.question_type !== 'ranking') {
      setRankings({});
    }
  }, [currentAnswer, question.question_type]);

  // Percentages useEffect - moved from renderPercentage
  useEffect(() => {
    if (question.question_type === 'percentage' && currentAnswer?.value) {
      try {
        const parsed = JSON.parse(currentAnswer.value);
        setPercentages(parsed);
        const sum = Object.values(parsed).reduce((acc: number, val: any) => acc + (parseFloat(val) || 0), 0);
        setTotal(sum);
      } catch (e) {
        setPercentages({});
        setTotal(0);
      }
    } else if (question.question_type !== 'percentage') {
      setPercentages({});
      setTotal(0);
    }
  }, [currentAnswer, question.question_type]);

  // Checkbox useEffect - handle multiple selections
  useEffect(() => {
    if (question.question_type === 'checkbox' && currentAnswer?.value) {
      try {
        const parsed = JSON.parse(currentAnswer.value);
        setSelectedOptions(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setSelectedOptions([]);
      }
    } else if (question.question_type !== 'checkbox') {
      setSelectedOptions([]);
    }
  }, [currentAnswer, question.question_type]);

  const validateInput = (value: string): string | null => {
    if (question.is_required && !value.trim()) {
      return 'Este campo es requerido';
    }

    if (validationRules.word_limit && value.trim()) {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > validationRules.word_limit) {
        return `Por favor limite a ${validationRules.word_limit} palabras (actual: ${wordCount})`;
      }
    }

    if (validationRules.min && validationRules.max) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < validationRules.min || numValue > validationRules.max) {
        return `Por favor ingrese un valor entre ${validationRules.min} y ${validationRules.max}`;
      }
    }

    return null;
  };

  const handleValueChange = (value: string, numericValue?: number) => {
    setLocalValue(value);
    const error = validateInput(value);
    
    if (error) {
      setValidationError(error);
      setError(question.id, error);
    } else {
      setValidationError(null);
      clearError(question.id);
      setAnswer(question.id, value, numericValue);
    }
  };

  const renderLikertScale = () => {
    const min = validationRules.min || 1;
    const max = validationRules.max || 10;
    const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Totalmente en Desacuerdo</span>
          <span>Totalmente de Acuerdo</span>
        </div>
        <RadioGroup
          value={localValue}
          onValueChange={(value) => handleValueChange(value, parseInt(value))}
          className="flex justify-between"
        >
          {scale.map((num) => (
            <div key={num} className="flex flex-col items-center space-y-2">
              <RadioGroupItem value={num.toString()} id={`${question.id}-${num}`} />
              <Label htmlFor={`${question.id}-${num}`} className="text-sm">
                {num}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {localValue && (
          <div className="text-center">
            <Badge variant="secondary">Seleccionado: {localValue}</Badge>
          </div>
        )}
      </div>
    );
  };

  const renderMultipleChoice = () => {
    return (
      <RadioGroup
        value={localValue}
        onValueChange={(value) => handleValueChange(value)}
        className="space-y-3"
      >
        {options.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${question.id}-${index}`} />
            <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const renderTextInput = () => {
    const isLongText = validationRules.word_limit && validationRules.word_limit > 50;
    const currentWordCount = localValue.trim() ? localValue.trim().split(/\s+/).length : 0;

    if (isLongText) {
      return (
        <div className="space-y-2">
          <Textarea
            value={localValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Ingrese su respuesta..."
            rows={6}
            className="min-h-[120px]"
          />
          {validationRules.word_limit && (
            <div className="text-sm text-muted-foreground text-right">
              {currentWordCount} / {validationRules.word_limit} palabras
            </div>
          )}
        </div>
      );
    }

    return (
      <Input
        value={localValue}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Ingrese su respuesta..."
      />
    );
  };

  const renderRanking = () => {
    const handleRankingChange = (option: string, rank: number) => {
      // Create a completely new rankings object to ensure React detects the change
      const newRankings = { ...rankings };
      
      // If this option already has a rank, remove it first
      if (newRankings[option]) {
        delete newRankings[option];
      }
      
      // Remove any other option that might have this rank
      Object.keys(newRankings).forEach(key => {
        if (newRankings[key] === rank) {
          delete newRankings[key];
        }
      });
      
      // Assign new rank to this option
      newRankings[option] = rank;
      
      // Update state immediately
      setRankings(newRankings);
      
      // Update store with the new rankings
      const rankingValue = JSON.stringify(newRankings);
      handleValueChange(rankingValue);
    };

    const isComplete = Object.keys(rankings).length === options.length;

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Clasifique cada elemento del 1 (mayor prioridad) al {options.length} (menor prioridad)
        </div>
        {options.map((option: string, index: number) => (
          <Card key={`${option}-${index}`} className="p-4">
            <div className="flex items-center justify-between">
              <Label className="flex-1">{option}</Label>
              <div className="flex space-x-1">
                {Array.from({ length: options.length }, (_, i) => i + 1).map((rank) => {
                  const isSelected = rankings[option] === rank;
                  const isUsedByOther = !isSelected && Object.values(rankings).includes(rank);
                  
                  return (
                    <Button
                      key={`${option}-${rank}`}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRankingChange(option, rank)}
                      className={`w-8 h-8 p-0 ${isUsedByOther ? 'opacity-50' : ''}`}
                      disabled={false}
                    >
                      {rank}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
        {isComplete && (
          <Alert>
            <AlertDescription>
              ✓ Clasificación completa! Aún puede ajustar sus clasificaciones si es necesario.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderPercentage = () => {
    const handlePercentageChange = (category: string, value: string) => {
      const numValue = parseFloat(value) || 0;
      const newPercentages = { ...percentages, [category]: numValue };
      setPercentages(newPercentages);
      
      const sum = Object.values(newPercentages).reduce((acc: number, val: any) => acc + (parseFloat(val) || 0), 0);
      setTotal(sum);
      
      // Update store
      handleValueChange(JSON.stringify(newPercentages));
    };

    const categories = options.length > 0 ? options : ['Data Entry', 'Selling', 'Other'];
    const isValid = Math.abs(total - 100) < 0.01; // Allow for small floating point errors

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Ingrese porcentajes para cada categoría. Deben sumar 100%.
        </div>
        {categories.map((category: string, index: number) => (
          <div key={index} className="flex items-center space-x-4">
            <Label className="w-24 text-right">{category}:</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={percentages[category] || ''}
              onChange={(e) => handlePercentageChange(category, e.target.value)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        ))}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="font-medium">Total:</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {total.toFixed(1)}%
            </span>
            {isValid ? (
              <Badge variant="default">✓ Válido</Badge>
            ) : (
              <Badge variant="destructive">Debe sumar 100%</Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCheckbox = () => {
    const handleCheckboxChange = (option: string, checked: boolean) => {
      let newSelections;
      if (checked) {
        newSelections = [...selectedOptions, option];
      } else {
        newSelections = selectedOptions.filter(item => item !== option);
      }
      
      setSelectedOptions(newSelections);
      
      // Update store with JSON string of selected options
      const value = newSelections.length > 0 ? JSON.stringify(newSelections) : '';
      handleValueChange(value, newSelections.length);
    };

    return (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Seleccione todos los que apliquen:
        </div>
        {options.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`${question.id}-checkbox-${index}`}
              checked={selectedOptions.includes(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label
              htmlFor={`${question.id}-checkbox-${index}`}
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </Label>
          </div>
        ))}
        {selectedOptions.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">Seleccionado:</div>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    switch (question.question_type) {
      case 'likert':
        return renderLikertScale();
      case 'multiple_choice':
        return renderMultipleChoice();
      case 'text':
        return renderTextInput();
      case 'ranking':
        return renderRanking();
      case 'percentage':
        return renderPercentage();
      case 'checkbox':
        return renderCheckbox();
      default:
        return <div>Tipo de pregunta no compatible: {question.question_type}</div>;
    }
  };

  return (
    <div className="space-y-4">
      {renderQuestion()}
      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}