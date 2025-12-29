# ProcessFit - Google Antigravity Build Prompt

Antigravity works best with natural language descriptions. Use this prompt to build the app, then iterate on specific sections.

---

## Main Prompt

```
Create a web application called "ProcessFit" for qualifying business process automation opportunities.

The app has two types of users:
1. Customers - who submit processes they want to automate and track recommendations
2. Admins - who review submissions, score them, and decide which to pursue

---

CUSTOMER EXPERIENCE:

When a customer logs in, they see a dashboard with all the processes their company has submitted. They can:
- Click "Submit New Process" to fill out a form about a process they want to automate
- See the status of each submission (Under Review, Recommendation Ready, etc.)
- See our recommendation once we've reviewed it (Strong Fit, Needs Discovery, Not Right Now)
- Set their own priority ranking for each process (Top Priority, High, Medium, Low)

The submission form collects information in 5 steps:

Step 1 - About the Process:
- Process name (what they call it)
- Description (2-3 sentences about what happens)
- What the team mainly does (data entry, document processing, approvals, follow-ups, reconciliation, reporting, or coordination)
- What they work with (system data, standard documents, complex documents, emails, or a mix)

Step 2 - Scale and Effort:
- Number of people working on this (1, 2-5, 6-15, 16-50, or 50+)
- How much of their time it takes (under 25%, 25-50%, 50-75%, or over 75%)
- Monthly volume (under 500, 500-2000, 2000-10000, 10000-50000, or over 50000)
- How often the work happens (continuous, daily, weekly, or less)

Step 3 - Pain and Priority:
- Why they want to automate (reduce costs, speed up, reduce errors, handle volume, improve experience, or compliance)
- What challenges they face (can select multiple: too slow, errors, volume issues, key person dependency, complaints, compliance risk, no visibility, system limitations, scaling problems)
- Whether it slows down other teams (self-contained, minor delays, regular delays, or major bottleneck)
- How important this is to fix (nice to have, future list, actively looking, or top 3 priority)

Step 4 - Process Details:
- Whether documentation exists (up to date, outdated, tribal knowledge, or none)
- Whether the team can explain the steps (easily, with gaps, partially, or not really)
- How consistent the process is (90%+, 70-90%, 50-70%, or under 50%)
- How many systems involved (1, 2-3, 4-6, or 7+)
- What type of systems (all cloud, mostly cloud, mixed, or mostly legacy)
- What communication is involved (can select multiple: email, Slack/Teams, system notifications, phone, portals, none)

Step 5 - Review:
- Optional additional notes
- Summary of all answers
- Submit button

After submitting, the customer returns to their dashboard and can see the new process with status "New".

---

ADMIN EXPERIENCE:

Admins see a dashboard with ALL processes from ALL companies. They can:
- Filter by company, industry, scores, status, and date
- Search by process name or company
- See summary stats (total processes, new ones, how many to pursue, pipeline value)
- Click into any process to review and score it

The admin detail view has 5 tabs:

Tab 1 - Customer Submission:
Shows everything the customer submitted, organized and read-only.

Tab 2 - Scoring:
Admins set scores using dropdowns:
- Value Score (High >$150K, Medium $75-150K, Low <$75K)
- Feasibility Score (High, Medium, Low)
- Priority Signal (Champion Ready, Interested, Low Urgency)
- Action (Pursue, Discovery, Deprioritize, Pass)
- Status (New, Scoring, Shared with Customer, Pursuing, Won, Lost, Passed)

Show a collapsible guide explaining how to calculate each score based on the customer's answers.

Tab 3 - Business Impact:
A calculator to estimate the annual value. Three sections:
- Financial Impact (cost savings in dollars)
- Efficiency Metrics (time savings in days/hours)
- Accuracy Metrics (error reduction in percentages)

Each section has a table where admins can add rows with: Metric name, Unit, Baseline value, Target value, Annual dollar value.

Show the total potential annual value at the bottom as a big number.

Tab 4 - Systems:
A table where admins can add the specific systems involved:
- System name (like "Oracle", "Salesforce", etc.)
- Access type (cloud, on-premise, VPN required)
- API availability (full API, limited API, no API, unknown)

Tab 5 - Notes:
- Internal notes (only admins can see)
- Customer notes (what the customer will see)
- Recommendation dropdown (Strong Fit, Needs Discovery, Not Right Now)

---

DATA STRUCTURE:

Companies have many users and many processes.
Each process belongs to one company and has business impact metrics and systems as related data.
Users can be either "customer" (sees only their company) or "admin" (sees everything).

---

DESIGN:

Clean, professional SaaS look. Blue primary color. White backgrounds with light gray cards.
Color-coded badges: green for good/high, yellow for medium, red for low/bad.
Section headers with blue backgrounds for the Business Impact calculator sections.
Mobile-friendly for the customer submission form.
Desktop-optimized for the admin dashboard.

---

Start by creating the customer registration and login flow, then the submission form.
```

---

## Follow-up Prompts for Antigravity

### Adding the Admin Dashboard

```
Now create the admin dashboard page.

It should have:

1. A filter bar at the top with dropdowns for:
   - Company (multi-select all companies)
   - Industry
   - Value Score (High, Medium, Low)
   - Feasibility Score (High, Medium, Low)
   - Action (Pursue, Discovery, Deprioritize, Pass)
   - Status
   - A search box
   - Clear filters button

2. Summary cards showing:
   - Total Processes count
   - New (unscored) count
   - Pursue count
   - Total Pipeline Value (sum of annual values for Pursue and Discovery processes)

3. A table listing all processes with columns:
   - Company name
   - Process name
   - Industry
   - Value Score (color badge)
   - Feasibility Score (color badge)
   - Action (color badge)
   - Status
   - Submitted date
   - View button

Make the table sortable by clicking column headers.
Clicking a row should navigate to the process detail page.
```

### Adding the Business Impact Calculator

```
For the Business Impact tab on the admin process detail page:

Create three collapsible sections with blue header bars:

Section A: Financial Impact
- Table with columns: Metric, Unit ($), Baseline, Target, Annual $ Value, Delete button
- Add Metric button to add new rows
- Example metrics: "Cost of undetected errors", "Audit preparation costs"

Section B: Efficiency Metrics  
- Same table structure
- Unit options: Days, Hours, Minutes
- Example metrics: "Time to detect issues", "Hours spent on manual review"

Section C: Accuracy Metrics
- Same table structure
- Unit options: %
- Example metrics: "Detection rate", "Pre-identification rate"

At the bottom, show a summary card with a large dollar amount showing:
"Total Potential Annual $ Value: $XXX,XXX"

This should sum all the Annual $ Value fields from all three sections.

Make it so new rows can be added dynamically and rows can be deleted.
Save changes automatically when values change.
```

### Adding Authentication Rules

```
Add authentication and data access rules:

1. When a user registers, they must select or create a company. Their user record should store their company_id.

2. Customers should only see:
   - Processes belonging to their company
   - Their own user information
   - Customer-facing notes and recommendations (not internal notes)

3. Admins should see:
   - All processes from all companies
   - All user information
   - All notes including internal notes
   - Ability to edit scores, status, and notes

4. The role should be stored in the user record and checked on login to determine which dashboard to show.

5. Protect all admin routes - redirect to customer dashboard if a customer tries to access /admin URLs.
```

### Styling Refinements

```
Update the styling to match this design:

1. The Business Impact sections should have:
   - Blue header bars (#3B82F6) with white text
   - Labels like "A. Financial Impact", "B. Efficiency Metrics", "C. Accuracy Metrics"
   - Clean white table with light gray borders
   - The total value card should have a dollar icon and large text

2. Process status badges:
   - New: gray
   - Scoring: blue
   - Shared with Customer: yellow
   - Pursuing: green
   - Won: dark green
   - Lost: red
   - Passed: gray

3. Score badges:
   - High/Champion Ready/Pursue: green with green text
   - Medium/Interested/Discovery: yellow with yellow text
   - Low/Low Urgency/Pass/Deprioritize: red or gray

4. Form inputs should have clear labels above them, not inside.

5. The multi-step form should show a progress bar at the top indicating current step.
```

---

## Tips for Antigravity

1. **Be specific about data relationships**: Antigravity needs clear understanding of how data connects (companies → users → processes → impacts/systems)

2. **Break into chunks**: If the full prompt is too complex, build customer side first, then admin side

3. **Reference examples**: "Like Stripe's dashboard" or "Similar to Notion's form builder" can help with UI

4. **Iterate on tables**: Dynamic table rows (add/delete) sometimes need refinement - be specific about the interaction

5. **Test auth flows early**: Make sure customer/admin separation works before building detail pages

6. **Ask for specific pages**: If results are incomplete, ask "Now create the /admin/process/:id page with the 5 tabs I described"
