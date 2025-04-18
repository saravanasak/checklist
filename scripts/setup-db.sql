-- Create checklist_submissions table
CREATE TABLE IF NOT EXISTS checklist_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  department TEXT NOT NULL,
  start_date DATE NOT NULL,
  submission_date DATE NOT NULL,
  signature TEXT NOT NULL,
  signature_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('complete', 'incomplete', 'pending')),
  completion_percentage INTEGER NOT NULL,
  q1 TEXT NOT NULL CHECK (q1 IN ('Yes', 'No')),
  q2 TEXT NOT NULL CHECK (q2 IN ('Yes', 'No')),
  q3 TEXT NOT NULL CHECK (q3 IN ('Yes', 'No')),
  q4 TEXT NOT NULL CHECK (q4 IN ('Yes', 'No')),
  q5 TEXT NOT NULL CHECK (q5 IN ('Yes', 'No')),
  q6 TEXT[] NOT NULL,
  q7 TEXT NOT NULL CHECK (q7 IN ('Yes', 'No')),
  q8 TEXT NOT NULL CHECK (q8 IN ('Yes', 'No')),
  q9 TEXT NOT NULL CHECK (q9 IN ('Yes', 'No')),
  q10 TEXT NOT NULL CHECK (q10 IN ('Yes', 'No', 'Choose not to use personal device for work purposes')),
  q11 TEXT NOT NULL CHECK (q11 IN ('Yes', 'No')),
  q12 TEXT NOT NULL CHECK (q12 IN ('Yes', 'No')),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on checklist_submissions table
DROP TRIGGER IF EXISTS update_checklist_submissions_updated_at ON checklist_submissions;
CREATE TRIGGER update_checklist_submissions_updated_at
BEFORE UPDATE ON checklist_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE checklist_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (for demo purposes)
CREATE POLICY "Allow anonymous access" ON checklist_submissions
FOR ALL USING (true);
