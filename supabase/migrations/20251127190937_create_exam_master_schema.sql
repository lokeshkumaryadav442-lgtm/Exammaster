/*
  # Exam Master Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, nullable for guest users)
      - `full_name` (text)
      - `is_guest` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `exams`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration_minutes` (integer)
      - `passing_score` (integer)
      - `created_at` (timestamptz)
      - `is_active` (boolean, default true)
    
    - `questions`
      - `id` (uuid, primary key)
      - `exam_id` (uuid, references exams)
      - `question_text` (text)
      - `options` (jsonb, array of options)
      - `correct_answer` (integer, index of correct option)
      - `points` (integer, default 1)
      - `order_index` (integer)
    
    - `exam_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `exam_id` (uuid, references exams)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      - `score` (integer, nullable)
      - `total_points` (integer)
      - `percentage` (numeric, nullable)
      - `passed` (boolean, nullable)
      - `video_monitoring_enabled` (boolean, default true)
    
    - `exam_answers`
      - `id` (uuid, primary key)
      - `attempt_id` (uuid, references exam_attempts)
      - `question_id` (uuid, references questions)
      - `selected_answer` (integer)
      - `is_correct` (boolean)
      - `answered_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and guest users
    - Users can only access their own data
    - Exams and questions are readable by all authenticated users
    - Only users can create attempts and answers for themselves
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text NOT NULL,
  is_guest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL,
  passing_score integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active exams"
  ON exams FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  points integer DEFAULT 1,
  order_index integer NOT NULL
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exams
      WHERE exams.id = questions.exam_id
      AND exams.is_active = true
    )
  );

CREATE TABLE IF NOT EXISTS exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES exams ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer,
  total_points integer NOT NULL,
  percentage numeric,
  passed boolean,
  video_monitoring_enabled boolean DEFAULT true
);

ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
  ON exam_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
  ON exam_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS exam_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES exam_attempts ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions ON DELETE CASCADE,
  selected_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  answered_at timestamptz DEFAULT now()
);

ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own answers"
  ON exam_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exam_attempts
      WHERE exam_attempts.id = exam_answers.attempt_id
      AND exam_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own answers"
  ON exam_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM exam_attempts
      WHERE exam_attempts.id = exam_answers.attempt_id
      AND exam_attempts.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_attempt_id ON exam_answers(attempt_id);