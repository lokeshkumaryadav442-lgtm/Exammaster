/*
  # Add More Exam Topics

  1. New Exams
    - English Language & Grammar
    - Science Fundamentals
    - History & Social Studies
    - Programming Basics
    - Business Management
  
  2. Questions
    - 5 questions per exam covering various difficulty levels
*/

INSERT INTO exams (id, title, description, duration_minutes, passing_score, is_active)
VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    'English Language & Grammar',
    'Test your English proficiency with questions on grammar, vocabulary, reading comprehension, and writing skills.',
    40,
    72,
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Science Fundamentals',
    'Explore basic concepts in physics, chemistry, and biology through comprehensive questions.',
    50,
    70,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'History & Social Studies',
    'Test your knowledge of world history, civilizations, governments, and social systems.',
    45,
    68,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Programming Basics',
    'Assess your understanding of programming concepts, logic, and fundamental coding principles.',
    55,
    75,
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Business Management',
    'Evaluate your knowledge of business principles, management, economics, and organizational behavior.',
    50,
    70,
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (exam_id, question_text, options, correct_answer, points, order_index)
VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    'Which of the following is the correct use of the present perfect tense?',
    '["I am working here since 2020", "I have been working here since 2020", "I am worked here since 2020", "I worked here since 2020"]'::jsonb,
    1,
    1,
    1
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'The word "ubiquitous" means:',
    '["Rare and valuable", "Present everywhere; widespread", "Small and insignificant", "Easily forgotten"]'::jsonb,
    1,
    1,
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Which sentence is grammatically correct?',
    '["Neither the teacher nor the students is ready", "Neither the teacher nor the students are ready", "Neither the teacher or the students are ready", "The teacher nor the students is ready"]'::jsonb,
    1,
    1,
    3
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'What does the acronym "SCUBA" stand for?',
    '["Self Contained Underwater Breathing Apparatus", "Surface Contained Underwater Boat Accessory", "Special Cruise Under Base Activity", "Sea Craft Union Business Association"]'::jsonb,
    0,
    1,
    4
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Identify the adverb in the following sentence: "She spoke quietly during the meeting."',
    '["She", "spoke", "quietly", "meeting"]'::jsonb,
    2,
    1,
    5
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'What is the SI unit of force?',
    '["Kilogram", "Newton", "Joule", "Pascal"]'::jsonb,
    1,
    1,
    1
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Which gas is essential for photosynthesis?',
    '["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"]'::jsonb,
    2,
    1,
    2
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'What is the atomic number of Oxygen?',
    '["6", "8", "10", "12"]'::jsonb,
    1,
    1,
    3
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Which of the following is a renewable energy source?',
    '["Coal", "Natural Gas", "Solar Energy", "Petroleum"]'::jsonb,
    2,
    1,
    4
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'The speed of light is approximately:',
    '["3 million m/s", "300 million m/s", "3 billion m/s", "30 million m/s"]'::jsonb,
    1,
    1,
    5
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'The Renaissance period primarily began in which country?',
    '["France", "Italy", "Spain", "Germany"]'::jsonb,
    1,
    1,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Who was the first President of the United States?',
    '["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"]'::jsonb,
    1,
    1,
    2
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'In which year did World War I begin?',
    '["1912", "1914", "1916", "1918"]'::jsonb,
    1,
    1,
    3
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'The Great Wall of China was built primarily to:',
    '["Promote trade", "Protect from invasions", "Provide transportation", "Demonstrate wealth"]'::jsonb,
    1,
    1,
    4
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Which ancient wonder of the world still stands today?',
    '["Colossus of Rhodes", "Hanging Gardens of Babylon", "Great Pyramid of Giza", "Lighthouse of Alexandria"]'::jsonb,
    2,
    1,
    5
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'What does the "for" loop do in programming?',
    '["Executes code conditionally", "Repeats code a specific number of times", "Defines a function", "Stores data in memory"]'::jsonb,
    1,
    1,
    1
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Which of the following is NOT a programming language?',
    '["Python", "Java", "HTML", "C++"]'::jsonb,
    2,
    1,
    2
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'What is a variable in programming?',
    '["A type of loop", "A named storage location for data", "A function that returns a value", "A syntax error"]'::jsonb,
    1,
    1,
    3
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'What does "API" stand for?',
    '["Application Program Interface", "Advanced Programming Input", "Automated Process Integration", "Application Processing Interpreter"]'::jsonb,
    0,
    1,
    4
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'In object-oriented programming, what is a class?',
    '["A category of functions", "A blueprint for creating objects", "A type of variable", "A method of storing data"]'::jsonb,
    1,
    1,
    5
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'What is the primary goal of management?',
    '["Maximize profit only", "Achieve organizational objectives efficiently", "Minimize costs", "Eliminate all risks"]'::jsonb,
    1,
    1,
    1
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Which economic system relies primarily on market forces?',
    '["Command economy", "Capitalism", "Socialism", "Feudalism"]'::jsonb,
    1,
    1,
    2
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'What does "ROI" stand for?',
    '["Return on Investment", "Revenue on Income", "Rate of Implementation", "Return on Inventory"]'::jsonb,
    0,
    1,
    3
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Leadership style that encourages participation from team members is called:',
    '["Autocratic", "Democratic", "Laissez-faire", "Bureaucratic"]'::jsonb,
    1,
    1,
    4
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'What is supply and demand?',
    '["A business strategy", "The relationship between product availability and consumer desire", "A marketing concept", "A financial tool"]'::jsonb,
    1,
    1,
    5
  )
ON CONFLICT DO NOTHING;