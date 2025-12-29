-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  role TEXT DEFAULT 'customer',
  company_name TEXT,
  full_name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Processes Table
CREATE TABLE IF NOT EXISTS processes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  company TEXT NOT NULL,
  industry TEXT,
  
  -- Step 1: Identity & Activity
  team_activity TEXT,
  work_type TEXT,
  
  -- Step 2: Scale & Effort
  team_size TEXT,
  time_spent TEXT,
  monthly_volume TEXT,
  frequency TEXT,
  
  -- Step 3: Pain & Priority
  automation_goals TEXT,
  challenges TEXT, -- JSON array
  bottleneck_effect TEXT,
  importance TEXT,
  
  -- Step 4: Process Details
  documentation_status TEXT,
  explainability TEXT,
  consistency_rate TEXT,
  systems_count TEXT,
  systems_type TEXT,
  comm_channels TEXT, -- JSON array
  
  -- Admin Scoring & Status
  status TEXT DEFAULT 'New',
  recommendation TEXT DEFAULT '-',
  priority TEXT DEFAULT 'Medium', -- Customer set priority
  value_score TEXT, -- Admin set: High/Med/Low
  feasibility_score TEXT, -- Admin set: High/Med/Low
  priority_signal TEXT, -- Admin set: Champion Ready/Interested/Low Urgency
  action_signal TEXT, -- Admin set: Pursue/Discovery/Deprioritize/Pass
  
  -- Impact Data
  impact TEXT, -- JSON blob for dynamic rows (financial, efficiency, accuracy)
  systems_detail TEXT, -- JSON blob for the systems list in Admin Tab 4
  potential_value REAL DEFAULT 0,
  
  -- Metadata
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT,
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);
