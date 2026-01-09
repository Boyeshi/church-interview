// Admin Dashboard JavaScript

// Check authentication on page load
(function() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    // Check if logged in and session is still valid (4 hours)
    if (!isLoggedIn || !loginTime || (Date.now() - parseInt(loginTime)) > 14400000) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set admin name
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
        document.getElementById('adminName').textContent = username;
    }
    
    // Load dashboard data
    loadDashboard();
})();

let allInterviews = [];
let filteredInterviews = [];

function loadDashboard() {
    // Load all interviews from localStorage
    allInterviews = JSON.parse(localStorage.getItem('churchInterviews')) || [];
    filteredInterviews = [...allInterviews];
    
    // Update statistics
    updateStatistics();
    
    // Display interviews
    displayInterviews();
}

function updateStatistics() {
    const totalCount = allInterviews.length;
    document.getElementById('totalInterviews').textContent = totalCount;
    
    // Count recommended interviews
    const recommendedCount = allInterviews.filter(i => 
        i.finalDecision?.recommendation === 'strongly-recommend' || 
        i.finalDecision?.recommendation === 'recommend'
    ).length;
    document.getElementById('recommendedCount').textContent = recommendedCount;
    
    // Count this month's interviews
    const now = new Date();
    const thisMonthCount = allInterviews.filter(i => {
        const interviewDate = new Date(i.timestamp);
        return interviewDate.getMonth() === now.getMonth() && 
               interviewDate.getFullYear() === now.getFullYear();
    }).length;
    document.getElementById('thisMonthCount').textContent = thisMonthCount;
    
    // Calculate average score
    if (totalCount > 0) {
        const avgScore = allInterviews.reduce((sum, i) => sum + (i.scores?.total || 0), 0) / totalCount;
        document.getElementById('avgScore').textContent = avgScore.toFixed(0) + '%';
    } else {
        document.getElementById('avgScore').textContent = '0%';
    }
}

function displayInterviews() {
    const container = document.getElementById('interviewsList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredInterviews.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    container.innerHTML = filteredInterviews.map(interview => {
        const date = new Date(interview.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const recommendation = interview.finalDecision?.recommendation || 'not-specified';
        const badgeClass = `badge-${recommendation}`;
        const badgeText = formatRecommendation(recommendation);
        
        const totalScore = interview.scores?.total || 0;
        const scoreClass = getScoreClass(totalScore);
        
        return `
            <div class="interview-card" onclick="viewInterview('${interview.id}')">
                <div class="interview-header">
                    <div class="interview-info">
                        <h3>${escapeHtml(interview.basicInfo?.applicantName || 'Unknown Applicant')}</h3>
                        <div class="interview-meta">
                            <span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                ${formattedDate} at ${formattedTime}
                            </span>
                            <span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                ${escapeHtml(interview.basicInfo?.interviewer || 'Unknown')}
                            </span>
                        </div>
                    </div>
                    <span class="interview-badge ${badgeClass}">${badgeText}</span>
                </div>
                
                <div class="interview-stats">
                    <div class="stat-item">
                        <span class="stat-label">Administrative</span>
                        <span class="stat-value">${interview.scores?.administrative || 0}/50</span>
                        <div class="score-bar">
                            <div class="score-fill ${scoreClass}" style="width: ${(interview.scores?.administrative || 0) * 2}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Financial</span>
                        <span class="stat-value">${interview.scores?.financial || 0}/50</span>
                        <div class="score-bar">
                            <div class="score-fill ${scoreClass}" style="width: ${(interview.scores?.financial || 0) * 2}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Score</span>
                        <span class="stat-value">${totalScore}%</span>
                        <div class="score-bar">
                            <div class="score-fill ${scoreClass}" style="width: ${totalScore}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function viewInterview(id) {
    const interview = allInterviews.find(i => i.id === id);
    if (!interview) return;
    
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    const date = new Date(interview.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    modalBody.innerHTML = `
        <!-- Basic Information -->
        <div class="detail-section">
            <h3>Basic Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Interview ID</label>
                    <p>${interview.id}</p>
                </div>
                <div class="detail-item">
                    <label>Applicant Name</label>
                    <p>${escapeHtml(interview.basicInfo?.applicantName || 'N/A')}</p>
                </div>
                <div class="detail-item">
                    <label>Interview Date</label>
                    <p>${formattedDate}</p>
                </div>
                <div class="detail-item">
                    <label>Interviewer</label>
                    <p>${escapeHtml(interview.basicInfo?.interviewer || 'N/A')}</p>
                </div>
            </div>
        </div>
        
        <!-- Spiritual Assessment -->
        <div class="detail-section">
            <h3>Spiritual & Character Assessment</h3>
            ${renderChecklistItem('Born again with sound Christian values', interview.spiritualAssessment?.bornAgain)}
            ${renderChecklistItem('Active church involvement', interview.spiritualAssessment?.activeChurch)}
            ${renderChecklistItem('Integrity and fear of God', interview.spiritualAssessment?.integrity)}
            ${renderChecklistItem('Obedient, teachable, respects authority', interview.spiritualAssessment?.obedient)}
            ${renderChecklistItem('Good communication and attitude', interview.spiritualAssessment?.communication)}
        </div>
        
        <!-- Administrative Skills -->
        <div class="detail-section">
            <h3>Administrative Skills (${interview.scores?.administrative || 0}/50)</h3>
            <div class="rating-grid">
                ${renderRatingItem('Record keeping & documentation', interview.administrativeSkills?.skill1)}
                ${renderRatingItem('Office organization & time management', interview.administrativeSkills?.skill2)}
                ${renderRatingItem('Confidentiality & discretion', interview.administrativeSkills?.skill3)}
                ${renderRatingItem('Computer skills (Word/Excel/Email)', interview.administrativeSkills?.skill4)}
                ${renderRatingItem('Attention to details & accuracy', interview.administrativeSkills?.skill5)}
            </div>
        </div>
        
        <!-- Financial Skills -->
        <div class="detail-section">
            <h3>Financial & Analytical Skills (${interview.scores?.financial || 0}/50)</h3>
            <div class="rating-grid">
                ${renderRatingItem('Basic accounting knowledge', interview.financialSkills?.skill1)}
                ${renderRatingItem('Budgeting & expense tracking', interview.financialSkills?.skill2)}
                ${renderRatingItem('Financial accuracy & reporting', interview.financialSkills?.skill3)}
                ${renderRatingItem('Integrity in handling church funds', interview.financialSkills?.skill4)}
                ${renderRatingItem('Financial problem solving & analysis', interview.financialSkills?.skill5)}
            </div>
        </div>
        
        <!-- Ethics Check -->
        <div class="detail-section">
            <h3>Ethics Check</h3>
            <div class="detail-item">
                <label>How would you handle confidential church financial information?</label>
                <p>${escapeHtml(interview.ethicsCheck || 'No response provided')}</p>
            </div>
        </div>
        
        <!-- Final Decision -->
        <div class="detail-section">
            <h3>Final Decision</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Recommendation</label>
                    <p><span class="interview-badge ${`badge-${interview.finalDecision?.recommendation || 'not-specified'}`}">
                        ${formatRecommendation(interview.finalDecision?.recommendation)}
                    </span></p>
                </div>
                <div class="detail-item">
                    <label>Total Score</label>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${interview.scores?.total || 0}%</p>
                </div>
            </div>
            <div class="detail-item" style="margin-top: 1rem;">
                <label>Overall Remarks</label>
                <p>${escapeHtml(interview.finalDecision?.remarks || 'No remarks provided')}</p>
            </div>
            <div class="detail-grid" style="margin-top: 1rem;">
                <div class="detail-item">
                    <label>Interviewer's Signature</label>
                    <p>${escapeHtml(interview.finalDecision?.interviewerSignature || 'N/A')}</p>
                </div>
                <div class="detail-item">
                    <label>Signature Date</label>
                    <p>${interview.finalDecision?.signatureDate ? new Date(interview.finalDecision.signatureDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
        
        <!-- Actions -->
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="btn-primary" onclick="exportInterview('${interview.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Interview
            </button>
            <button class="btn-secondary" onclick="deleteInterview('${interview.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Interview
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

function renderChecklistItem(label, checked) {
    return `
        <div class="checklist-item">
            <div class="check-icon ${checked ? 'checked' : 'unchecked'}">
                ${checked ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
            </div>
            <span>${label}</span>
        </div>
    `;
}

function renderRatingItem(label, score) {
    return `
        <div class="rating-item">
            <span>${label}</span>
            <span class="rating-score">${score || 0}/10</span>
        </div>
    `;
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('show');
}

function filterInterviews() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const recommendation = document.getElementById('recommendationFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    filteredInterviews = allInterviews.filter(interview => {
        // Search by name
        const nameMatch = !searchTerm || 
            interview.basicInfo?.applicantName?.toLowerCase().includes(searchTerm);
        
        // Filter by recommendation
        const recMatch = recommendation === 'all' || 
            interview.finalDecision?.recommendation === recommendation;
        
        // Filter by date
        let dateMatch = true;
        if (dateFilter) {
            const interviewDate = new Date(interview.timestamp).toISOString().split('T')[0];
            dateMatch = interviewDate === dateFilter;
        }
        
        return nameMatch && recMatch && dateMatch;
    });
    
    displayInterviews();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('recommendationFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    filteredInterviews = [...allInterviews];
    displayInterviews();
}

function sortInterviews() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredInterviews.sort((a, b) => {
        switch(sortBy) {
            case 'date-desc':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'date-asc':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'name-asc':
                return (a.basicInfo?.applicantName || '').localeCompare(b.basicInfo?.applicantName || '');
            case 'name-desc':
                return (b.basicInfo?.applicantName || '').localeCompare(a.basicInfo?.applicantName || '');
            case 'score-desc':
                return (b.scores?.total || 0) - (a.scores?.total || 0);
            case 'score-asc':
                return (a.scores?.total || 0) - (b.scores?.total || 0);
            default:
                return 0;
        }
    });
    
    displayInterviews();
}

function exportInterview(id) {
    const interview = allInterviews.find(i => i.id === id);
    if (!interview) return;
    
    const dataStr = JSON.stringify(interview, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview_${interview.basicInfo?.applicantName?.replace(/\s+/g, '_')}_${interview.id}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportAllData() {
    if (allInterviews.length === 0) {
        alert('No interviews to export');
        return;
    }
    
    const dataStr = JSON.stringify(allInterviews, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_interviews_${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function deleteInterview(id) {
    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
        return;
    }
    
    allInterviews = allInterviews.filter(i => i.id !== id);
    localStorage.setItem('churchInterviews', JSON.stringify(allInterviews));
    
    closeModal();
    loadDashboard();
    
    alert('Interview deleted successfully');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// Utility functions
function formatRecommendation(rec) {
    const map = {
        'strongly-recommend': 'Strongly Recommend',
        'recommend': 'Recommend',
        'consider': 'Consider',
        'not-recommend': 'Not Recommend',
        'not-specified': 'Not Specified'
    };
    return map[rec] || 'Unknown';
}

function getScoreClass(score) {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Keyboard shortcut to close modal (Escape key)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

console.log('%c Admin Dashboard Loaded ', 
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 8px 12px; border-radius: 4px;');
