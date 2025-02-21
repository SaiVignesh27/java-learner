/*
  # Learning Tracker Schema

  1. New Tables
    - `topics`
      - `id` (uuid, primary key)
      - `week_number` (integer)
      - `category` (text)
      - `name` (text)
      - `description` (text)
      - `order` (integer)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `topic_id` (uuid, references topics)
      - `status` (text)
      - `notes` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create topics table
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number integer NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user progress table
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  topic_id uuid REFERENCES topics NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  notes text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Topics are viewable by all authenticated users"
  ON topics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert initial topics data
INSERT INTO topics (week_number, category, name, description, order_number) VALUES
-- Week 1
(1, 'HTML', 'Basic Structure', 'Basic Structure of an HTML Page', 1),
(1, 'HTML', 'Elements & Attributes', 'Understanding HTML Elements and Attributes', 2),
(1, 'HTML', 'Forms & Tables', 'Forms, Tables, and Lists', 3),
(1, 'HTML', 'Semantic HTML', 'Semantic HTML and Accessibility', 4),
(1, 'CSS', 'Box Model', 'Box Model, Flexbox, Grid', 5),
(1, 'CSS', 'Responsive Design', 'Media Queries & Responsive Design', 6),
(1, 'CSS', 'Animations', 'CSS Animations & Transitions', 7),
(1, 'JavaScript', 'Basics', 'Variables, Data Types, Functions', 8),
(1, 'JavaScript', 'DOM', 'Events & DOM Manipulation', 9),
(1, 'JavaScript', 'ES6 Basics', 'Loops, ES6 Basics', 10),

-- Week 2
(2, 'JavaScript', 'ES6 Features', 'Spread, Rest, Promises, Async/Await', 11),
(2, 'JavaScript', 'Advanced DOM', 'Event Delegation, Intersection Observer API', 12),
(2, 'JavaScript', 'Storage', 'Local & Session Storage', 13),

-- Week 3
(3, 'React', 'React Basics', 'JSX, Components, Props, State, Hooks', 14),
(3, 'React', 'React Lifecycle', 'React Lifecycle Methods & Event Handling', 15),

-- Week 4
(4, 'React', 'React Router', 'Navigation, Protected Routes', 16),
(4, 'React', 'State Management', 'Redux, Context API', 17),

-- Week 5
(5, 'Java', 'Core Java', 'OOP, Exception Handling, Streams', 18),
(5, 'Spring', 'Spring Boot Basics', 'REST APIs, MySQL, JPA', 19),

-- Week 6
(6, 'Spring', 'Spring Boot Advanced', 'JWT Authentication, Security, Logging', 20),
(6, 'Database', 'ORM', 'SQL, Hibernate, JPA', 21),

-- Week 7
(7, 'Integration', 'Frontend Backend', 'Connecting Frontend with Backend, API Calls, CORS Issues', 22),
(7, 'Deployment', 'Cloud Deploy', 'Deployment to Vercel, Netlify, Render, AWS', 23);