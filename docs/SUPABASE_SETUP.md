# Supabase Remote Database Setup Guide

This guide will help you set up Supabase as a remote database for the ADMS Feedback System.

## Quick Setup (5 minutes)

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new project

### 2. Get Your Connection Details
1. In your Supabase dashboard, go to Settings > API
2. Find these two values:
   - **Project URL**: https://telibffpfnttamfvxydz.supabase.co
   - **anon/public key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long string)

**IMPORTANT**:
- ❌ DO NOT use the PostgreSQL connection string (`postgresql://postgres:...`)
- ❌ The anon key is NOT your database password
- ✅ Use the API URL and anon key from Settings > API page

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase details:
   ```env
   DATABASE_TYPE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://telibffpfnttamfvxydz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

**Example for your project:**
- URL: `https://telibffpfnttamfvxydz.supabase.co`
- Anon key: Find this in your Supabase dashboard under Settings > API

**⚠️ Common Mistake:**
You might see a PostgreSQL connection string like:
`postgresql://postgres:[YOUR-PASSWORD]@db.telibffpfnttamfvxydz.supabase.co:5432/postgres`

**Don't use this!** We're using the Supabase JavaScript client, not direct PostgreSQL connection.

### 4. Create Database Tables
1. In Supabase dashboard, go to SQL Editor
2. Run this SQL to create all required tables:

```sql
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
```

### 5. Seed Initial Data
Run this SQL to add initial surveys and questions:

```sql
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
```

### 6. Test the Connection
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000/analytics
3. You should see "Connected to Supabase (remote)" in the dashboard

## Switching Between SQLite and Supabase

You can easily switch between local SQLite and remote Supabase:

### Use SQLite (Local)
```env
DATABASE_TYPE=sqlite
```

### Use Supabase (Remote)
```env
DATABASE_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Benefits of Supabase

✅ **Remote Access**: Data accessible from anywhere  
✅ **Real-time**: Built-in real-time subscriptions  
✅ **Scalable**: PostgreSQL database that grows with you  
✅ **Secure**: Row Level Security and API authentication  
✅ **Free Tier**: Generous free tier for small projects  
✅ **Dashboard**: Web interface to view and manage data  

## Security Considerations

- The current setup allows public read/write access for simplicity
- For production, consider implementing proper authentication
- Adjust RLS policies based on your security requirements
- Use environment variables for sensitive keys

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check your URL and API key
2. **Tables Don't Exist**: Run the SQL setup script
3. **Permission Denied**: Check RLS policies
4. **Environment Variables**: Ensure `.env.local` is not committed to git

### Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Check the console for error messages