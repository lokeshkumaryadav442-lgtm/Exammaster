/*
  # Seed Sample Exams and Questions

  1. Sample Data
    - Add 2 sample exams (General Knowledge and Mathematics)
    - Add questions for each exam with multiple choice options
*/

INSERT INTO exams (id, title, description, duration_minutes, passing_score, is_active)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'General Knowledge Quiz',
    'Test your general knowledge across various topics including history, geography, science, and current affairs.',
    30,
    70,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Mathematics Assessment',
    'Evaluate your mathematical skills with questions on algebra, geometry, and problem-solving.',
    45,
    75,
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (exam_id, question_text, options, correct_answer, points, order_index)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'What is the capital of France?',
    '["London", "Berlin", "Paris", "Madrid"]'::jsonb,
    2,
    1,
    1
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Which planet is known as the Red Planet?',
    '["Venus", "Mars", "Jupiter", "Saturn"]'::jsonb,
    1,
    1,
    2
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Who painted the Mona Lisa?',
    '["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"]'::jsonb,
    2,
    1,
    3
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'What is the largest ocean on Earth?',
    '["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]'::jsonb,
    3,
    1,
    4
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'In which year did World War II end?',
    '["1943", "1944", "1945", "1946"]'::jsonb,
    2,
    1,
    5
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'What is 15 × 8?',
    '["110", "115", "120", "125"]'::jsonb,
    2,
    1,
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'If x + 7 = 15, what is the value of x?',
    '["6", "7", "8", "9"]'::jsonb,
    2,
    1,
    2
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'What is the area of a rectangle with length 12 and width 5?',
    '["50", "55", "60", "65"]'::jsonb,
    2,
    1,
    3
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'What is 25% of 200?',
    '["40", "45", "50", "55"]'::jsonb,
    2,
    1,
    4
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'What is the square root of 144?',
    '["10", "11", "12", "13"]'::jsonb,
    2,
    1,
    5
  )
ON CONFLICT DO NOTHING;