export interface Question {
  id: number;
  survey_id: number;
  section: string;
  question_text: string;
  question_type: 'likert' | 'multiple_choice' | 'text' | 'ranking' | 'percentage' | 'checkbox';
  question_order: number;
  is_required: boolean;
  options?: string[];
  validation_rules?: {
    min?: number;
    max?: number;
    required?: boolean;
    word_limit?: number;
    sum_to_100?: boolean;
  };
  analysis_tags?: string;
}

// Manager Questions (Survey ID: 1) - Preguntas Gerenciales
export const managerQuestions: Omit<Question, 'id'>[] = [
  // Section 1: Strategic Alignment & Goals - Alineación Estratégica y Objetivos
  {
    survey_id: 1,
    section: "Alineación Estratégica y Objetivos",
    question_text: "¿Qué tan efectivamente apoya Eduscore actualmente los objetivos de inscripción de su equipo?",
    question_type: "likert",
    question_order: 1,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "effectiveness,enrollment_support,revenue_impact"
  },
  {
    survey_id: 1,
    section: "Alineación Estratégica y Objetivos",
    question_text: "¿Qué brechas específicas de capacidades impactan el logro de objetivos?",
    question_type: "text",
    question_order: 2,
    is_required: false,
    validation_rules: { word_limit: 200 },
    analysis_tags: "capability_gaps,improvement_areas"
  },
  {
    survey_id: 1,
    section: "Alineación Estratégica y Objetivos",
    question_text: "¿Qué tanto están relacionadas las habilidades de Eduscore con los objetivos del negocio?",
    question_type: "likert",
    question_order: 3,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "alignment,business_objectives"
  },
  {
    survey_id: 1,
    section: "Alineación Estratégica y Objetivos",
    question_text: "¿Qué porcentaje de su tiempo semanal se dedica a problemas relacionados con el sistema vs. planificación estratégica?",
    question_type: "multiple_choice",
    question_order: 4,
    is_required: true,
    options: ["0-10%", "11-25%", "26-40%", "41-60%", "60%+"],
    analysis_tags: "time_allocation,system_burden"
  },
  {
    survey_id: 1,
    section: "Alineación Estratégica y Objetivos",
    question_text: "¿Qué tan confiado se siente usted en los pronósticos de inscripción que puede generar a partir de los datos actuales?",
    question_type: "likert",
    question_order: 5,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "forecasting,data_confidence,data_quality"
  },

  // Section 2: Team Performance Management - Gestión del Rendimiento del Equipo
  {
    survey_id: 1,
    section: "Gestión del Rendimiento del Equipo",
    question_text: "¿Qué tan efectivamente puede usted monitorear el rendimiento individual de los representantes en Eduscore?",
    question_type: "likert",
    question_order: 6,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "performance_monitoring,visibility"
  },
  {
    survey_id: 1,
    section: "Gestión del Rendimiento del Equipo",
    question_text: "Califique la calidad de los datos de rendimiento disponibles para decisiones de capacitación:",
    question_type: "likert",
    question_order: 7,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "coaching_data,data_quality"
  },
  {
    survey_id: 1,
    section: "Gestión del Rendimiento del Equipo",
    question_text: "¿Qué oportunidades de capacitación está perdiendo debido a las limitaciones del sistema?",
    question_type: "text",
    question_order: 8,
    is_required: false,
    validation_rules: { word_limit: 250 },
    analysis_tags: "coaching_gaps,missed_opportunities"
  },
  {
    survey_id: 1,
    section: "Gestión del Rendimiento del Equipo",
    question_text: "¿Qué tan fácilmente puede usted identificar a sus mejores y peores ejecutantes?",
    question_type: "multiple_choice",
    question_order: 9,
    is_required: true,
    options: ["Inmediatamente disponible", "Requiere algún análisis", "Requiere seguimiento manual", "Casi imposible"],
    analysis_tags: "performance_identification,accessibility"
  },

  // Section 3: Process Efficiency & Workflow - Eficiencia de Procesos y Flujo de Trabajo
  {
    survey_id: 1,
    section: "Eficiencia de Procesos y Flujo de Trabajo",
    question_text: "Describa su proceso actual de prospecto a inscripción e identifique los mayores cuellos de botella:",
    question_type: "text",
    question_order: 10,
    is_required: true,
    validation_rules: { word_limit: 300 },
    analysis_tags: "workflow_mapping,bottlenecks"
  },
  {
    survey_id: 1,
    section: "Eficiencia de Procesos y Flujo de Trabajo",
    question_text: "¿Cuántas soluciones manuales temporales ha creado su equipo para compensar las limitaciones de Eduscore?",
    question_type: "multiple_choice",
    question_order: 11,
    is_required: true,
    options: ["0", "1-3", "4-7", "8-12", "13+"],
    analysis_tags: "workarounds,system_limitations"
  },
  {
    survey_id: 1,
    section: "Eficiencia de Procesos y Flujo de Trabajo",
    question_text: "Enumere las 3 soluciones temporales más críticas que utiliza su equipo:",
    question_type: "text",
    question_order: 12,
    is_required: false,
    validation_rules: { word_limit: 200 },
    analysis_tags: "critical_workarounds,process_gaps"
  },
  {
    survey_id: 1,
    section: "Eficiencia de Procesos y Flujo de Trabajo",
    question_text: "Califique el impacto del uso de Excel en la integridad de datos y la coordinación del equipo:",
    question_type: "likert",
    question_order: 13,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "excel_impact,data_integrity"
  },
  {
    survey_id: 1,
    section: "Eficiencia de Procesos y Flujo de Trabajo",
    question_text: "¿Con qué frecuencia se pierden prospectos debido a las limitaciones del sistema?",
    question_type: "multiple_choice",
    question_order: 14,
    is_required: true,
    options: ["Nunca", "Raramente (mensual)", "A veces (semanal)", "Frecuentemente (diario)", "Constantemente"],
    analysis_tags: "lead_loss,system_reliability"
  },

  // Section 4: Resource Allocation & ROI - Asignación de Recursos y ROI
  {
    survey_id: 1,
    section: "Asignación de Recursos y ROI",
    question_text: "¿Qué porcentaje del tiempo de su equipo se dedica a la entrada de datos vs. actividades reales de venta? (% Entrada de Datos + % Venta + % Otro = 100%)",
    question_type: "percentage",
    question_order: 15,
    is_required: true,
    validation_rules: { sum_to_100: true },
    analysis_tags: "time_allocation,productivity,time_efficiency"
  },
  {
    survey_id: 1,
    section: "Asignación de Recursos y ROI",
    question_text: "Estime qué porcentaje de prospectos calificados se pierden debido a retrasos relacionados con el sistema:",
    question_type: "multiple_choice",
    question_order: 16,
    is_required: true,
    options: ["0-5%", "6-15%", "16-25%", "26-40%", "40%+"],
    analysis_tags: "lead_loss_rate,system_impact,lead_conversion,revenue_impact"
  },
  {
    survey_id: 1,
    section: "Asignación de Recursos y ROI",
    question_text: "Califique la rentabilidad de su conjunto actual de tecnologías:",
    question_type: "likert",
    question_order: 17,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "cost_effectiveness,roi"
  },
  {
    survey_id: 1,
    section: "Asignación de Recursos y ROI",
    question_text: "Si tuviera presupuesto adicional para mejoras del sistema, clasifique sus principales prioridades: (1=más alta, 5=más baja)",
    question_type: "ranking",
    question_order: 18,
    is_required: true,
    options: ["Funcionalidad del Sistema de Gestión de Relaciones con Clientes", "Reportes/análisis", "Capacidades de integración", "Capacitación de usuarios", "Herramientas adicionales"],
    analysis_tags: "improvement_priorities,budget_allocation"
  }
];

// Sales Team Questions (Survey ID: 2) - Preguntas del Equipo de Ventas
export const salesQuestions: Omit<Question, 'id'>[] = [
  // Section 1: Daily Workflow Efficiency - Eficiencia del Flujo de Trabajo Diario
  {
    survey_id: 2,
    section: "Eficiencia del Flujo de Trabajo Diario",
    question_text: "¿Cuántos sistemas/herramientas diferentes utiliza usted diariamente para la gestión de prospectos?",
    question_type: "multiple_choice",
    question_order: 1,
    is_required: true,
    options: ["1-2", "3-4", "5-6", "7-8", "9+"],
    analysis_tags: "system_complexity,tool_count"
  },
  {
    survey_id: 2,
    section: "Eficiencia del Flujo de Trabajo Diario",
    question_text: "Enumere sus 3 herramientas más utilizadas:",
    question_type: "text",
    question_order: 2,
    is_required: false,
    validation_rules: { word_limit: 100 },
    analysis_tags: "primary_tools,workflow"
  },
  {
    survey_id: 2,
    section: "Eficiencia del Flujo de Trabajo Diario",
    question_text: "Califique qué tan fácilmente puede usted encontrar la información necesaria para llamadas a prospectos:",
    question_type: "likert",
    question_order: 3,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "information_accessibility,call_preparation"
  },
  {
    survey_id: 2,
    section: "Eficiencia del Flujo de Trabajo Diario",
    question_text: "¿Qué porcentaje de su día se dedica a tareas administrativas vs. actividades de venta? (% Admin + % Venta + % Otro = 100%)",
    question_type: "percentage",
    question_order: 4,
    is_required: true,
    validation_rules: { sum_to_100: true },
    analysis_tags: "time_allocation,admin_burden,time_efficiency"
  },
  {
    survey_id: 2,
    section: "Eficiencia del Flujo de Trabajo Diario",
    question_text: "¿Con qué frecuencia tiene que iniciar sesión en múltiples sistemas para completar una tarea?",
    question_type: "multiple_choice",
    question_order: 5,
    is_required: true,
    options: ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"],
    analysis_tags: "system_fragmentation,efficiency"
  },

  // Section 2: Lead Management & Follow-up - Gestión de Prospectos y Seguimiento
  {
    survey_id: 2,
    section: "Gestión de Prospectos y Seguimiento",
    question_text: "¿Qué tan confiado se siente usted de que ningún prospecto se pierda en su canal de ventas?",
    question_type: "likert",
    question_order: 6,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "lead_tracking_confidence,pipeline_reliability,lead_conversion"
  },
  {
    survey_id: 2,
    section: "Gestión de Prospectos y Seguimiento",
    question_text: "Califique la efectividad de los recordatorios automáticos y sistemas de seguimiento:",
    question_type: "likert",
    question_order: 7,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "automation_effectiveness,follow_up_quality"
  },
  {
    survey_id: 2,
    section: "Gestión de Prospectos y Seguimiento",
    question_text: "¿Qué métodos manuales de seguimiento ha creado usted fuera de Eduscore? (Seleccione todos los que apliquen)",
    question_type: "checkbox",
    question_order: 8,
    is_required: false,
    options: ["Hojas de cálculo Excel", "Notas en papel", "Recordatorios telefónicos", "Calendario personal", "Carpetas de correo", "Otro Sistema de Gestión de Relaciones con Clientes", "Notas adhesivas", "Ninguno"],
    analysis_tags: "manual_workarounds,tracking_methods"
  },
  {
    survey_id: 2,
    section: "Gestión de Prospectos y Seguimiento",
    question_text: "Describa su sistema manual de seguimiento más importante:",
    question_type: "text",
    question_order: 9,
    is_required: false,
    validation_rules: { word_limit: 150 },
    analysis_tags: "critical_workarounds,process_gaps"
  },
  {
    survey_id: 2,
    section: "Gestión de Prospectos y Seguimiento",
    question_text: "¿Qué tan rápidamente puede usted acceder al historial completo de interacciones de un prospecto?",
    question_type: "multiple_choice",
    question_order: 10,
    is_required: true,
    options: ["Instantáneo", "<30 segundos", "1-2 minutos", "3-5 minutos", ">5 minutos"],
    analysis_tags: "data_accessibility,interaction_history"
  },

  // Section 3: Communication & Collaboration - Comunicación y Colaboración
  {
    survey_id: 2,
    section: "Comunicación y Colaboración",
    question_text: "¿Qué tan efectivamente puede usted compartir información de prospectos con colegas?",
    question_type: "likert",
    question_order: 11,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "information_sharing,collaboration"
  },
  {
    survey_id: 2,
    section: "Comunicación y Colaboración",
    question_text: "Califique la calidad de las transferencias entre miembros del equipo:",
    question_type: "likert",
    question_order: 12,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "handoff_quality,team_coordination"
  },
  {
    survey_id: 2,
    section: "Comunicación y Colaboración",
    question_text: "¿En qué cosas cree que hay falta de comunicación entre usted y la gerencia sobre su desempeño? (Marque todas las que apliquen)",
    question_type: "checkbox",
    question_order: 13,
    is_required: false,
    options: ["Expectativas poco claras", "Retroalimentación limitada", "Métricas inexactas", "Falta de reconocimiento de logros", "Capacitación tardía", "Prioridades conflictivas", "Ninguna"],
    analysis_tags: "communication_gaps,management_feedback"
  },
  {
    survey_id: 2,
    section: "Comunicación y Colaboración",
    question_text: "¿Con qué frecuencia usted y su gerente revisan juntos su canal de ventas?",
    question_type: "multiple_choice",
    question_order: 14,
    is_required: true,
    options: ["Diariamente", "Semanalmente", "Quincenalmente", "Mensualmente", "Raramente", "Nunca"],
    analysis_tags: "pipeline_reviews,manager_engagement"
  },

  // Section 4: Conversion Barriers & Sales Effectiveness - Barreras de Conversión y Efectividad de Ventas
  {
    survey_id: 2,
    section: "Barreras de Conversión y Efectividad de Ventas",
    question_text: "¿En qué etapa pierde usted más prospectos? (Estime porcentajes - debe sumar 100%)",
    question_type: "percentage",
    question_order: 15,
    is_required: true,
    validation_rules: { sum_to_100: true },
    analysis_tags: "conversion_stages,loss_analysis"
  },
  {
    survey_id: 2,
    section: "Barreras de Conversión y Efectividad de Ventas",
    question_text: "Clasifique la importancia de la información que desearía tener durante conversaciones con prospectos: (1=más importante, 6=menos importante)",
    question_type: "ranking",
    question_order: 16,
    is_required: true,
    options: ["Detalles de interacciones previas", "Investigación de competidores", "Cronograma del prospecto", "Información de presupuesto", "Proceso de toma de decisiones", "Motivaciones personales"],
    analysis_tags: "information_needs,conversation_effectiveness"
  },
  {
    survey_id: 2,
    section: "Barreras de Conversión y Efectividad de Ventas",
    question_text: "Califique qué tan bien le ayuda Eduscore a personalizar las interacciones con prospectos:",
    question_type: "likert",
    question_order: 17,
    is_required: true,
    validation_rules: { min: 1, max: 10 },
    analysis_tags: "personalization,interaction_quality"
  },
  {
    survey_id: 2,
    section: "Barreras de Conversión y Efectividad de Ventas",
    question_text: "¿Cuál es su mayor frustración al tratar de cerrar una inscripción?",
    question_type: "text",
    question_order: 18,
    is_required: false,
    validation_rules: { word_limit: 200 },
    analysis_tags: "closing_frustrations,barriers"
  },

  // Section 5: Advanced Diagnostic Questions - Diagnóstico Avanzado
  {
    survey_id: 2,
    section: "Diagnóstico Avanzado",
    question_text: "Clasifique sus 5 principales frustraciones diarias y califique su impacto en el éxito de inscripciones (escala 1-10):",
    question_type: "text",
    question_order: 19,
    is_required: false,
    validation_rules: { word_limit: 300 },
    analysis_tags: "pain_points,impact_assessment"
  },
  {
    survey_id: 2,
    section: "Diagnóstico Avanzado",
    question_text: "¿Qué herramientas/características desearía usted que tuviera Eduscore que ha visto en otros lugares?",
    question_type: "text",
    question_order: 20,
    is_required: false,
    validation_rules: { word_limit: 200 },
    analysis_tags: "feature_requests,competitive_analysis"
  },
  {
    survey_id: 2,
    section: "Diagnóstico Avanzado",
    question_text: "Si pudiera eliminar una tarea diaria relacionada con Eduscore, ¿cuál sería y cuánto tiempo le ahorraría diariamente?",
    question_type: "text",
    question_order: 21,
    is_required: false,
    validation_rules: { word_limit: 150 },
    analysis_tags: "task_elimination,time_savings"
  }
];

export const allQuestions = [...managerQuestions, ...salesQuestions];