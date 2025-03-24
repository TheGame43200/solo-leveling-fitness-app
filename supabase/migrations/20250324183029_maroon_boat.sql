/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, matches auth.users.id)
      - `name` (text, nullable)
      - `email` (text, not null)
      - `age` (integer, nullable)
      - `weight` (float, nullable)
      - `height` (integer, nullable)
      - `gender` (text, nullable)
      - `coaching_style` (text, nullable)
      - `rank` (text, not null, default 'E')
      - `points` (integer, not null, default 0)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `profiles` table
    - Add policy for authenticated users to read and update their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text NOT NULL,
  age integer,
  weight float,
  height integer,
  gender text CHECK (gender IN ('male', 'female')),
  coaching_style text CHECK (coaching_style IN ('bienveillant', 'strict', 'equilibre')),
  rank text NOT NULL DEFAULT 'E' CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S')),
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);