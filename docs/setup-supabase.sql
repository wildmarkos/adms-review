-- Copy and paste this entire script into your Supabase SQL Editor
-- This preserves the EXACT questions from your existing system

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'sales')),
  name TEXT NOT NULL,
  department TEXT,
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_role TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id),
  section TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('likert', 'multiple_choice', 'text', 'ranking', 'percentage', 'checkbox')),
  question_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  options TEXT, -- JSON string for multiple choice and ranking questions
  validation_rules TEXT, -- JSON string
  analysis_tags TEXT,
  UNIQUE(survey_id, question_order)
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id),
  user_id BIGINT REFERENCES users(id),
  session_id TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_complete BOOLEAN DEFAULT false,
  response_time_seconds INTEGER
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  response_id BIGINT NOT NULL REFERENCES responses(id),
  question_id BIGINT NOT NULL REFERENCES questions(id),
  answer_value TEXT,
  answer_numeric REAL,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_survey_date ON responses(survey_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_answers_response_question ON answers(response_id, question_id);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Public read access" ON surveys FOR SELECT USING (true);
CREATE POLICY "Public read access" ON questions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access" ON responses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON answers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);

-- Insert sample users
INSERT INTO users (email, role, name, department, hire_date, is_active) VALUES
('admin@company.com', 'admin', 'Admin User', 'IT', '2023-01-15', true),
('manager1@company.com', 'manager', 'Sarah Johnson', 'Admissions', '2022-03-10', true),
('manager2@company.com', 'manager', 'Michael Chen', 'Admissions', '2021-09-15', true),
('sales1@company.com', 'sales', 'Emma Williams', 'Sales', '2023-02-20', true),
('sales2@company.com', 'sales', 'David Rodriguez', 'Sales', '2023-01-08', true),
('sales3@company.com', 'sales', 'Lisa Brown', 'Sales', '2022-11-12', true)
ON CONFLICT (email) DO NOTHING;

-- Insert surveys
INSERT INTO surveys (id, name, description, target_role, version, is_active) VALUES
(1, 'Manager Feedback Survey', 'Strategic feedback from managers on platform system effectiveness', 'manager', 1, true),
(2, 'Admissions Team Feedback Survey', 'Tactical feedback from admissions advisors on daily workflow', 'sales', 1, true)
ON CONFLICT (id) DO NOTHING;

-- Insert EXACT Manager Survey Questions (Survey ID: 1)
INSERT INTO questions (survey_id, section, question_text, question_type, question_order, is_required, options, validation_rules, analysis_tags) VALUES
-- Section 1: Alineación Estratégica y Objetivos
(1, 'Alineación Estratégica y Objetivos', '¿Qué tan efectivamente apoya Eduscore actualmente los objetivos de inscripción de su equipo?', 'likert', 1, true, null, '{"min": 1, "max": 10}', 'effectiveness,enrollment_support,revenue_impact'),
(1, 'Alineación Estratégica y Objetivos', '¿Qué brechas específicas de capacidades impactan el logro de objetivos?', 'text', 2, false, null, '{"word_limit": 200}', 'capability_gaps,improvement_areas'),
(1, 'Alineación Estratégica y Objetivos', 'Califique la alineación entre las capacidades de Eduscore y sus objetivos empresariales:', 'likert', 3, true, null, '{"min": 1, "max": 10}', 'alignment,business_objectives'),
(1, 'Alineación Estratégica y Objetivos', '¿Qué porcentaje de su tiempo semanal se dedica a problemas relacionados con el sistema vs. planificación estratégica?', 'multiple_choice', 4, true, '["0-10%", "11-25%", "26-40%", "41-60%", "60%+"]', null, 'time_allocation,system_burden'),
(1, 'Alineación Estratégica y Objetivos', '¿Qué tan confiado se siente usted en los pronósticos de inscripción que puede generar a partir de los datos actuales?', 'likert', 5, true, null, '{"min": 1, "max": 10}', 'forecasting,data_confidence,data_quality'),

-- Section 2: Gestión del Rendimiento del Equipo
(1, 'Gestión del Rendimiento del Equipo', '¿Qué tan efectivamente puede usted monitorear el rendimiento individual de los representantes en Eduscore?', 'likert', 6, true, null, '{"min": 1, "max": 10}', 'performance_monitoring,visibility'),
(1, 'Gestión del Rendimiento del Equipo', 'Califique la calidad de los datos de rendimiento disponibles para decisiones de capacitación:', 'likert', 7, true, null, '{"min": 1, "max": 10}', 'coaching_data,data_quality'),
(1, 'Gestión del Rendimiento del Equipo', '¿Qué oportunidades de capacitación está perdiendo debido a las limitaciones del sistema?', 'text', 8, false, null, '{"word_limit": 250}', 'coaching_gaps,missed_opportunities'),
(1, 'Gestión del Rendimiento del Equipo', '¿Qué tan fácilmente puede usted identificar a sus mejores y peores ejecutantes?', 'multiple_choice', 9, true, '["Inmediatamente disponible", "Requiere algún análisis", "Requiere seguimiento manual", "Casi imposible"]', null, 'performance_identification,accessibility'),

-- Section 3: Eficiencia de Procesos y Flujo de Trabajo
(1, 'Eficiencia de Procesos y Flujo de Trabajo', 'Describa su proceso actual de prospecto a inscripción e identifique los mayores cuellos de botella:', 'text', 10, true, null, '{"word_limit": 300}', 'workflow_mapping,bottlenecks'),
(1, 'Eficiencia de Procesos y Flujo de Trabajo', '¿Cuántas soluciones manuales temporales ha creado su equipo para compensar las limitaciones de Eduscore?', 'multiple_choice', 11, true, '["0", "1-3", "4-7", "8-12", "13+"]', null, 'workarounds,system_limitations'),
(1, 'Eficiencia de Procesos y Flujo de Trabajo', 'Enumere las 3 soluciones temporales más críticas que utiliza su equipo:', 'text', 12, false, null, '{"word_limit": 200}', 'critical_workarounds,process_gaps'),
(1, 'Eficiencia de Procesos y Flujo de Trabajo', 'Califique el impacto del uso de Excel en la integridad de datos y la coordinación del equipo:', 'likert', 13, true, null, '{"min": 1, "max": 10}', 'excel_impact,data_integrity'),
(1, 'Eficiencia de Procesos y Flujo de Trabajo', '¿Con qué frecuencia se pierden prospectos debido a las limitaciones del sistema?', 'multiple_choice', 14, true, '["Nunca", "Raramente (mensual)", "A veces (semanal)", "Frecuentemente (diario)", "Constantemente"]', null, 'lead_loss,system_reliability'),

-- Section 4: Asignación de Recursos y ROI
(1, 'Asignación de Recursos y ROI', '¿Qué porcentaje del tiempo de su equipo se dedica a la entrada de datos vs. actividades reales de venta? (% Entrada de Datos + % Venta + % Otro = 100%)', 'percentage', 15, true, null, '{"sum_to_100": true}', 'time_allocation,productivity,time_efficiency'),
(1, 'Asignación de Recursos y ROI', 'Estime qué porcentaje de prospectos calificados se pierden debido a retrasos relacionados con el sistema:', 'multiple_choice', 16, true, '["0-5%", "6-15%", "16-25%", "26-40%", "40%+"]', null, 'lead_loss_rate,system_impact,lead_conversion,revenue_impact'),
(1, 'Asignación de Recursos y ROI', 'Califique la rentabilidad de su conjunto actual de tecnologías:', 'likert', 17, true, null, '{"min": 1, "max": 10}', 'cost_effectiveness,roi'),
(1, 'Asignación de Recursos y ROI', 'Si tuviera presupuesto adicional para mejoras del sistema, clasifique sus principales prioridades: (1=más alta, 5=más baja)', 'ranking', 18, true, '["Funcionalidad del Sistema de Gestión de Relaciones con Clientes", "Reportes/análisis", "Capacidades de integración", "Capacitación de usuarios", "Herramientas adicionales"]', null, 'improvement_priorities,budget_allocation')
ON CONFLICT (survey_id, question_order) DO NOTHING;

-- Insert EXACT Sales Team Survey Questions (Survey ID: 2)
INSERT INTO questions (survey_id, section, question_text, question_type, question_order, is_required, options, validation_rules, analysis_tags) VALUES
-- Section 1: Eficiencia del Flujo de Trabajo Diario
(2, 'Eficiencia del Flujo de Trabajo Diario', '¿Cuántos sistemas/herramientas diferentes utiliza usted diariamente para la gestión de prospectos?', 'multiple_choice', 1, true, '["1-2", "3-4", "5-6", "7-8", "9+"]', null, 'system_complexity,tool_count'),
(2, 'Eficiencia del Flujo de Trabajo Diario', 'Enumere sus 3 herramientas más utilizadas:', 'text', 2, false, null, '{"word_limit": 100}', 'primary_tools,workflow'),
(2, 'Eficiencia del Flujo de Trabajo Diario', 'Califique qué tan fácilmente puede usted encontrar la información necesaria para llamadas a prospectos:', 'likert', 3, true, null, '{"min": 1, "max": 10}', 'information_accessibility,call_preparation'),
(2, 'Eficiencia del Flujo de Trabajo Diario', '¿Qué porcentaje de su día se dedica a tareas administrativas vs. actividades de venta? (% Admin + % Venta + % Otro = 100%)', 'percentage', 4, true, null, '{"sum_to_100": true}', 'time_allocation,admin_burden,time_efficiency'),
(2, 'Eficiencia del Flujo de Trabajo Diario', '¿Con qué frecuencia tiene que iniciar sesión en múltiples sistemas para completar una tarea?', 'multiple_choice', 5, true, '["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]', null, 'system_fragmentation,efficiency'),

-- Section 2: Gestión de Prospectos y Seguimiento
(2, 'Gestión de Prospectos y Seguimiento', '¿Qué tan confiado se siente usted de que ningún prospecto se pierda en su canal de ventas?', 'likert', 6, true, null, '{"min": 1, "max": 10}', 'lead_tracking_confidence,pipeline_reliability,lead_conversion'),
(2, 'Gestión de Prospectos y Seguimiento', 'Califique la efectividad de los recordatorios automáticos y sistemas de seguimiento:', 'likert', 7, true, null, '{"min": 1, "max": 10}', 'automation_effectiveness,follow_up_quality'),
(2, 'Gestión de Prospectos y Seguimiento', '¿Qué métodos manuales de seguimiento ha creado usted fuera de Eduscore? (Seleccione todos los que apliquen)', 'checkbox', 8, false, '["Hojas de cálculo Excel", "Notas en papel", "Recordatorios telefónicos", "Calendario personal", "Carpetas de correo", "Otro Sistema de Gestión de Relaciones con Clientes", "Notas adhesivas", "Ninguno"]', null, 'manual_workarounds,tracking_methods'),
(2, 'Gestión de Prospectos y Seguimiento', 'Describa su sistema manual de seguimiento más importante:', 'text', 9, false, null, '{"word_limit": 150}', 'critical_workarounds,process_gaps'),
(2, 'Gestión de Prospectos y Seguimiento', '¿Qué tan rápidamente puede usted acceder al historial completo de interacciones de un prospecto?', 'multiple_choice', 10, true, '["Instantáneo", "<30 segundos", "1-2 minutos", "3-5 minutos", ">5 minutos"]', null, 'data_accessibility,interaction_history'),

-- Section 3: Comunicación y Colaboración
(2, 'Comunicación y Colaboración', '¿Qué tan efectivamente puede usted compartir información de prospectos con colegas?', 'likert', 11, true, null, '{"min": 1, "max": 10}', 'information_sharing,collaboration'),
(2, 'Comunicación y Colaboración', 'Califique la calidad de las transferencias entre miembros del equipo:', 'likert', 12, true, null, '{"min": 1, "max": 10}', 'handoff_quality,team_coordination'),
(2, 'Comunicación y Colaboración', '¿Qué brechas de comunicación existen entre usted y la gerencia respecto a su rendimiento? (Seleccione todos los que apliquen)', 'checkbox', 13, false, '["Expectativas poco claras", "Retroalimentación limitada", "Métricas inexactas", "Falta de reconocimiento de logros", "Capacitación tardía", "Prioridades conflictivas", "Ninguna"]', null, 'communication_gaps,management_feedback'),
(2, 'Comunicación y Colaboración', '¿Con qué frecuencia usted y su gerente revisan juntos su canal de ventas?', 'multiple_choice', 14, true, '["Diariamente", "Semanalmente", "Quincenalmente", "Mensualmente", "Raramente", "Nunca"]', null, 'pipeline_reviews,manager_engagement'),

-- Section 4: Barreras de Conversión y Efectividad de Ventas
(2, 'Barreras de Conversión y Efectividad de Ventas', '¿En qué etapa pierde usted más prospectos? (Estime porcentajes - debe sumar 100%)', 'percentage', 15, true, null, '{"sum_to_100": true}', 'conversion_stages,loss_analysis'),
(2, 'Barreras de Conversión y Efectividad de Ventas', 'Clasifique la importancia de la información que desearía tener durante conversaciones con prospectos: (1=más importante, 6=menos importante)', 'ranking', 16, true, '["Detalles de interacciones previas", "Investigación de competidores", "Cronograma del prospecto", "Información de presupuesto", "Proceso de toma de decisiones", "Motivaciones personales"]', null, 'information_needs,conversation_effectiveness'),
(2, 'Barreras de Conversión y Efectividad de Ventas', 'Califique qué tan bien le ayuda Eduscore a personalizar las interacciones con prospectos:', 'likert', 17, true, null, '{"min": 1, "max": 10}', 'personalization,interaction_quality'),
(2, 'Barreras de Conversión y Efectividad de Ventas', '¿Cuál es su mayor frustración al tratar de cerrar una inscripción?', 'text', 18, false, null, '{"word_limit": 200}', 'closing_frustrations,barriers'),

-- Section 5: Diagnóstico Avanzado
(2, 'Diagnóstico Avanzado', 'Clasifique sus 5 principales frustraciones diarias y califique su impacto en el éxito de inscripciones (escala 1-10):', 'text', 19, false, null, '{"word_limit": 300}', 'pain_points,impact_assessment'),
(2, 'Diagnóstico Avanzado', '¿Qué herramientas/características desearía usted que tuviera Eduscore que ha visto en otros lugares?', 'text', 20, false, null, '{"word_limit": 200}', 'feature_requests,competitive_analysis'),
(2, 'Diagnóstico Avanzado', 'Si pudiera eliminar una tarea diaria relacionada con Eduscore, ¿cuál sería y cuánto tiempo le ahorraría diariamente?', 'text', 21, false, null, '{"word_limit": 150}', 'task_elimination,time_savings')
ON CONFLICT (survey_id, question_order) DO NOTHING;