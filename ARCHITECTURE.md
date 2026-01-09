# 📊 System Architecture & Data Flow

## Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  index.html (Main Form)                                     │
│  ├─ styles.css (Styling)                                    │
│  └─ script.js (Logic)                                       │
│                                                             │
│  login.html (Admin Auth)                                    │
│  └─ Validates credentials                                   │
│                                                             │
│  admin.html (Dashboard)                                     │
│  ├─ admin.css (Styling)                                     │
│  └─ admin.js (Logic)                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     DATA STORAGE LAYER                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  localStorage (Browser Storage)                             │
│  ├─ Key: 'churchInterviews'                                │
│  ├─ Value: Array of interview objects                      │
│  └─ Persists across browser sessions                       │
│                                                             │
│  sessionStorage (Temporary)                                 │
│  ├─ Key: 'adminLoggedIn'                                   │
│  ├─ Key: 'adminLoginTime'                                  │
│  └─ Clears when browser closes                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      TESTING LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  quick-test.html - Interactive testing                      │
│  test-storage.html - Storage verification                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Data Flow: Submit Interview

```
┌──────────────┐
│   User       │
│  fills form  │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  1. User clicks "Submit Interview"       │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  2. saveForm() called                    │
│     - Gathers all form data              │
│     - Creates formData object            │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  3. validateForm(formData)               │
│     ✓ First Name required                │
│     ✓ Last Name required                 │
│     ✓ Date required                      │
│     ✓ Interviewer required               │
│     ✓ Ethics Response required           │
│     ✓ Final Decision required            │
└──────┬───────────────────────────────────┘
       │
       ├─ Invalid ──→ [Show Error Notification]
       │
       ↓ Valid
┌──────────────────────────────────────────┐
│  4. saveToHistory(formData)              │
│     - Get existing interviews            │
│     - Add unique ID (INT-timestamp)      │
│     - Add savedAt timestamp              │
│     - Push to interviews array           │
│     - Save to localStorage               │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  5. Success!                             │
│     ✅ Show success notification         │
│     ✅ Clear auto-save                   │
│     ✅ Offer to reset form               │
│     ❌ NO JSON DOWNLOAD                  │
└──────────────────────────────────────────┘
```

---

## 👨‍💼 Data Flow: View in Admin

```
┌──────────────┐
│    Admin     │
│ opens login  │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  1. login.html loaded                    │
│     - Enter: Elroi16                     │
│     - Enter: Elro1andPh1l2026@           │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  2. Credentials validated                │
│     - Check hardcoded credentials        │
│     - Set sessionStorage:                │
│       • adminLoggedIn = true             │
│       • adminLoginTime = timestamp       │
│       • adminUsername = Elroi16          │
└──────┬───────────────────────────────────┘
       │
       ├─ Invalid ──→ [Show Error]
       │
       ↓ Valid
┌──────────────────────────────────────────┐
│  3. Redirect to admin.html               │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  4. admin.html loads                     │
│     - Check session validity             │
│     - Load data from localStorage        │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  5. loadDashboard()                      │
│     - Read 'churchInterviews'            │
│     - Parse JSON array                   │
│     - Update statistics                  │
│     - Display interview cards            │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  6. Admin can:                           │
│     ✓ View all interviews                │
│     ✓ Search by name/interviewer         │
│     ✓ Filter by date/recommendation      │
│     ✓ Sort by various fields             │
│     ✓ View detailed modal                │
│     ✓ Export individual interviews       │
└──────────────────────────────────────────┘
```

---

## 🗄️ localStorage Data Structure

```javascript
// Key: 'churchInterviews'
// Value: JSON string of array

[
  {
    id: "INT-1736467200000",
    savedAt: "2026-01-09T10:30:00.000Z",
    timestamp: "2026-01-09T10:30:00.000Z",
    basicInfo: {
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      date: "2026-01-09",
      interviewer: "Pastor Smith"
    },
    spiritualAssessment: {
      bornAgain: true,
      activeChurch: true,
      integrity: true,
      obedient: true,
      communication: true
    },
    administrativeSkills: {
      skill1: 8,  // Record keeping
      skill2: 7,  // Office organization
      skill3: 9,  // Confidentiality
      skill4: 8,  // Computer skills
      skill5: 7   // Attention to detail
    },
    financialSkills: {
      skill1: 8,  // Accounting knowledge
      skill2: 9,  // Budgeting
      skill3: 7,  // Financial accuracy
      skill4: 8,  // Fund integrity
      skill5: 9   // Problem solving
    },
    ethicsCheck: "I understand the importance...",
    finalDecision: {
      recommendation: "recommend",  // or "strongly-recommend" or "not-recommend"
      remarks: "Strong candidate...",
      interviewerSignature: "John Smith",
      signatureDate: "2026-01-09"
    },
    scores: {
      administrative: 39,  // Out of 50
      financial: 41,       // Out of 50
      total: 80            // Out of 100
    }
  },
  // ... more interviews
]
```

---

## 🔐 Security Model

```
┌─────────────────────────────────────────┐
│         PUBLIC ACCESS (Anyone)          │
├─────────────────────────────────────────┤
│  • index.html - Interview form          │
│  • Can submit interviews                │
│  • Data stored locally                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      AUTHENTICATION REQUIRED            │
├─────────────────────────────────────────┤
│  • login.html - Admin login             │
│  • Credentials:                         │
│    - Username: Elroi16                  │
│    - Password: Elro1andPh1l2026@        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      SESSION VALIDATION                 │
├─────────────────────────────────────────┤
│  • Check sessionStorage                 │
│  • Verify login timestamp               │
│  • Session expires after 4 hours        │
│  • Redirect to login if invalid         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         PROTECTED ACCESS (Admin)        │
├─────────────────────────────────────────┤
│  • admin.html - Dashboard               │
│  • View all interviews                  │
│  • Search, filter, export               │
│  • Access to all historical data        │
└─────────────────────────────────────────┘
```

---

## 📂 File Organization

```
church-interview/
│
├── Core Application
│   ├── index.html          [Main interview form]
│   ├── styles.css          [Form styling]
│   ├── script.js           [Form logic & validation]
│   ├── login.html          [Admin authentication]
│   ├── admin.html          [Admin dashboard]
│   ├── admin.css           [Dashboard styling]
│   └── admin.js            [Dashboard logic]
│
├── Testing Tools
│   ├── quick-test.html     [Interactive test interface]
│   └── test-storage.html   [Storage verification]
│
├── Documentation
│   ├── README.md                   [Main overview]
│   ├── READY_TO_TEST.md           [Quick start guide]
│   ├── FIX_SUMMARY.md             [What was fixed]
│   ├── TESTING_GUIDE.md           [How to test]
│   ├── VERIFICATION_CHECKLIST.md  [Test checklist]
│   ├── ADMIN_GUIDE.md             [Admin usage]
│   └── DEPLOYMENT.md              [Deployment info]
│
├── Assets
│   └── favicon.svg         [Church logo icon]
│
└── Deployment
    └── .github/workflows/deploy.yml  [Auto-deploy config]
```

---

## 🔄 Validation Flow

```
                    User Input
                        ↓
        ┌───────────────────────────┐
        │   Basic Info Validation   │
        ├───────────────────────────┤
        │ ✓ First Name?             │
        │ ✓ Last Name?              │
        │ ✓ Date?                   │
        │ ✓ Interviewer?            │
        └───────────┬───────────────┘
                    ↓
        ┌───────────────────────────┐
        │ Spiritual Assessment      │
        ├───────────────────────────┤
        │ ⚪ Optional               │
        │ Records as-is             │
        └───────────┬───────────────┘
                    ↓
        ┌───────────────────────────┐
        │ Skills Assessment         │
        ├───────────────────────────┤
        │ ⚪ Optional               │
        │ Defaults to 0 if empty    │
        └───────────┬───────────────┘
                    ↓
        ┌───────────────────────────┐
        │ Ethics & Decision         │
        ├───────────────────────────┤
        │ ✓ Ethics Response?        │
        │ ✓ Final Recommendation?   │
        └───────────┬───────────────┘
                    ↓
            All Valid? ───Yes──→ [Save]
                │
                No
                ↓
          [Show Error]
```

---

## 🎯 Success Metrics

### Form Submission
```
✅ Required fields filled → Pass validation
✅ Data gathered correctly → Complete object created
✅ Saved to localStorage → Data persists
✅ Success notification → User feedback
✅ NO JSON download → Clean process
```

### Admin Dashboard
```
✅ Login successful → Session created
✅ Data loaded → All interviews displayed
✅ Statistics accurate → Counts match
✅ Search works → Filters correctly
✅ Modal opens → Full details shown
```

### Testing Tools
```
✅ Test interviews created → Data structure valid
✅ Storage verified → localStorage accessible
✅ Console logging → Debug information visible
✅ Export works → JSON properly formatted
```

---

## 🔍 Debug Points

### When things go wrong:

```
Issue: Form won't submit
    ↓
Check: Browser console (F12)
    ↓
Look for: Validation errors
    ↓
Example: "Validation error: First name is required"
    ↓
Action: Fill missing field


Issue: Interview not in admin
    ↓
Check: localStorage
    ↓
Command: localStorage.getItem('churchInterviews')
    ↓
If null: Data wasn't saved
    ↓
If string: Data exists, check domain match


Issue: Admin won't load
    ↓
Check: Session storage
    ↓
Command: sessionStorage.getItem('adminLoggedIn')
    ↓
If null: Need to login again
    ↓
If 'true': Check timestamp expiry
```

---

## 📊 Data Lifecycle

```
Create
    ↓
User fills form
    ↓
[Submit Interview]
    ↓
Validate
    ↓
Save to localStorage
    ↓
───────────────────────
Read
    ↓
Admin logs in
    ↓
Load from localStorage
    ↓
Display in dashboard
    ↓
───────────────────────
Update
    ↓
(Future: Edit feature)
    ↓
Modify interview
    ↓
Save back to localStorage
    ↓
───────────────────────
Delete
    ↓
(Future: Delete feature)
    ↓
Remove from array
    ↓
Save updated array
    ↓
───────────────────────
Export
    ↓
Select interview
    ↓
Download as JSON
    ↓
Archive externally
```

---

## 🎨 UI Components

```
Main Form (index.html)
├── Header
│   ├── Logo
│   ├── Title
│   └── Admin Link
│
├── Form Sections
│   ├── Basic Information
│   │   ├── First Name Input
│   │   ├── Last Name Input
│   │   ├── Date Picker
│   │   └── Interviewer Input
│   │
│   ├── Spiritual Assessment
│   │   └── 5 Checkboxes
│   │
│   ├── Administrative Skills
│   │   ├── 5 Rating Scales (2-10)
│   │   └── Total Score Display
│   │
│   ├── Financial Skills
│   │   ├── 5 Rating Scales (2-10)
│   │   └── Total Score Display
│   │
│   ├── Ethics Check
│   │   └── Text Area
│   │
│   └── Final Decision
│       ├── Radio Buttons
│       ├── Remarks Text Area
│       └── Signature Fields
│
├── Summary Cards
│   ├── Admin Score
│   ├── Financial Score
│   └── Total Score
│
└── Action Buttons
    ├── Reset Form
    └── Submit Interview
```

```
Admin Dashboard (admin.html)
├── Header
│   ├── Logo
│   ├── Welcome Message
│   └── Logout Button
│
├── Statistics Cards
│   ├── Total Interviews
│   ├── Recommended Count
│   └── This Month Count
│
├── Controls
│   ├── Search Box
│   ├── Date Filter
│   ├── Recommendation Filter
│   └── Sort Options
│
├── Interview Cards Grid
│   └── For each interview:
│       ├── Name Badge
│       ├── Date
│       ├── Interviewer
│       ├── Scores
│       ├── Recommendation Badge
│       └── View/Export Buttons
│
└── Detail Modal
    ├── Full Interview Data
    ├── All Scores
    ├── Comments
    └── Export Button
```

---

## 🚀 Deployment Pipeline

```
Local Development
    ↓
git add .
    ↓
git commit -m "message"
    ↓
git push origin main
    ↓
───────────────────────
GitHub Repository
    ↓
Webhook triggers
    ↓
───────────────────────
GitHub Actions
    ↓
Run workflow
    ↓
Build & Deploy
    ↓
───────────────────────
GitHub Pages
    ↓
Live at:
https://boyeshi.github.io/church-interview/
    ↓
───────────────────────
Auto-deployed in 2-3 minutes
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Secure admin access
- ✅ Reliable data persistence
- ✅ Easy testing and debugging
- ✅ Scalable for future features

---

**Last Updated:** January 9, 2026  
**Version:** 2.0  
**Status:** Production Ready ✅
