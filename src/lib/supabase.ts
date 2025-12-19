import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string | null;
  full_name: string;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
};

export type Exam = {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  created_at: string;
  is_active: boolean;
};

export type Question = {
  id: string;
  exam_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  points: number;
  order_index: number;
};

export type ExamAttempt = {
  id: string;
  user_id: string;
  exam_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  total_points: number;
  percentage: number | null;
  passed: boolean | null;
  video_monitoring_enabled: boolean;
};

export type ExamAnswer = {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
  answered_at: string;
};
