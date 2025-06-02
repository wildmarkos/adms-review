// Spanish translations for the admissions feedback system
// Using Mexican Spanish business terminology (formal "usted" form)

export interface Translations {
  // Navigation and UI
  navigation: {
    title: string;
    viewAnalytics: string;
    takeSurvey: string;
    startSurvey: string;
    returnHome: string;
    exportData: string;
  };

  // Landing Page
  landing: {
    heroSection: {
      badge: string;
      title: string;
      subtitle: string;
      startSurvey: string;
      viewInsights: string;
    };
    features: {
      roleSpecific: {
        title: string;
        description: string;
        managerSurvey: string;
        salesSurvey: string;
        questions: string;
      };
      evidenceBased: {
        title: string;
        description: string;
        painPointPrioritization: string;
        workflowMapping: string;
        impactAssessment: string;
      };
      actionableInsights: {
        title: string;
        description: string;
        quickWins: string;
        mediumTerm: string;
        strategic: string;
      };
    };
    challenges: {
      title: string;
      subtitle: string;
      criticalIssues: string;
      expectedOutcomes: string;
      issues: string[];
      outcomes: string[];
    };
    surveyOverview: {
      title: string;
      subtitle: string;
      managerSurvey: {
        title: string;
        subtitle: string;
        duration: string;
        questions: string;
        focusAreas: string;
        description: string;
      };
      salesSurvey: {
        title: string;
        subtitle: string;
        duration: string;
        questions: string;
        focusAreas: string;
        description: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      startSurvey: string;
      exploreSample: string;
    };
  };

  // Survey Interface
  survey: {
    title: string;
    questionProgress: string;
    sectionProgress: string;
    complete: string;
    loading: string;
    loadingSurvey: string;
    navigation: {
      previous: string;
      next: string;
      submitSurvey: string;
      submitting: string;
    };
    status: {
      answered: string;
      required: string;
      optional: string;
      saved: string;
      saving: string;
      saveError: string;
    };
    errors: {
      completeRequired: string;
      submissionFailed: string;
      outdatedData: string;
    };
  };

  // Question Sections
  sections: {
    strategicAlignment: string;
    teamPerformance: string;
    processEfficiency: string;
    resourceAllocation: string;
    dailyWorkflow: string;
    leadManagement: string;
    communication: string;
    salesEffectiveness: string;
    advancedDiagnostic: string;
  };

  // Analytics Dashboard
  analytics: {
    title: string;
    subtitle: string;
    metrics: {
      totalResponses: string;
      avgCompletionTime: string;
      criticalIssues: string;
      systemScore: string;
      highImpactPoints: string;
      belowExpectations: string;
      target: string;
      managers: string;
      sales: string;
    };
    tabs: {
      overview: string;
      painPoints: string;
      efficiency: string;
      recommendations: string;
    };
    charts: {
      sectionPerformance: {
        title: string;
        description: string;
      };
      timeAllocation: {
        title: string;
        description: string;
        dataEntry: string;
        selling: string;
        other: string;
      };
      systemEffectiveness: {
        title: string;
        description: string;
      };
      painPointsAnalysis: {
        title: string;
        description: string;
        severity: string;
        frequency: string;
        businessImpact: string;
        highImpact: string;
        mediumImpact: string;
        lowImpact: string;
      };
    };
    efficiency: {
      keyFinding: string;
      productivityImpact: {
        title: string;
        description: string;
        weeklyTimeLost: string;
        additionalCalls: string;
        revenueOpportunity: string;
      };
      leadConversion: {
        title: string;
        description: string;
        leadsLostEstimate: string;
        leadsLostDescription: string;
        responseTimeIssues: string;
        missingHistory: string;
        followUpFailures: string;
      };
    };
    recommendations: {
      quickWins: {
        title: string;
        description: string;
        items: string[];
      };
      mediumTerm: {
        title: string;
        description: string;
        items: string[];
      };
      strategic: {
        title: string;
        description: string;
        items: string[];
      };
      roi: {
        title: string;
        description: string;
        dataEntryReduction: string;
        leadResponseImprovement: string;
        productivityIncrease: string;
        quickWinsPhase: string;
        mediumTermPhase: string;
        strategicPhase: string;
      };
    };
  };

  // Completion Page
  completion: {
    title: string;
    subtitle: string;
    completionRate: string;
    questionsAnswered: string;
    managerSurveyCompleted: string;
    salesSurveyCompleted: string;
    whatHappensNext: {
      title: string;
      items: string[];
      avgCompletionTime: string;
    };
    impact: {
      title: string;
      description: string;
      dataEntryReduction: string;
      leadResponseImprovement: string;
      productivityIncrease: string;
    };
    actions: {
      viewAnalytics: string;
      returnHome: string;
    };
    methodology: {
      title: string;
      description: string;
      analysisFramework: string;
      privacySecurity: string;
      frameworkItems: string[];
      privacyItems: string[];
    };
  };

  // Business Terminology
  terminology: {
    crm: string;
    lead: string;
    followUp: string;
    workflow: string;
    dashboard: string;
    prospects: string;
    enrollment: string;
    conversion: string;
    pipeline: string;
    representative: string;
  };
}

export const spanishTranslations: Translations = {
  navigation: {
    title: "Sistema de Retroalimentación Eduscore",
    viewAnalytics: "Ver Análisis",
    takeSurvey: "Realizar Encuesta",
    startSurvey: "Iniciar Encuesta",
    returnHome: "Regresar al Inicio",
    exportData: "Exportar Datos"
  },

  landing: {
    heroSection: {
      badge: "Recopilación de Retroalimentación Basada en Evidencia",
      title: "Transforme Su Proceso de Admisiones",
      subtitle: "Sistema integral de retroalimentación diseñado para identificar y resolver puntos críticos en su flujo de trabajo del Sistema de Gestión de Relaciones con Clientes Eduscore, potenciando la productividad del equipo y el éxito en las inscripciones.",
      startSurvey: "Iniciar Encuesta",
      viewInsights: "Ver Perspectivas"
    },
    features: {
      roleSpecific: {
        title: "Encuestas Específicas por Función",
        description: "Cuestionarios personalizados para gerentes y representantes de ventas, capturando perspectivas estratégicas y tácticas.",
        managerSurvey: "Encuesta Gerencial:",
        salesSurvey: "Encuesta de Ventas:",
        questions: "preguntas"
      },
      evidenceBased: {
        title: "Análisis Basado en Evidencia",
        description: "Metodologías comprobadas incluyendo el Modelo Kirkpatrick, NPS y Análisis de Causa Raíz para obtener perspectivas accionables.",
        painPointPrioritization: "Priorización de Puntos Críticos",
        workflowMapping: "Mapeo de Flujos de Trabajo",
        impactAssessment: "Evaluación de Impacto"
      },
      actionableInsights: {
        title: "Perspectivas Accionables",
        description: "Panel de control analítico integral con recomendaciones priorizadas y proyecciones de retorno de inversión.",
        quickWins: "Victorias Rápidas (0-30 días)",
        mediumTerm: "Mediano Plazo (1-3 meses)",
        strategic: "Estratégico (3-12 meses)"
      }
    },
    challenges: {
      title: "Desafíos Actuales que Abordamos",
      subtitle: "Puntos críticos clave identificados en los flujos de trabajo de equipos de admisiones",
      criticalIssues: "Problemas Críticos",
      expectedOutcomes: "Resultados Esperados",
      issues: [
        "Ineficiencias en el seguimiento y rastreo de prospectos",
        "Cargas de entrada de datos que reducen el tiempo de venta",
        "Mala calidad de prospectos y tasas de conversión",
        "Brechas de comunicación entre gerentes y ventas",
        "Equipos recurriendo a soluciones temporales en Excel"
      ],
      outcomes: [
        "Identificar áreas específicas de mejora en Eduscore",
        "Reducir la dependencia en soluciones manuales temporales",
        "Mejorar las tasas de conversión de prospectos",
        "Aumentar la productividad y satisfacción del equipo",
        "Crear planes de acción basados en datos"
      ]
    },
    surveyOverview: {
      title: "Resumen de la Encuesta",
      subtitle: "Recopilación integral de retroalimentación diseñada para su equipo de admisiones",
      managerSurvey: {
        title: "Encuesta Gerencial",
        subtitle: "Retroalimentación a nivel estratégico",
        duration: "~15 minutos",
        questions: "18 estratégicas",
        focusAreas: "Proceso y ROI",
        description: "Cubre alineación estratégica, gestión del rendimiento del equipo, eficiencia de procesos y asignación de recursos."
      },
      salesSurvey: {
        title: "Encuesta del Equipo de Ventas",
        subtitle: "Retroalimentación a nivel táctico",
        duration: "~12 minutos",
        questions: "21 tácticas",
        focusAreas: "Flujo de trabajo diario",
        description: "Cubre eficiencia del flujo de trabajo diario, gestión de prospectos, comunicación y efectividad de ventas."
      }
    },
    cta: {
      title: "¿Listo para Transformar Su Proceso?",
      subtitle: "Únase a los equipos que ya están mejorando su éxito en inscripciones con perspectivas basadas en datos",
      startSurvey: "Iniciar Su Encuesta",
      exploreSample: "Explorar Perspectivas de Muestra"
    }
  },

  survey: {
    title: "Encuesta de Retroalimentación Eduscore",
    questionProgress: "Pregunta {current} de {total} • ID: {id}",
    sectionProgress: "% Completado",
    complete: "Completado",
    loading: "Cargando...",
    loadingSurvey: "Cargando Encuesta...",
    navigation: {
      previous: "Anterior",
      next: "Siguiente",
      submitSurvey: "Enviar Encuesta",
      submitting: "Enviando..."
    },
    status: {
      answered: "✓ Respondido",
      required: "Requerido",
      optional: "Opcional",
      saved: "Guardado",
      saving: "Guardando...",
      saveError: "Error al Guardar"
    },
    errors: {
      completeRequired: "Por favor complete todas las preguntas requeridas",
      submissionFailed: "Error al enviar la encuesta. Por favor intente nuevamente.",
      outdatedData: "Los datos de la encuesta están desactualizados. La página se recargará con datos actualizados."
    }
  },

  sections: {
    strategicAlignment: "Alineación Estratégica y Objetivos",
    teamPerformance: "Gestión del Rendimiento del Equipo",
    processEfficiency: "Eficiencia de Procesos y Flujo de Trabajo",
    resourceAllocation: "Asignación de Recursos y ROI",
    dailyWorkflow: "Eficiencia del Flujo de Trabajo Diario",
    leadManagement: "Gestión de Prospectos y Seguimiento",
    communication: "Comunicación y Colaboración",
    salesEffectiveness: "Barreras de Conversión y Efectividad de Ventas",
    advancedDiagnostic: "Diagnóstico Avanzado"
  },

  analytics: {
    title: "Análisis de Retroalimentación Eduscore",
    subtitle: "Perspectivas integrales de {count} respuestas de encuesta",
    metrics: {
      totalResponses: "Respuestas Totales",
      avgCompletionTime: "Tiempo Promedio de Finalización",
      criticalIssues: "Problemas Críticos",
      systemScore: "Puntuación del Sistema",
      highImpactPoints: "Puntos críticos de alto impacto",
      belowExpectations: "Por debajo de las expectativas",
      target: "Objetivo: 12-15 minutos",
      managers: "gerentes",
      sales: "ventas"
    },
    tabs: {
      overview: "Resumen",
      painPoints: "Puntos Críticos",
      efficiency: "Eficiencia",
      recommendations: "Recomendaciones"
    },
    charts: {
      sectionPerformance: {
        title: "Puntuaciones de Rendimiento por Sección",
        description: "Puntuaciones promedio por sección de encuesta (escala 1-10)"
      },
      timeAllocation: {
        title: "Análisis de Asignación de Tiempo",
        description: "Cómo los equipos distribuyen su tiempo (%)",
        dataEntry: "Entrada de Datos",
        selling: "Venta",
        other: "Otro"
      },
      systemEffectiveness: {
        title: "Efectividad del Sistema vs. Estándares de la Industria",
        description: "Rendimiento actual comparado con estándares de la industria"
      },
      painPointsAnalysis: {
        title: "Análisis de Principales Puntos Críticos",
        description: "Problemas críticos clasificados por impacto y frecuencia",
        severity: "Severidad:",
        frequency: "Frecuencia:",
        businessImpact: "Impacto Empresarial:",
        highImpact: "Alto Impacto",
        mediumImpact: "Impacto Medio",
        lowImpact: "Bajo Impacto"
      }
    },
    efficiency: {
      keyFinding: "Hallazgo Clave: Los equipos de ventas gastan 35% de su tiempo en entrada de datos en lugar de actividades de venta. Esto representa aproximadamente 14 horas por semana por representante.",
      productivityImpact: {
        title: "Impacto en la Productividad",
        description: "Tiempo estimado perdido debido a ineficiencias del sistema",
        weeklyTimeLost: "Tiempo semanal perdido por representante de ventas",
        additionalCalls: "Llamadas de ventas adicionales potenciales",
        revenueOpportunity: "Oportunidad estimada de ingresos"
      },
      leadConversion: {
        title: "Análisis de Conversión de Prospectos",
        description: "Impacto de problemas del sistema en las tasas de conversión",
        leadsLostEstimate: "15-25%",
        leadsLostDescription: "Prospectos calificados estimados perdidos debido a retrasos del sistema",
        responseTimeIssues: "Problemas de tiempo de respuesta a prospectos",
        missingHistory: "Historial de interacciones faltante",
        followUpFailures: "Fallas en el rastreo de seguimiento"
      }
    },
    recommendations: {
      quickWins: {
        title: "Victorias Rápidas (0-30 días)",
        description: "Mejoras inmediatas con alto impacto",
        items: [
          "Implementar recordatorios automáticos de seguimiento de prospectos",
          "Crear plantillas estandarizadas de entrada de datos",
          "Proporcionar capacitación del panel de control gerencial"
        ]
      },
      mediumTerm: {
        title: "Mediano Plazo (1-3 meses)",
        description: "Mejoras de procesos e integraciones",
        items: [
          "Integrar sistemas de correo electrónico y calendario",
          "Implementar automatización de flujos de trabajo",
          "Mejorar capacidades de reportes"
        ]
      },
      strategic: {
        title: "Estratégico (3-12 meses)",
        description: "Mejoras sistémicas a largo plazo",
        items: [
          "Evaluar alternativas de plataformas de Sistema de Gestión de Relaciones con Clientes",
          "Implementar puntuación de prospectos impulsada por IA",
          "Construir suite analítica integral"
        ]
      },
      roi: {
        title: "ROI Esperado por Fase de Implementación",
        description: "Mejoras proyectadas en métricas clave",
        dataEntryReduction: "Reducción en tiempo de entrada de datos",
        leadResponseImprovement: "Mejora en tiempo de respuesta a prospectos",
        productivityIncrease: "Aumento en productividad del equipo",
        quickWinsPhase: "Implementación de victorias rápidas",
        mediumTermPhase: "Mejoras de mediano plazo",
        strategicPhase: "Implementación estratégica completa"
      }
    }
  },

  completion: {
    title: "¡Encuesta Completada Exitosamente!",
    subtitle: "Gracias por tomarse el tiempo para proporcionar retroalimentación valiosa sobre su experiencia con Eduscore.",
    completionRate: "Tasa de Finalización",
    questionsAnswered: "Preguntas Respondidas",
    managerSurveyCompleted: "Encuesta Gerencial Completada",
    salesSurveyCompleted: "Encuesta del Equipo de Ventas Completada",
    whatHappensNext: {
      title: "¿Qué sigue?",
      items: [
        "Sus respuestas han sido guardadas de forma segura y serán analizadas con la retroalimentación de otros miembros del equipo",
        "Nuestro sistema identificará puntos críticos clave y oportunidades de mejora",
        "Se generarán perspectivas accionables y recomendaciones para su equipo",
        "Los resultados estarán disponibles en el panel de control analítico dentro de 24 horas"
      ],
      avgCompletionTime: "Tiempo promedio de finalización: {minutes} minutos"
    },
    impact: {
      title: "Su Impacto",
      description: "Su retroalimentación es fundamental para ayudar a mejorar el sistema Eduscore para todo el equipo de admisiones. Basándose en análisis recientes de retroalimentación y datos actuales de encuestas, los equipos típicamente ven:",
      dataEntryReduction: "Reducción en tiempo de entrada de datos",
      leadResponseImprovement: "Mejora en respuesta a prospectos",
      productivityIncrease: "Aumento en productividad"
    },
    actions: {
      viewAnalytics: "Ver Panel de Control Analítico",
      returnHome: "Regresar al Inicio"
    },
    methodology: {
      title: "Metodología de la Encuesta",
      description: "Conozca sobre el enfoque basado en evidencia utilizado en este sistema de retroalimentación",
      analysisFramework: "Marco de Análisis",
      privacySecurity: "Privacidad y Seguridad",
      frameworkItems: [
        "Evaluación del Modelo Kirkpatrick",
        "Metodología Net Promoter Score (NPS)",
        "Análisis de Causa Raíz (RCA)",
        "Técnicas de mapeo de flujos de trabajo"
      ],
      privacyItems: [
        "Opciones de respuesta anónimas disponibles",
        "Almacenamiento seguro de datos locales",
        "No se requiere información personal",
        "Análisis agregado para perspectivas"
      ]
    }
  },

  terminology: {
    crm: "Sistema de Gestión de Relaciones con Clientes",
    lead: "Prospecto",
    followUp: "Seguimiento",
    workflow: "Flujo de Trabajo",
    dashboard: "Panel de Control",
    prospects: "Prospectos",
    enrollment: "Inscripción",
    conversion: "Conversión",
    pipeline: "Canal de Ventas",
    representative: "Representante"
  }
};

// Export default translations
export default spanishTranslations;