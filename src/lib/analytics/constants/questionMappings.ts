/**
 * Question Mappings
 * Maps question IDs to specific metrics and analysis categories
 */

// Based on data reality assessment from the refactoring plan
export const questionMappings = {
  // Time allocation questions
  adminTime: [172, 248], // Administrative time percentages
  salesTime: [172, 248], // Sales time percentages
  strategicTime: [57],   // Strategic planning time (managers)
  systemProblemTime: [57], // Time addressing system problems
  
  // System complexity questions
  toolCount: [218],       // Number of tools used
  loginFragmentation: [258], // Multiple system logins
  workaroundPrevalence: [131, 290], // Workarounds needed
  criticalWorkarounds: [141], // Critical workarounds descriptions
  
  // Team collaboration questions
  informationSharing: [322], // Quality of information sharing
  handoffEffectiveness: [332], // Effectiveness of handoffs
  communicationGap: [342, 354], // Communication issues
  pipelineReview: [354], // Pipeline review frequency
  
  // Process bottleneck questions
  leadLoss: [161],      // Frequency of lead loss
  primaryLossStage: [364], // Stage with highest loss
  leadTracking: [270],  // Confidence in lead tracking
  dataAccess: [310]     // Time to access data
};

// Tag mappings for identifying question types
export const tagMappings = {
  timeAllocation: ['time_allocation', 'admin_burden', 'time_spent'],
  systemComplexity: ['tool_count', 'system_complexity', 'login_fragmentation'],
  teamCollaboration: ['information_sharing', 'handoff_quality', 'team_coordination'],
  processBottlenecks: ['lead_loss', 'conversion_stages', 'loss_analysis']
};

// Section mappings to group related questions
export const sectionMappings = {
  timeManagement: ['Uso de Tiempo', 'Time Usage', 'Time Allocation'],
  systemIssues: ['Sistema', 'System', 'Technology'],
  teamProcesses: ['Equipo', 'Team', 'Collaboration'],
  admissionProcess: ['Admisión', 'Admissions', 'Process']
};

// Role-specific question sets
export const roleMappings = {
  assessor: [/* Question IDs relevant to assessors */],
  coordinator: [/* Question IDs relevant to coordinators */],
  manager: [57, /* Other manager-specific questions */]
};