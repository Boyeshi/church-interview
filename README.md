# Church Interview Assessment Sheet

A modern, professional web application for conducting and documenting church interviews for the position of Church Administrative & Financial Analyst.

## ✨ Features

### 🎯 Core Functionality
- **Comprehensive Assessment Form** - Structured evaluation across multiple dimensions
- **Real-time Score Calculation** - Automatic calculation and display of assessment scores
- **Auto-save Functionality** - Never lose your work with automatic data persistence
- **Print-friendly Design** - Professional printing layout for physical records
- **Data Export** - Download assessments as JSON for record keeping
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### 📋 Assessment Sections

1. **Spiritual & Character Assessment** (Mandatory)
   - Born again with sound Christian values
   - Active church involvement
   - Integrity and fear of God
   - Obedient, teachable, respects authority
   - Good communication and attitude

2. **Administrative Skills** (Scored out of 50)
   - Record keeping & documentation
   - Office organization & time management
   - Confidentiality & discretion
   - Computer skills (Word/Excel/Email)
   - Attention to details & accuracy

3. **Financial & Analytical Skills** (Scored out of 50)
   - Basic accounting knowledge
   - Budgeting & expense tracking
   - Financial accuracy & reporting
   - Integrity in handling church funds
   - Financial problem solving & analysis

4. **Ethics Check**
   - Open-ended question on handling confidential information

5. **Final Decision**
   - Recommendation levels: Strongly Recommend, Recommend, Consider, Not Recommend
   - Overall remarks section
   - Interviewer signature and date

### 🎨 UI/UX Highlights

- **Modern Gradient Design** - Beautiful purple gradient header and accents
- **Smooth Animations** - Fade-in effects, score animations, and interactive elements
- **Color-coded Feedback** - Visual indicators for performance levels
- **Accessibility First** - Keyboard navigation and focus indicators
- **Interactive Elements** - Hover effects and smooth transitions
- **Professional Typography** - Inter font family for clean, modern look

### ⚡ Interactive Features

- **Live Score Updates** - Scores update in real-time as you rate
- **Visual Summary Dashboard** - See overall performance at a glance
- **Form Validation** - Ensures all required fields are completed
- **Auto-save** - Automatic saving to local storage every second
- **Data Recovery** - Restore auto-saved data on page reload
- **Keyboard Shortcuts** - Quick actions for power users

## 🚀 Getting Started

### Quick Start

1. Simply open `index.html` in your web browser
2. Fill in the applicant information
3. Complete all assessment sections
4. Review the summary scores
5. Save or print the assessment

### Using a Local Server (Recommended)

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (with http-server)
npx http-server -p 8000

# Then open your browser to:
# http://localhost:8000
```

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save Assessment
- **Ctrl/Cmd + P** - Print Assessment
- **Ctrl/Cmd + R** - Reset Form (with confirmation)

## 📱 Responsive Breakpoints

- **Desktop** - 1200px and above (optimal viewing)
- **Tablet** - 768px to 1199px
- **Mobile** - 480px to 767px
- **Small Mobile** - Below 480px

## 💾 Data Management

### Auto-save
The application automatically saves your progress to browser local storage every second. Your data persists even if you close the browser.

### Manual Save
Click the "Save Assessment" button to:
- Save to local storage
- Download a JSON file with all assessment data
- Get a timestamped backup

### Data Recovery
When you revisit the page, you'll be prompted to restore any auto-saved data.

## 🖨️ Printing

The application includes optimized print styles:
- Clean, professional layout
- Preserved colors for headers and badges
- Removed interactive elements
- Proper page breaks
- Compact spacing for paper efficiency

Simply use `Ctrl/Cmd + P` or click the "Print" button in the header.

## 🎯 Scoring System

### Administrative Skills (50 points max)
- Each category rated 2, 4, 6, 8, or 10 points
- 5 categories × 10 points = 50 points total

### Financial & Analytical Skills (50 points max)
- Each category rated 2, 4, 6, 8, or 10 points
- 5 categories × 10 points = 50 points total

### Total Assessment Score
- Combined maximum: 100 points
- Color-coded performance indicators:
  - 🟢 Green: 80%+ (Excellent)
  - 🟠 Orange: 60-79% (Good)
  - 🔴 Red: Below 60% (Needs Improvement)

## 🛠️ Technical Stack

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No dependencies, pure ES6+
- **Local Storage API** - Client-side data persistence
- **Web Fonts** - Google Fonts (Inter family)

## 🌟 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📄 File Structure

```
church-interview/
├── index.html              # Main HTML structure
├── styles.css              # All styling and responsive design
├── script.js               # Interactive functionality
├── README.md               # Documentation
└── Church_Interview_Assessment_Sheet.docx  # Original document
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4f46e5;    /* Main brand color */
    --secondary-color: #10b981;  /* Success color */
    --danger-color: #ef4444;     /* Error color */
    --warning-color: #f59e0b;    /* Warning color */
}
```

### Scoring
Modify rating values in `index.html` (currently set to 2, 4, 6, 8, 10)

## 📝 Best Practices

1. **Complete Spiritual Assessment** - All checkboxes are required
2. **Rate All Skills** - Ensure every skill is rated for accurate scoring
3. **Ethics Response** - Provide detailed, thoughtful answers
4. **Save Regularly** - Use manual save for important checkpoints
5. **Print for Records** - Keep physical copies of assessments
6. **Export Data** - Download JSON backups for digital records

## 🔒 Privacy & Security

- All data is stored locally in the browser
- No server-side storage or transmission
- No external API calls
- No tracking or analytics
- Complete privacy and control over your data

## 📞 Support

For issues or questions about this application, please refer to the documentation or contact your church administration.

## 📜 License

Created for church administrative purposes. All rights reserved.

---

**Built with ❤️ for efficient church administration**