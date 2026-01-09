// ============================================================
// Church Interview Assessment Sheet - Interactive JavaScript
// ============================================================

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    loadSavedData();
    setCurrentDate();
});

// -------------------- Initialization --------------------
function initializeForm() {
    console.log('Church Interview Assessment Sheet initialized');
    updateAllScores();
}

function setCurrentDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    if (!dateInput.value) {
        dateInput.value = today;
    }
}

// -------------------- Event Listeners --------------------
function setupEventListeners() {
    // Listen for rating changes
    const ratingInputs = document.querySelectorAll('input[type="radio"][data-group]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', handleRatingChange);
    });

    // Listen for form changes for auto-save
    const form = document.getElementById('assessmentForm');
    form.addEventListener('change', debounce(autoSave, 1000));

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Add animations on scroll
    setupScrollAnimations();
}

function handleRatingChange(event) {
    const group = event.target.getAttribute('data-group');
    updateScore(group);
    animateScoreChange(group);
}

// -------------------- Score Calculations --------------------
function updateScore(group) {
    let total = 0;
    const inputs = document.querySelectorAll(`input[type="radio"][data-group="${group}"]:checked`);
    
    inputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });

    // Update the display
    const totalElement = document.getElementById(`${group}Total`);
    if (totalElement) {
        totalElement.textContent = total;
        animateNumber(totalElement, total);
    }

    // Update summary
    updateSummary();
}

function updateAllScores() {
    updateScore('admin');
    updateScore('financial');
    updateSummary();
}

function updateSummary() {
    const adminTotal = parseInt(document.getElementById('adminTotal').textContent) || 0;
    const financialTotal = parseInt(document.getElementById('financialTotal').textContent) || 0;
    const overallTotal = adminTotal + financialTotal;

    // Update summary cards
    document.getElementById('summaryAdmin').textContent = `${adminTotal}/50`;
    document.getElementById('summaryFinancial').textContent = `${financialTotal}/50`;
    document.getElementById('summaryTotal').textContent = `${overallTotal}/100`;

    // Calculate percentages
    const adminPercent = Math.round((adminTotal / 50) * 100);
    const financialPercent = Math.round((financialTotal / 50) * 100);
    const totalPercent = Math.round((overallTotal / 100) * 100);

    document.getElementById('percentageAdmin').textContent = `${adminPercent}%`;
    document.getElementById('percentageFinancial').textContent = `${financialPercent}%`;
    document.getElementById('percentageTotal').textContent = `${totalPercent}%`;

    // Add color coding
    updateSummaryColors(adminPercent, financialPercent, totalPercent);
}

function updateSummaryColors(adminPercent, financialPercent, totalPercent) {
    const getColor = (percent) => {
        if (percent >= 80) return '#10b981'; // Green
        if (percent >= 60) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    document.getElementById('summaryAdmin').style.color = getColor(adminPercent);
    document.getElementById('summaryFinancial').style.color = getColor(financialPercent);
    document.getElementById('summaryTotal').style.color = getColor(totalPercent);
}

// -------------------- Animations --------------------
function animateScoreChange(group) {
    const element = document.getElementById(`${group}Total`);
    if (element) {
        element.classList.add('score-update');
        setTimeout(() => {
            element.classList.remove('score-update');
        }, 600);
    }
}

function animateNumber(element, finalNumber) {
    const startNumber = parseInt(element.textContent) || 0;
    const duration = 500;
    const startTime = Date.now();

    function updateNumber() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentNumber = Math.floor(startNumber + (finalNumber - startNumber) * easeOutCubic(progress));
        element.textContent = currentNumber;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('.form-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// -------------------- Form Management --------------------
function saveForm() {
    const formData = gatherFormData();
    
    // Validate required fields
    if (!validateForm(formData)) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Save to interview history
    saveToHistory(formData);
    
    // Also create downloadable JSON
    downloadFormData(formData);
    
    // Clear auto-save after successful save
    localStorage.removeItem('churchAssessmentAutoSave');
    
    showNotification('Assessment saved successfully! Interview recorded in system.', 'success');
    
    // Optional: Reset form after save
    setTimeout(() => {
        if (confirm('Interview saved! Would you like to reset the form for a new interview?')) {
            document.getElementById('assessmentForm').reset();
            updateAllScores();
        }
    }, 1000);
}

function saveToHistory(formData) {
    // Get existing interviews from localStorage
    let interviews = JSON.parse(localStorage.getItem('churchInterviews')) || [];
    
    // Add unique ID to the interview
    formData.id = 'INT-' + Date.now();
    formData.savedAt = new Date().toISOString();
    
    // Add to history
    interviews.push(formData);
    
    // Save back to localStorage
    localStorage.setItem('churchInterviews', JSON.stringify(interviews));
    
    console.log('Interview saved to history:', formData.id);
}

function gatherFormData() {
    const form = document.getElementById('assessmentForm');
    const formData = {
        timestamp: new Date().toISOString(),
        basicInfo: {
            applicantName: document.getElementById('applicantName').value,
            date: document.getElementById('date').value,
            interviewer: document.getElementById('interviewer').value
        },
        spiritualAssessment: {
            bornAgain: document.querySelector('input[name="spiritual1"]').checked,
            activeChurch: document.querySelector('input[name="spiritual2"]').checked,
            integrity: document.querySelector('input[name="spiritual3"]').checked,
            obedient: document.querySelector('input[name="spiritual4"]').checked,
            communication: document.querySelector('input[name="spiritual5"]').checked
        },
        administrativeSkills: {},
        financialSkills: {},
        ethicsCheck: document.getElementById('ethicsResponse').value,
        finalDecision: {
            recommendation: document.querySelector('input[name="finalDecision"]:checked')?.value || '',
            remarks: document.getElementById('overallRemarks').value,
            interviewerSignature: document.getElementById('interviewerSignature').value,
            signatureDate: document.getElementById('signatureDate').value
        },
        scores: {
            administrative: parseInt(document.getElementById('adminTotal').textContent) || 0,
            financial: parseInt(document.getElementById('financialTotal').textContent) || 0,
            total: parseInt(document.getElementById('summaryTotal').textContent.split('/')[0]) || 0
        }
    };

    // Gather admin ratings
    for (let i = 1; i <= 5; i++) {
        const selected = document.querySelector(`input[name="admin${i}"]:checked`);
        formData.administrativeSkills[`skill${i}`] = selected ? parseInt(selected.value) : 0;
    }

    // Gather financial ratings
    for (let i = 1; i <= 5; i++) {
        const selected = document.querySelector(`input[name="financial${i}"]:checked`);
        formData.financialSkills[`skill${i}`] = selected ? parseInt(selected.value) : 0;
    }

    return formData;
}

function validateForm(formData) {
    // Check required fields
    if (!formData.basicInfo.applicantName || !formData.basicInfo.date || !formData.basicInfo.interviewer) {
        return false;
    }

    // Check spiritual assessment (all must be checked)
    const spiritualChecks = Object.values(formData.spiritualAssessment);
    if (!spiritualChecks.every(checked => checked === true)) {
        return false;
    }

    // Check ethics response
    if (!formData.ethicsCheck || formData.ethicsCheck.trim() === '') {
        return false;
    }

    // Check final decision
    if (!formData.finalDecision.recommendation) {
        return false;
    }

    return true;
}

function downloadFormData(formData) {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `church_assessment_${formData.basicInfo.applicantName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function resetForm() {
    if (!confirm('Are you sure you want to reset the entire form? All data will be lost.')) {
        return;
    }

    document.getElementById('assessmentForm').reset();
    updateAllScores();
    localStorage.removeItem('churchAssessment');
    localStorage.removeItem('churchAssessmentAutoSave');
    
    showNotification('Form has been reset', 'info');
}

function autoSave() {
    const formData = gatherFormData();
    localStorage.setItem('churchAssessmentAutoSave', JSON.stringify(formData));
    console.log('Auto-saved at', new Date().toLocaleTimeString());
}

function loadSavedData() {
    const savedData = localStorage.getItem('churchAssessmentAutoSave');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Ask user if they want to restore
            if (confirm('Found auto-saved data. Would you like to restore it?')) {
                restoreFormData(data);
                showNotification('Data restored successfully', 'success');
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

function restoreFormData(data) {
    // Restore basic info
    if (data.basicInfo) {
        document.getElementById('applicantName').value = data.basicInfo.applicantName || '';
        document.getElementById('date').value = data.basicInfo.date || '';
        document.getElementById('interviewer').value = data.basicInfo.interviewer || '';
    }

    // Restore spiritual assessment
    if (data.spiritualAssessment) {
        document.querySelector('input[name="spiritual1"]').checked = data.spiritualAssessment.bornAgain;
        document.querySelector('input[name="spiritual2"]').checked = data.spiritualAssessment.activeChurch;
        document.querySelector('input[name="spiritual3"]').checked = data.spiritualAssessment.integrity;
        document.querySelector('input[name="spiritual4"]').checked = data.spiritualAssessment.obedient;
        document.querySelector('input[name="spiritual5"]').checked = data.spiritualAssessment.communication;
    }

    // Restore admin skills
    if (data.administrativeSkills) {
        for (let i = 1; i <= 5; i++) {
            const value = data.administrativeSkills[`skill${i}`];
            if (value) {
                const radio = document.querySelector(`input[name="admin${i}"][value="${value}"]`);
                if (radio) radio.checked = true;
            }
        }
    }

    // Restore financial skills
    if (data.financialSkills) {
        for (let i = 1; i <= 5; i++) {
            const value = data.financialSkills[`skill${i}`];
            if (value) {
                const radio = document.querySelector(`input[name="financial${i}"][value="${value}"]`);
                if (radio) radio.checked = true;
            }
        }
    }

    // Restore ethics and final decision
    if (data.ethicsCheck) {
        document.getElementById('ethicsResponse').value = data.ethicsCheck;
    }

    if (data.finalDecision) {
        if (data.finalDecision.recommendation) {
            const radio = document.querySelector(`input[name="finalDecision"][value="${data.finalDecision.recommendation}"]`);
            if (radio) radio.checked = true;
        }
        document.getElementById('overallRemarks').value = data.finalDecision.remarks || '';
        document.getElementById('interviewerSignature').value = data.finalDecision.interviewerSignature || '';
        document.getElementById('signatureDate').value = data.finalDecision.signatureDate || '';
    }

    // Update scores
    updateAllScores();
}

// -------------------- Notifications --------------------
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '600',
        zIndex: '10000',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '400px'
    });

    // Type-specific colors
    const colors = {
        success: { bg: '#10b981', color: '#ffffff' },
        error: { bg: '#ef4444', color: '#ffffff' },
        info: { bg: '#3b82f6', color: '#ffffff' },
        warning: { bg: '#f59e0b', color: '#ffffff' }
    };

    const colorScheme = colors[type] || colors.info;
    notification.style.backgroundColor = colorScheme.bg;
    notification.style.color = colorScheme.color;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .score-update {
        animation: scorePopup 0.6s ease-out;
    }
    
    @keyframes scorePopup {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// -------------------- Keyboard Shortcuts --------------------
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveForm();
    }
    
    // Ctrl/Cmd + P to print
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        window.print();
    }
    
    // Ctrl/Cmd + R to reset (with confirmation)
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        resetForm();
    }
}

// -------------------- Utility Functions --------------------
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// -------------------- Export Functions --------------------
window.saveForm = saveForm;
window.resetForm = resetForm;

// Log initialization
console.log('%c Church Interview Assessment Sheet Ready! ', 
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 8px 12px; border-radius: 4px;');
console.log('Keyboard Shortcuts:');
console.log('  - Ctrl/Cmd + S: Save Assessment');
console.log('  - Ctrl/Cmd + P: Print');
console.log('  - Ctrl/Cmd + R: Reset Form');
