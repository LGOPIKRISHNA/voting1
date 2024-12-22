/*
  # Initial Schema Setup for Voting Platform

  1. New Tables
    - `profiles`: Stores user profile information and roles
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `polls`: Stores voting polls
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `options` (jsonb array)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `votes`: Stores user votes
      - `id` (uuid, primary key)
      - `poll_id` (uuid, references polls)
      - `user_id` (uuid, references profiles)
      - `selected_option` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and voter access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'voter')),
  created_at timestamptz DEFAULT now()
);

-- Create polls table
CREATE TABLE polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  options jsonb NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  selected_option text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Polls policies
CREATE POLICY "Polls are viewable by everyone"
  ON polls FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create polls"
  ON polls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update own polls"
  ON polls FOR UPDATE
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Votes policies
CREATE POLICY "Users can view all votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Users can vote once per poll during poll time"
  ON votes FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM votes
      WHERE votes.poll_id = poll_id
      AND votes.user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM polls
      WHERE polls.id = poll_id
      AND now() BETWEEN polls.start_time AND polls.end_time
    )
  );