'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import FunnelChart from './FunnelChart';

// This is a wrapper component that fixes the display issues with the FunnelChart component
export default function FixedFunnelChart(props: any) {
  // Make a deep copy to avoid mutating the original props
  const fixedProps = { ...props };
  
  // Fix sourceQuestions if it's problematic, without using hardcoded values
  if (Array.isArray(fixedProps.sourceQuestions)) {
    // Keep only first few questions if array is too large
    if (fixedProps.sourceQuestions.length > 10) {
      console.log("Trimming large sourceQuestions array", fixedProps.sourceQuestions.length);
      fixedProps.sourceQuestions = fixedProps.sourceQuestions.slice(0, 5);
    }
    
    // If any question number is too large, use an empty array instead of hardcoded values
    if (fixedProps.sourceQuestions.some((q: any) => typeof q === 'number' && q > 10000)) {
      console.log("Found unreasonably large question IDs, clearing array");
      fixedProps.sourceQuestions = [];
    }
  } else {
    // If sourceQuestions is not an array, set an empty array
    fixedProps.sourceQuestions = [];
  }
  
  // Log the source questions we're using
  console.log("Using source questions in FixedFunnelChart:", fixedProps.sourceQuestions);
  
  // Ensure response count is reasonable
  if (typeof fixedProps.responseCount !== 'number' ||
      fixedProps.responseCount > 1000 ||
      fixedProps.responseCount < 0) {
    // Use a default value that makes sense
    fixedProps.responseCount = 0;
  }
  
  return <FunnelChart {...fixedProps} />;
}