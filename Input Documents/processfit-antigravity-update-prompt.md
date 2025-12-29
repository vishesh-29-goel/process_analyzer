# ProcessFit Questionnaire Update - Antigravity Implementation Guide

## Overview

This document provides complete instructions for updating the ProcessFit customer questionnaire in Antigravity. The update introduces a comprehensive 100-point scoring system with three dimensions: Value Score (40 pts), Feasibility Score (40 pts), and Priority Signal (20 pts).

**Key Changes from Previous Version:**
- New question structure (25 base questions + conditional follow-ups)
- Direct cost input instead of time-based calculations
- Dynamic system inventory table
- Conditional logic for follow-up questions
- Backend scoring calculations (hidden from customers)
- Automated analysis results page after submission

---

## Part 1: Database Schema Updates

### Prompt 1.1: Update Database Tables

```
Update the database schema to support the new ProcessFit questionnaire. Create or modify these tables:

**Table: process_submissions**
- id (UUID, primary key)
- organization_name (text, required)
- submitter_name (text, required)
- submitter_email (text, required)
- process_name (text, required)
- industry (text, required)
- process_description (text, required, min 100 chars)
- team_size (text, required)
- monthly_hours (integer, required)
- monthly_volume (text, required)
- monthly_labor_cost (decimal, required)
- frequency (text, required)
- automation_goals (text array)
- challenges (text array)
- downstream_impact (text, required)
- importance (text, required)
- documentation_status (text, required)
- documentation_percentage (integer, nullable)
- can_articulate (text, nullable)
- consistency (text, required)
- deviation_frequency (text, nullable)
- deviation_causes (text array, nullable)
- documentation_coverage (text, nullable)
- team_activities (text array)
- document_types (text array, nullable)
- judgment_frequency (text, nullable)
- systems_count (text, required)
- system_types (text array)
- communication_types (text array)
- process_structure (text, required)
- touchpoint_count (text, required)
- additional_notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**Table: process_systems** (child of process_submissions)
- id (UUID, primary key)
- process_id (UUID, foreign key to process_submissions)
- system_name (text, required)
- access_type (text, required)
- api_availability (text, required)

**Table: process_scores** (child of process_submissions)
- id (UUID, primary key)
- process_id (UUID, foreign key to process_submissions)
- value_score (integer)
- feasibility_score (integer)
- priority_signal (integer)
- total_score (integer)
- action (text)
- priority_level (text)
- annual_labor_cost (decimal)
- cost_per_run (decimal)
- fte_hours (integer)
- fte_count (decimal)
- arr_flag (text)
- red_flags (text array)
- yellow_flags (text array)
- recommendation_text (text)
- calculated_at (timestamp)

Add appropriate indexes and foreign key constraints. Enable row-level security.
```

---

## Part 2: Questionnaire Form Structure

### Prompt 2.1: Create Form Container and Navigation

```
Create a multi-step questionnaire form with the following structure:

**Form Container:**
- Title: "ProcessFit Assessment"
- Subtitle: "Evaluate your process for automation potential"
- Progress indicator showing current section (1 of 7)
- Back and Next navigation buttons
- Submit button on final step

**Sections (7 total):**
1. Basic Information (5 questions)
2. Volume & Scale (3 questions)
3. Cost & Value (2 questions)
4. Pain & Priority (4 questions)
5. Process Characteristics (8 questions with conditionals)
6. Process Complexity (6 questions with conditionals)
7. Additional Context (1 question + review)

**Form Behavior:**
- Validate required fields before allowing navigation to next section
- Save progress to local storage on each section change
- Show validation errors inline below fields
- Scroll to top when changing sections
```

### Prompt 2.2: Section 1 - Basic Information

```
Build Section 1: Basic Information with these fields:

**Q1: Organization Name**
- Type: Text input
- Required: Yes
- Placeholder: "Enter your company name"

**Q2: Your Name**
- Type: Text input
- Required: Yes
- Placeholder: "Enter your full name"

**Q3: Your Email**
- Type: Email input
- Required: Yes
- Placeholder: "name@company.com"
- Validation: Must be valid email format

**Q4: Process Name**
- Type: Text input
- Required: Yes
- Placeholder: "e.g., AP Invoice Processing, Contract Review"
- Helper text: "Give this process a clear, descriptive name"

**Q5: Industry**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - Finance & Banking
  - Healthcare & Pharma
  - Manufacturing
  - Retail & E-commerce
  - Logistics & Supply Chain
  - Technology & SaaS
  - Insurance
  - Professional Services
  - Other

Style these as clean, modern form fields with subtle borders and focus states.
```

### Prompt 2.3: Section 1 - Process Description (Q6)

```
Add the Process Description field to Section 1:

**Q6: Process Description**
- Type: Textarea (large, 6 rows minimum)
- Required: Yes
- Character limit: 10,000 characters
- Minimum length: 100 characters
- Show character counter

**Prompt text (display above field):**
"Please describe this process in detail, including:
• What triggers the process to start?
• What are the main steps from beginning to end?
• What systems or tools are involved at each step?
• What is the final output or outcome?
• Who is involved (roles, not names)?"

**Placeholder text:**
"Example: The process starts when we receive an invoice via email from a vendor. First, our AP team downloads the invoice and checks if there's a matching PO in Oracle. If there's a match, they validate the amounts and line items. Next, they enter the invoice details into NetSuite, attaching the PDF. Then they route it to the department manager for approval via email. Once approved, they update the status in NetSuite and schedule payment. If there's no PO or amounts don't match, they follow up with the vendor via email and copy the procurement team in Slack. The process ends when the invoice is either approved and scheduled for payment or rejected and archived."

**Validation:**
- If under 100 characters, show error: "Please provide more detail about the process steps, systems involved, and how information flows from start to finish."
```

### Prompt 2.4: Section 2 - Volume & Scale

```
Build Section 2: Volume & Scale with these fields:

**Q7: How many people work on this process?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - 1 person
  - 2-5 people
  - 6-15 people
  - 16-50 people
  - More than 50 people

**Q8: How many total hours per month does the team spend on this process?**
- Type: Number input
- Required: Yes
- Placeholder: "200"
- Helper text: "Total hours across all team members per month. Example: If 5 people each spend 40 hours/month, enter 200"
- Unit label: "hours/month"
- Minimum: 1
- Maximum: 50000

**Q9: Roughly how many items do you process per month?**
- Type: Single-select dropdown
- Required: Yes
- Helper text: "Items = individual transactions, requests, documents, records, etc."
- Options:
  - Less than 500
  - 500 to 2,000
  - 2,000 to 10,000
  - 10,000 to 50,000
  - More than 50,000
```

### Prompt 2.5: Section 3 - Cost & Value

```
Build Section 3: Cost & Value with these fields:

**Q10: What is the total monthly labor cost for running this process?**
- Type: Number input with currency prefix
- Required: Yes
- Prefix: "$"
- Placeholder: "10000"
- Helper text: "Include salaries, benefits, and overhead for time spent on this process. Example: If 5 people at $60/hour work 200 hours/month total: $12,000"
- Minimum: 0
- Format: Display with comma separators as user types

**Q11: How often does this work happen?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - Throughout the day as things come in
  - Multiple times per day
  - Once a day in batches
  - A few times per week
  - Weekly
  - Monthly
  - Quarterly
  - Ad-hoc
```

### Prompt 2.6: Section 4 - Pain & Priority

```
Build Section 4: Pain & Priority with these fields:

**Q12: Why do you want to automate this process?**
- Type: Multi-select checkboxes
- Required: At least 1 selection
- Options:
  - Reduce costs or headcount
  - Speed things up
  - Reduce mistakes and rework
  - Handle more volume without hiring
  - Improve experience for customers or vendors
  - Meet compliance or audit requirements
  - Free up team for higher-value work
  - Other

**Q13: What challenges do you face today?**
- Type: Multi-select checkboxes
- Required: At least 1 selection
- Options:
  - Takes too long
  - Too many errors
  - Cannot keep up with volume
  - Only certain people know how to do it
  - Causes complaints from others
  - Creates compliance or audit risk
  - Lacks visibility or tracking
  - System limitations
  - Difficult to scale
  - High rework rates
  - Expensive to maintain

**Q14: Does this process slow down other teams?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - No - it is mostly self-contained
  - Sometimes causes minor delays
  - Regularly holds up other work
  - Major bottleneck - others cannot move forward without it

**Q15: How important is fixing this to your organization?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - Nice to have but not urgent
  - On our list for the future
  - We are actively looking for solutions
  - One of our top 3 priorities right now
```

### Prompt 2.7: Section 5 - Process Characteristics (Documentation)

```
Build Section 5: Process Characteristics - Part 1 (Documentation & Consistency) with these fields:

**Q16: Is there written documentation for this process?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - Yes - we have up-to-date instructions
  - Partial - documentation exists but is outdated or incomplete
  - Not really - people just know how to do it
  - No documentation exists

**Conditional Q16a (show only if Q16 = "Partial"):**
- Label: "What percentage of the process is documented?"
- Type: Slider (0-100%)
- Default: 50%
- Show percentage value next to slider

**Conditional Q16b (show only if Q16 = "Not really" or "No documentation exists"):**
- Label: "Could your team explain the steps clearly to someone new?"
- Type: Single-select dropdown
- Options:
  - Yes - easily
  - Mostly - with some gaps
  - Partially - lots of exceptions
  - No - too complex or variable

**Q17: How consistently do people follow the same steps?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - Very consistent - almost everyone does it the same way (90%+)
  - Mostly consistent with some variation (70-90%)
  - Varies quite a bit from person to person (50-70%)
  - Everyone does it differently (under 50%)

**Conditional Q17a (show only if Q17 = "Varies quite a bit" or "Everyone does it differently"):**
- Label: "Are there frequent deviations from the standard process?"
- Type: Single-select dropdown
- Options:
  - No deviations
  - Rare (<5%)
  - Occasional (5-15%)
  - Frequent (15-30%)
  - Very frequent (>30%)

**Conditional Q17b (show only if Q17a = "Occasional", "Frequent", or "Very frequent"):**
- Label: "What causes these deviations?"
- Type: Multi-select checkboxes
- Options:
  - Customer-specific requirements
  - System limitations
  - Business exceptions
  - Data quality issues
  - Unclear guidelines
  - Individual preferences
  - Other

**Q18 (show only if Q16 = "Yes" or "Partial"):**
- Label: "Does the current documentation cover all steps and edge cases exhaustively?"
- Type: Single-select dropdown
- Options:
  - Yes - covers everything comprehensively
  - Mostly - covers main flows well
  - Partially - missing some edge cases
  - No - many gaps and exceptions
```

### Prompt 2.8: Section 6 - Process Complexity (Activities)

```
Build Section 6: Process Complexity - Part 1 (Activities & Systems) with these fields:

**Q19: What does your team mainly do in this process?**
- Type: Multi-select checkboxes
- Required: At least 1 selection
- Options:
  - Enter or update data in systems
  - Read documents and extract information
  - Review and approve requests
  - Send emails or follow up with people
  - Match and reconcile records across systems
  - Generate reports or filings
  - Coordinate with customers or vendors
  - Make complex judgment calls
  - Investigate exceptions or issues

**Conditional Q19a (show only if "Read documents and extract information" is selected):**
- Label: "Which types of documents?"
- Type: Multi-select checkboxes
- Options:
  - Invoices
  - Receipts
  - Emails
  - Reports
  - Contracts
  - Excel/Spreadsheets
  - Purchase Orders
  - Forms
  - PDFs
  - Statements
  - Legal documents
  - Handwritten notes
  - Images/Scans
  - Other

**Conditional Q19b (show only if "Make complex judgment calls" or "Investigate exceptions or issues" is selected):**
- Label: "How often do these judgment calls occur?"
- Type: Single-select dropdown
- Options:
  - Rarely (less than 5% of requests)
  - Occasionally (5-15% of requests)
  - Regularly (15-30% of requests)
  - Frequently (more than 30% of requests)

**Q20: How many systems or tools does this process touch?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - 1 system
  - 2-3 systems
  - 4-6 systems
  - 7-10 systems
  - More than 10 systems
```

### Prompt 2.9: Section 6 - System Inventory Table (Q20a)

```
Add a dynamic system inventory table after Q20:

**Q20a: System Inventory**
- Label: "Add all systems involved in this process"
- Type: Dynamic table with add/remove rows
- Required: At least 1 system

**Table Columns:**

Column 1: System Name
- Type: Text input
- Placeholder: "e.g., Oracle, Salesforce, NetSuite"
- Width: 40%

Column 2: Type of Access
- Type: Dropdown
- Width: 30%
- Options:
  - Cloud platform (web-based)
  - Browser-based application
  - Installed desktop software
  - On-premise server
  - VPN required
  - Legacy system
  - Internal tool
  - Other

Column 3: API Availability
- Type: Dropdown
- Width: 25%
- Options:
  - Yes - Full API access
  - Yes - Limited API access
  - No API available
  - Unknown

Column 4: Actions
- Type: Delete button (trash icon)
- Width: 5%

**Table Footer:**
- "+ Add System" button (blue text, plus icon)

**Behavior:**
- Start with 1 empty row
- Validate that at least 1 system is added with name filled
- Maximum 20 systems
- Delete button removes the row (confirm if more than 1 row exists)
```

### Prompt 2.10: Section 6 - Remaining Questions

```
Add the remaining questions to Section 6:

**Q21: What type of systems are these?**
- Type: Multi-select checkboxes
- Required: At least 1 selection
- Options:
  - Cloud or web-based systems
  - Installed desktop software
  - Older legacy systems on servers
  - Custom internal tools
  - ERP systems (SAP, Oracle, etc.)
  - CRM systems (Salesforce, HubSpot, etc.)
  - Financial systems (NetSuite, QuickBooks, etc.)
  - Communication platforms (Email, Slack, Teams)
  - Document management systems
  - Databases

**Q22: What communication is involved in this process?**
- Type: Multi-select checkboxes
- Required: Can select "None"
- Options:
  - Email
  - Slack or Teams messages
  - System notifications
  - Phone calls
  - In-person meetings
  - SMS/Text
  - Customer or vendor portals
  - Video calls
  - None - No communication needed

**Q23: How structured and repeatable is this process?**
- Type: Single-select dropdown
- Required: Yes
- Options:
  - High - Very structured with clear rules (90%+ follow same steps)
  - Medium - Somewhat structured with some judgment calls (70-90% follow same steps)
  - Low - Highly variable and judgment-based (less than 70% follow same steps)

**Q24: How many touchpoints are there from beginning to end of the process?**
- Type: Single-select dropdown
- Required: Yes
- Helper text: "Touchpoints = distinct steps where action is taken (data entry, approval, system check, email sent, etc.)"
- Options:
  - 1-3 touchpoints
  - 4-6 touchpoints
  - 7-10 touchpoints
  - 11-15 touchpoints
  - More than 15 touchpoints
```

### Prompt 2.11: Section 7 - Additional Context & Review

```
Build Section 7: Additional Context & Review:

**Q25: Anything else we should know?**
- Type: Textarea (3 rows)
- Required: No
- Character limit: 500 characters
- Show character counter
- Placeholder: "Share any additional context about this process that might be helpful"

**Review Summary:**
After Q25, display a collapsible "Review Your Answers" section showing:

- Organization: [Q1 value]
- Contact: [Q2 value] ([Q3 value])
- Process: [Q4 value]
- Industry: [Q5 value]
- Team: [Q7 value] spending [Q8 value] hours/month
- Volume: [Q9 value] items/month
- Cost: $[Q10 value]/month
- Frequency: [Q11 value]
- Importance: [Q15 value]
- Systems: [Q20 value] ([count from Q20a table] listed)

**Submit Button:**
- Text: "Submit Assessment"
- Style: Primary button, full width
- On click: Validate all fields, save to database, calculate scores, redirect to results
```

---

## Part 3: Backend Scoring Logic

### Prompt 3.1: Value Score Calculation

```
Create backend scoring functions. First, implement the Value Score calculation:

**Value Score (40 points maximum)**

Components:
1. Q7 (Team Size): 0-5 points
   - 1 person → 0 points
   - 2-5 people → 2 points
   - 6-15 people → 4 points
   - 16-50 people → 5 points
   - More than 50 people → 5 points

2. Q8 (Monthly Hours): 0-5 points
   - Less than 40 hours → 0 points
   - 40-80 hours → 1 point
   - 81-160 hours → 2 points
   - 161-320 hours → 3 points
   - 321-500 hours → 4 points
   - More than 500 hours → 5 points

3. Q10 (Monthly Labor Cost → Annual): 0-30 points
   - Annual < $75,000 → 0 points
   - $75,000 - $149,999 → 10 points
   - $150,000 - $249,999 → 15 points
   - $250,000 - $499,999 → 20 points
   - $500,000 - $999,999 → 25 points
   - $1,000,000+ → 30 points

4. Boosts:
   - Q14 = "Major bottleneck" → +5 points
   - Q15 = "Top 3 priority" → +3 points

**Formula:**
Value_Score = Q7_Score + Q8_Score + Q10_Score + Boosts
Cap at 40 maximum

**ARR Flags (store separately):**
- Annual < $75K → "⚠️ Below Minimum Threshold"
- $75K-$149K → "✓ Medium Value"
- $150K-$249K → "✓ High Value"
- $250K-$499K → "⭐ Great Fit"
- $500K-$999K → "⭐ Great Fit"
- $1M+ → "🌟 Exceptional Value"
```

### Prompt 3.2: Feasibility Score Calculation

```
Implement the Feasibility Score calculation:

**Feasibility Score (40 points maximum)**

Components:

1. Q16 (Documentation): 0-8 points base
   - Yes - up-to-date → 8 points
   - Partial → 5 points (adjust with Q16a)
   - Not really → 2 points (may adjust with Q16b)
   - No documentation → 0 points (may adjust with Q16b)

   Q16a adjustment (if shown):
   - 75-100% → keep 5 points
   - 50-74% → 4 points
   - 25-49% → 3 points
   - 0-24% → 2 points

   Q16b adjustment (if shown):
   - Yes - easily → 4 points
   - Mostly - with gaps → 3 points
   - Partially - lots of exceptions → 1 point
   - No - too complex → 0 points

   Documentation Penalty:
   - If Q16 = "Not really" or "No documentation" → subtract 5 from final Feasibility Score

2. Q17 (Consistency): 0-10 points
   - Very consistent (90%+) → 10 points
   - Mostly consistent (70-90%) → 7 points
   - Varies quite a bit (50-70%) → 4 points
   - Everyone does it differently (<50%) → 0 points

   Q17a penalty (if shown):
   - Very frequent (>30%) → subtract 3 points from Q17 score

3. Q18 (Coverage): 0-2 points (skip if Q16 = "Not really" or "No documentation")
   - Yes - comprehensive → 2 points
   - Mostly - covers main flows → 1 point
   - Partially - missing edge cases → 0 points
   - No - many gaps → 0 points

4. Q19 (Activities): 0-8 points
   Score each selected activity:
   - Enter or update data → +3
   - Read documents and extract → +3
   - Send emails or follow up → +3
   - Match and reconcile records → +2
   - Generate reports or filings → +2
   - Review and approve requests → +1
   - Coordinate with customers/vendors → +1
   - Make complex judgment calls → -2
   - Investigate exceptions → -2
   
   Sum all, cap at 8 points max, floor at 0

   Q19a adjustment (if shown):
   - Standard docs only (Invoices, Receipts, POs, Forms) → +2
   - Mix of standard + complex → +0
   - Mostly complex (Contracts, Legal, Handwritten) → -2

   Q19b penalty (if shown):
   - Rarely (<5%) → no change
   - Occasionally (5-15%) → -1
   - Regularly (15-30%) → -2
   - Frequently (>30%) → -3

5. Q20 (Systems Count): 0-5 points
   - 1 system → 5 points
   - 2-3 systems → 4 points
   - 4-6 systems → 3 points
   - 7-10 systems → 1 point
   - More than 10 systems → 0 points

6. Q20a (System Details): 0-8 points total
   
   A. System Access Score (0-4):
   - All cloud → 4 points
   - Majority cloud + some VPN/browser → 3 points
   - Mix of cloud and installed/on-premise → 2 points
   - Majority on-premise or legacy → 1 point
   - Any legacy + on-premise → 0 points

   B. API Availability Score (0-4):
   - All "Full API" → 4 points
   - All "Full" or "Limited" → 3 points
   - Mix of Yes/No/Unknown → 2 points
   - Majority "No API" or "Unknown" → 1 point
   - All "No API available" → 0 points

7. Q22 (Communication): 0-3 points
   - None selected → 3 points
   - Only Email/Slack/Teams/System notifications → 3 points
   - 2-3 types (from above) → 2 points
   - Includes Phone/In-person/Video calls → 1 point
   - Phone + multiple other types → 0 points

8. Q24 (Touchpoints): 0-4 points
   - 1-3 touchpoints → 4 points
   - 4-6 touchpoints → 3 points
   - 7-10 touchpoints → 2 points
   - 11-15 touchpoints → 1 point
   - More than 15 touchpoints → 0 points

**Formula:**
Feasibility_Score = Documentation + Consistency + Coverage + Activities + Systems_Count + System_Details + Communication + Touchpoints + Documentation_Penalty

Cap at 40, floor at 0
```

### Prompt 3.3: Priority Signal Calculation

```
Implement the Priority Signal calculation:

**Priority Signal (20 points maximum)**

Components:

1. Q13 (Pain Intensity): 2-8 points
   - 1-2 challenges selected → 2 points
   - 3-4 challenges selected → 4 points
   - 5-6 challenges selected → 6 points
   - 7+ challenges selected → 8 points

2. Q14 (Bottleneck): 0-6 points
   - No - self-contained → 0 points
   - Sometimes causes minor delays → 2 points
   - Regularly holds up other work → 4 points
   - Major bottleneck → 6 points

3. Q15 (Urgency): 0-6 points
   - Nice to have but not urgent → 0 points
   - On our list for the future → 2 points
   - We are actively looking → 4 points
   - One of our top 3 priorities → 6 points

**Formula:**
Priority_Signal = Pain_Intensity + Bottleneck + Urgency
Cap at 20 maximum
```

### Prompt 3.4: Final Action Determination

```
Implement the final action determination logic:

**Thresholds:**
- Value_High = 30 (75% of 40)
- Feasibility_High = 30 (75% of 40)
- Priority_High = 15 (75% of 20)
- Value_Medium = 24 (60% of 40)
- Feasibility_Medium = 24 (60% of 40)
- Priority_Medium = 12 (60% of 20)

**Action Matrix:**

1. PURSUE (Green):
   - Value ≥ 30 AND Feasibility ≥ 30 AND Priority ≥ 15

2. DISCOVERY (Yellow):
   - Value ≥ 30 AND Feasibility < 30 (feasibility questions)
   - Value 24-29 AND Feasibility ≥ 30 AND Priority ≥ 12 (value validation)
   - All other combinations not covered by PURSUE, DEPRIORITIZE, or PASS

3. DEPRIORITIZE (Orange):
   - Value ≥ 30 AND Feasibility ≥ 30 AND Priority < 15

4. PASS (Red):
   - Value < 24
   - Feasibility < 24 AND Priority < 12

**Hard Blocker Override:**
If Annual_Labor_Cost < $75,000 → PASS (regardless of other scores)

**Store in database:**
- action: "PURSUE" | "DISCOVERY" | "DEPRIORITIZE" | "PASS"
- priority_level: Description of why this action was chosen
- color: "green" | "yellow" | "orange" | "red"
```

### Prompt 3.5: Flag Generation

```
Implement the flag generation logic:

**Red Flags (must address):**

1. Documentation flags:
   - Q16 = "No documentation exists" → "❌ No process documentation - SOP creation required before automation"
   - Q16 = "Not really" AND Q16b = "No - too complex" → "❌ Team cannot articulate process steps - deep discovery needed"

2. Consistency flags:
   - Q17 = "Everyone does it differently" → "❌ Very low process consistency (<50%) - standardization required first"

3. Complexity flags:
   - Q19 includes "Make complex judgment calls" AND Q19b = "Frequently (>30%)" → "❌ High judgment complexity (>30%) - may not reach 95% accuracy"

4. Integration blockers (from Q20a):
   - For each system: if access = "Legacy system" AND api = "No API available" → "❌ Integration blocker: [System Name] is a legacy system with no API"

5. ARR flag:
   - Annual_Labor_Cost < $75,000 → "❌ Process value below minimum threshold (ARR < $75K)"

**Yellow Flags (considerations):**

1. Documentation:
   - Q16 = "Partial" AND Q16a < 50 → "⚠️ Less than 50% documented - comprehensive documentation needed"

2. Consistency:
   - Q17a = "Very frequent (>30%)" → "⚠️ High exception rate (>30%) - process redesign may be needed"

3. Systems:
   - Q20 = "More than 10 systems" → "⚠️ Very high integration complexity (10+ systems)"
   - 50%+ systems have "No API available" → "⚠️ Limited API access across systems - integration may be slower"

4. Consistency validation:
   - If Q17 and Q23 don't align (e.g., Q17 = "Very consistent" but Q23 = "Low") → "⚠️ Inconsistent responses on process consistency - clarification needed"

5. Value mismatch:
   - Q15 = "Top 3 priority" AND Value_Score < 24 → "⚠️ Mismatch: Customer indicates high priority but process value is below threshold"
   - Annual_Labor_Cost ≥ $250K AND Q7 = "1 person" or "2-5 people" → "⚠️ Unusual: High ARR with small team size - validate labor cost calculation"
```

---

## Part 4: Analysis Results Page

### Prompt 4.1: Results Page Layout

```
Create the Analysis Results Page that displays after form submission:

**Page Header:**
- Title: "ProcessFit Assessment Results"
- Subtitle: "Assessment for [Process Name] at [Organization Name]"
- Submitted by: [Name] ([Email])
- Date: [Submission timestamp]

**Overall Recommendation Card (prominent, top of page):**
- Action badge with color (PURSUE/DISCOVERY/DEPRIORITIZE/PASS)
- Priority Level text
- Total Score: [X] / 100

**Score Breakdown Section (3 columns or stacked cards):**

Card 1: Value Score
- Score: [X] / 40
- Progress bar (colored by tier)
- Tier badge: High/Medium/Low
- Key metric: "ARR Potential: $[Annual_Labor_Cost]"
- ARR Flag displayed

Card 2: Feasibility Score
- Score: [X] / 40
- Progress bar (colored by tier)
- Tier badge: High/Medium/Low
- Key metric: "Systems: [X], Touchpoints: [Y]"

Card 3: Priority Signal
- Score: [X] / 20
- Progress bar (colored by tier)
- Tier badge: High/Medium/Low
- Key metric: "Customer Priority: [Q15 answer]"

**Key Metrics Table:**
| Metric | Value |
|--------|-------|
| Estimated Annual Labor Cost | $[calculated] |
| Cost Per Run | $[calculated] |
| Monthly Volume | [Q9 answer] |
| Monthly FTE Hours | [Q8 answer] hours ([calculated] FTEs) |
| Team Size | [Q7 answer] |
| Process Frequency | [Q11 answer] |
```

### Prompt 4.2: Results Page - Flags and Recommendations

```
Add flags and recommendations sections to the results page:

**Critical Flags Section:**

Red Flags Card (if any exist):
- Header: "🔴 Red Flags - Must Address"
- Red/pink background
- List each red flag with bullet points

Yellow Flags Card (if any exist):
- Header: "🟡 Yellow Flags - Considerations"
- Yellow/amber background
- List each yellow flag with bullet points

If no flags: Show "✅ No critical flags identified"

**Recommendation Details Section:**

Based on Action, show appropriate message:

For PURSUE (Green):
"This process is an excellent fit for Pace automation. It meets our value threshold, has strong feasibility indicators, and demonstrates high customer urgency.

**Next Steps:** Schedule kickoff call to begin contracting and implementation planning. Target timeline: 4-6 weeks to 95% accuracy."

For DISCOVERY (Yellow):
"This process shows promise but requires additional discovery to validate [specific concerns based on flags].

**Key Questions to Address:**
[List top 2-3 concerns]

**Next Steps:** Schedule discovery call to dive deeper into [specific areas]."

For DEPRIORITIZE (Orange):
"This process is technically feasible but lacks strong customer urgency signals. While we could automate it successfully, it's not currently a top priority.

**Next Steps:** Keep in pipeline for future consideration. Revisit when customer urgency increases."

For PASS (Red):
"This process does not meet current qualification criteria.

**Primary Reason:** [Specific reason - insufficient value/low feasibility/both]

**Next Steps:** [Recommendation based on blockers - e.g., 'Suggest process standardization first' or 'Consider alternative solutions']"
```

### Prompt 4.3: Results Page - Process Details

```
Add process details sections to the results page:

**Process Characteristics Section (collapsible):**

"What the team does:"
- List items from Q19

"Documents involved:" (if Q19a was answered)
- List items from Q19a
- Or "No document processing identified"

"Systems:" (show Q20 answer + table from Q20a)
| System Name | Access Type | API Availability |
|-------------|-------------|------------------|
| [from Q20a] | [from Q20a] | [from Q20a] |

"Communication types:"
- List items from Q22
- Or "None"

"Main challenges:"
- List items from Q13

**Pace Primitive Fit Analysis Section:**

"Based on the process characteristics, this automation would leverage:"

High-Strength Primitives (confident delivery):
- [List based on Q19 HIGH-scoring items]
- Example: "Document extraction - 95%+ accuracy expected"
- Example: "System data entry - deterministic automation"

Medium-Strength Primitives (manageable with care):
- [List based on Q19 MEDIUM-scoring items]
- Example: "Cross-system reconciliation"

Challenging Areas (may require workarounds):
- [List based on Q19 LOW-scoring items]
- Example: "Complex judgment calls - human-in-loop required"

"Estimated Complexity:" [Low/Medium/High]
"Automation Confidence:" [Very High/High/Medium/Low]

**Process Description Section (collapsible, expanded by default):**
- Header: "Process Description (from submission)"
- Show full Q6 text

**Additional Context Section (if Q25 was answered):**
- Header: "Additional Notes"
- Show Q25 text
- Or "None provided"
```

### Prompt 4.4: Results Page - Actions

```
Add action buttons to the results page:

**Page Footer Actions:**

Primary Button: "Start New Assessment"
- Navigates to fresh questionnaire form (not to the last submission)
- Clears any local storage form data

Secondary Button: "Download PDF Report"
- Generates PDF of the results page
- Includes all sections

Secondary Button: "Share Results"
- Copies shareable link to clipboard
- Shows toast: "Link copied!"

**Navigation Note:**
When user clicks browser back button, they should land on "Start New Assessment" page, NOT return to the questionnaire with their previous answers.

**Auto-save behavior:**
- Results are automatically saved to database on submission
- Results can be retrieved via unique submission ID
```

---

## Part 5: Form Validation and UX

### Prompt 5.1: Form Validation Rules

```
Implement comprehensive form validation:

**Real-time Validation:**
- Email format (Q3)
- Minimum character count for Process Description (Q6) - show counter
- Number fields accept only positive numbers (Q8, Q10)

**On Section Navigation:**
Before allowing navigation to next section, validate all required fields in current section:
- Show inline error message below each invalid field
- Scroll to first error
- Highlight invalid fields with red border

**Error Messages:**
- Required field empty: "This field is required"
- Email invalid: "Please enter a valid email address"
- Process description too short: "Please provide at least 100 characters describing your process"
- Number invalid: "Please enter a valid number"
- No selection (multi-select): "Please select at least one option"
- System table empty: "Please add at least one system"

**On Submit:**
- Validate all sections
- If any errors, navigate to first section with errors
- Show summary of errors at top of page
```

### Prompt 5.2: Progress Saving and Recovery

```
Implement progress saving:

**Auto-save to Local Storage:**
- Save form state after each field change
- Save current section/step
- Key: "processfit_draft_[timestamp]"

**Recovery Prompt:**
On page load, if draft exists:
- Show modal: "You have an unsaved assessment. Would you like to continue where you left off?"
- "Continue" button: Load draft data
- "Start Fresh" button: Clear draft, show empty form

**Clear Draft:**
- On successful submission, clear local storage
- On "Start New Assessment" click, clear local storage

**Session Timeout:**
- Drafts expire after 7 days
- Show warning if loading expired draft
```

### Prompt 5.3: Conditional Field Display

```
Implement conditional field logic:

**Conditional Display Rules:**

Q16a (Documentation Percentage Slider):
- Show ONLY if Q16 = "Partial"
- Hide and clear value otherwise

Q16b (Can Articulate):
- Show ONLY if Q16 = "Not really" OR "No documentation exists"
- Hide and clear value otherwise

Q17a (Deviation Frequency):
- Show ONLY if Q17 = "Varies quite a bit" OR "Everyone does it differently"
- Hide and clear value otherwise

Q17b (Deviation Causes):
- Show ONLY if Q17a = "Occasional" OR "Frequent" OR "Very frequent"
- Hide and clear value otherwise

Q18 (Documentation Coverage):
- Show ONLY if Q16 = "Yes" OR "Partial"
- Skip and don't score otherwise

Q19a (Document Types):
- Show ONLY if Q19 includes "Read documents and extract information"
- Hide and clear value otherwise

Q19b (Judgment Frequency):
- Show ONLY if Q19 includes "Make complex judgment calls" OR "Investigate exceptions or issues"
- Hide and clear value otherwise

**Animation:**
- Use smooth slide-down animation when showing conditional fields
- Use slide-up animation when hiding
- Duration: 200ms
```

---

## Part 6: Styling and Polish

### Prompt 6.1: Visual Design System

```
Apply consistent visual design:

**Color Palette:**
- Primary: #2563EB (blue) - buttons, links, progress
- Success/Pursue: #10B981 (green)
- Warning/Discovery: #F59E0B (amber)
- Caution/Deprioritize: #F97316 (orange)
- Error/Pass: #EF4444 (red)
- Background: #F9FAFB (light gray)
- Card background: #FFFFFF
- Text: #111827 (dark gray)
- Secondary text: #6B7280 (medium gray)

**Typography:**
- Headings: Inter or system font, semibold
- Body: Inter or system font, regular
- Form labels: 14px, medium weight
- Helper text: 12px, regular, gray

**Spacing:**
- Section padding: 24px
- Field margin-bottom: 20px
- Card padding: 20px
- Button padding: 12px 24px

**Components:**
- Cards: White background, subtle shadow, 8px border radius
- Buttons: Rounded corners (6px), hover states
- Inputs: Light gray border, focus ring in primary color
- Dropdowns: Match input styling
- Checkboxes: Custom styled, primary color when checked
- Progress bar: Rounded, animated fill

**Responsive:**
- Mobile: Single column, full-width cards
- Tablet: 2-column grid for score cards
- Desktop: 3-column grid for score cards, sidebar navigation option
```

### Prompt 6.2: Loading and Feedback States

```
Implement loading and feedback states:

**Form Submission:**
- Show loading spinner on submit button
- Disable all form interactions
- Show progress message: "Calculating your assessment..."

**Score Calculation:**
- Brief loading state (1-2 seconds minimum for perceived work)
- Animate score values counting up on results page

**Results Page Load:**
- Skeleton loading for cards while data loads
- Fade-in animation for content

**Success Feedback:**
- Toast notification: "Assessment submitted successfully"
- Green checkmark animation

**Error Handling:**
- Toast notification for errors: "Something went wrong. Please try again."
- Retry button for failed submissions
- Don't lose form data on error

**Validation Feedback:**
- Shake animation on invalid fields
- Green checkmark on valid fields (optional)
```

---

## Part 7: Testing Checklist

### Prompt 7.1: Test Scenarios

```
Create test scenarios for QA:

**Happy Path Tests:**

1. Complete submission - PURSUE result
   - Fill all fields with high-value answers
   - 6-15 people, 400 hours/month, $50,000/month
   - Full documentation, 90% consistency
   - All cloud systems with APIs
   - Expect: PURSUE action, green badge, 80+ total score

2. Complete submission - DISCOVERY result
   - Fill with medium values
   - Good value but low feasibility (no documentation)
   - Expect: DISCOVERY action, yellow badge

3. Complete submission - PASS result
   - 1 person, 20 hours/month, $2,000/month
   - No documentation, low consistency
   - Expect: PASS action, red badge, ARR flag

**Conditional Logic Tests:**

4. Documentation conditionals
   - Select "Partial" → Q16a slider should appear
   - Select "No documentation" → Q16b should appear
   - Change back to "Yes" → conditional fields should hide

5. Activity conditionals
   - Select "Read documents" → Q19a should appear
   - Select "Make judgment calls" → Q19b should appear
   - Deselect → conditional fields should hide

**Validation Tests:**

6. Required field validation
   - Try to proceed with empty required fields
   - Expect: Error messages, blocked navigation

7. Email validation
   - Enter invalid email format
   - Expect: Inline error message

8. System table validation
   - Try to submit with empty system table
   - Expect: Error requiring at least 1 system

**Edge Cases:**

9. Maximum values
   - Enter 50,000 for monthly hours
   - Enter 10,000,000 for monthly cost
   - Expect: Proper handling, no overflow

10. Minimum description
    - Enter exactly 100 characters
    - Expect: Passes validation

11. Session recovery
    - Fill half the form, close tab
    - Reopen → Expect recovery prompt
```

---

## Summary

This document provides a complete specification for updating the ProcessFit questionnaire in Antigravity. The key changes include:

1. **25 base questions** organized into 7 sections
2. **Conditional follow-up questions** based on user responses
3. **Dynamic system inventory table** for capturing system details
4. **100-point scoring system** with three dimensions
5. **Automated action determination** (PURSUE/DISCOVERY/DEPRIORITIZE/PASS)
6. **Red and yellow flag generation** for risk identification
7. **Comprehensive results page** with recommendations

The scoring system is designed to:
- Flag processes with ARR ≥ $250K as "Great Fit"
- Pass processes with ARR < $75K (below threshold)
- Balance value, feasibility, and customer priority
- Identify specific blockers and concerns

Implementation should proceed section by section, testing each component before moving to the next. The database schema should be implemented first, followed by the form structure, then scoring logic, and finally the results page.
