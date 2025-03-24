/*
  # Create workout history table

  1. New Tables
    - `workout_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text, not null)
      - `date` (timestamptz, default now())
      - `duration` (integer, seconds)
      - `points_earned` (integer)
      - `completed` (boolean)
      - `data` (jsonb, stores workout details)
  2. Security
    - Enable RLS on `workout_history` table
    - Add policy for authenticated users to read and insert their own workouts
*/

-- Create workout_history table
CREATE TABLE IF NOT EXISTS workout_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  date timestamptz DEFAULT now(),
  duration integer NOT NULL, -- in seconds
  points_earned integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  data jsonb NOT NULL DEFAULT '{}'::jsonb -- stores exercise details, reps, sets, etc.
);

-- Enable Row Level Security
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own workout history"
  ON workout_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout records"
  ON workout_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS workout_history_user_id_idx ON workout_history(user_id);
CREATE INDEX IF NOT EXISTS workout_history_date_idx ON workout_history(date DESC);