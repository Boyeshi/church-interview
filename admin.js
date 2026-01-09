// Admin Dashboard JavaScript

// Global variables - must be declared before any code that uses them
let allInterviews = [];
let filteredInterviews = [];

// Secure authentication check
(function() {
    console.log('=== ADMIN AUTHENTICATION CHECK ===');
    
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    const username = sessionStorage.getItem('adminUsername');
    
    console.log('Login status:', isLoggedIn);
    console.log('Login time:', loginTime ? new Date(parseInt(loginTime)).toLocaleString() : 'N/A');
    console.log('Username:', username);
    
    // Check if logged in and session is still valid (4 hours)
    if (!isLoggedIn || !loginTime || (Date.now() - parseInt(loginTime)) > 14400000) {
        console.error('❌ Not authenticated or session expired');
        alert('Session expired or not logged in. Redirecting to login page.');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('✓ Authentication valid');
    
    // Set admin name
    if (username) {
        const nameElement = document.getElementById('adminName');
        if (nameElement) {
            nameElement.textContent = username;
        }
    }
    
    // Load dashboard data
    console.log('Loading dashboard...');
    loadDashboard();
    
    console.log('=== AUTHENTICATION CHECK COMPLETE ===');
})();

function loadDashboard() {
    console.log('=== LOADING ADMIN DASHBOARD ===');
    
    try {
        // Load all interviews from localStorage
        const rawData = localStorage.getItem('churchInterviews');
        console.log('Raw localStorage data:', rawData ? `${rawData.length} characters` : 'NULL');
        
        allInterviews = rawData ? JSON.parse(rawData) : [];
        console.log('Parsed interviews:', allInterviews.length);
        
        if (allInterviews.length > 0) {
            console.log('Sample interview:', allInterviews[0]);
            allInterviews.forEach((interview, index) => {
                console.log(`Interview ${index + 1}:`, interview.basicInfo?.fullName || 'Unknown', interview.id);
            });
        } else {
            console.warn('⚠️ NO INTERVIEWS FOUND IN STORAGE');
            console.log('Checking if localStorage is accessible...');
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                console.log('✓ localStorage is accessible');
            } catch (e) {
                console.error('✗ localStorage is BLOCKED:', e);
            }
        }
        
        filteredInterviews = [...allInterviews];
        
        // Update statistics
        updateStatistics();
        
        // Display interviews
        displayInterviews();
        
        console.log('=== DASHBOARD LOADED ===');
    } catch (error) {
        console.error('ERROR loading dashboard:', error);
        alert('Error loading interviews. Check browser console for details.');
    }
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
    console.log('Displaying interviews...');
    const container = document.getElementById('interviewsList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredInterviews.length === 0) {
        console.log('No interviews to display');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        
        // Update empty state message with helpful info
        const currentDomain = window.location.hostname;
        const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
        
        emptyState.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" style="margin-bottom: 20px;">
                    <path d="M9 11H3v10h6V11z"></path>
                    <path d="M15 3H9v18h6V3z"></path>
                    <path d="M21 7h-6v14h6V7z"></path>
                </svg>
                <h3 style="color: #666; margin-bottom: 10px;">No Interviews Found</h3>
                <p style="color: #999; margin-bottom: 20px;">
                    ${allInterviews.length === 0 ? 
                        'No interviews have been submitted yet on this domain.' : 
                        'No interviews match your current filters.'}
                </p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; max-width: 500px; margin: 20px auto; text-align: left;">
                    <p style="color: #666; margin-bottom: 10px;"><strong>Current Domain:</strong> ${currentDomain}</p>
                    <p style="color: #999; font-size: 14px; margin-bottom: 15px;">
                        Interviews are stored per domain. Make sure you submitted interviews on this same domain.
                    </p>
                    ${isLocalhost ? `
                        <p style="color: #856404; background: #fff3cd; padding: 10px; border-radius: 4px; font-size: 14px;">
                            💡 <strong>Tip:</strong> You're on localhost. Submit test interviews at:<br>
                            <a href="http://localhost:8000/index.html" target="_blank" style="color: #667eea;">http://localhost:8000/index.html</a>
                        </p>
                    ` : `
                        <p style="color: #0c5460; background: #d1ecf1; padding: 10px; border-radius: 4px; font-size: 14px;">
                            💡 <strong>Tip:</strong> You're on GitHub Pages. Submit interviews at:<br>
                            <a href="https://boyeshi.github.io/church-interview/" target="_blank" style="color: #667eea;">https://boyeshi.github.io/church-interview/</a>
                        </p>
                    `}
                </div>
                <div style="margin-top: 20px;">
                    <a href="domain-checker.html" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 500;">
                        🔍 Check Data on Both Domains
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    console.log(`Rendering ${filteredInterviews.length} interviews`);
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
        
        // Handle both old and new name formats
        const fullName = interview.basicInfo?.fullName || 
                        (interview.basicInfo?.firstName && interview.basicInfo?.lastName 
                            ? `${interview.basicInfo.firstName} ${interview.basicInfo.lastName}` 
                            : interview.basicInfo?.applicantName || 'Unknown Applicant');
        
        return `
            <div class="interview-card" onclick="viewInterview('${interview.id}')">
                <div class="interview-header">
                    <div class="interview-info">
                        <h3>${escapeHtml(fullName)}</h3>
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
    
    // Handle both old and new name formats
    const firstName = interview.basicInfo?.firstName || '';
    const lastName = interview.basicInfo?.lastName || '';
    const fullName = interview.basicInfo?.fullName || 
                    (firstName && lastName ? `${firstName} ${lastName}` : interview.basicInfo?.applicantName || 'N/A');
    
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
                    <label>First Name</label>
                    <p>${escapeHtml(firstName || 'N/A')}</p>
                </div>
                <div class="detail-item">
                    <label>Last Name</label>
                    <p>${escapeHtml(lastName || 'N/A')}</p>
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
        // Search by name (handle both old and new formats)
        const fullName = interview.basicInfo?.fullName || 
                        (interview.basicInfo?.firstName && interview.basicInfo?.lastName 
                            ? `${interview.basicInfo.firstName} ${interview.basicInfo.lastName}` 
                            : interview.basicInfo?.applicantName || '');
        const nameMatch = !searchTerm || fullName.toLowerCase().includes(searchTerm);
        
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
                const nameA = a.basicInfo?.fullName || 
                            (a.basicInfo?.firstName && a.basicInfo?.lastName 
                                ? `${a.basicInfo.firstName} ${a.basicInfo.lastName}` 
                                : a.basicInfo?.applicantName || '');
                const nameB = b.basicInfo?.fullName || 
                            (b.basicInfo?.firstName && b.basicInfo?.lastName 
                                ? `${b.basicInfo.firstName} ${b.basicInfo.lastName}` 
                                : b.basicInfo?.applicantName || '');
                return nameA.localeCompare(nameB);
            case 'name-desc':
                const nameA2 = a.basicInfo?.fullName || 
                            (a.basicInfo?.firstName && a.basicInfo?.lastName 
                                ? `${a.basicInfo.firstName} ${a.basicInfo.lastName}` 
                                : a.basicInfo?.applicantName || '');
                const nameB2 = b.basicInfo?.fullName || 
                            (b.basicInfo?.firstName && b.basicInfo?.lastName 
                                ? `${b.basicInfo.firstName} ${b.basicInfo.lastName}` 
                                : b.basicInfo?.applicantName || '');
                return nameB2.localeCompare(nameA2);
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
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const fullName = `${interview.basicInfo?.firstName || ''} ${interview.basicInfo?.lastName || ''}`.trim();
    const date = new Date(interview.timestamp).toLocaleDateString();
    
    // Colors
    const primaryColor = [102, 126, 234];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];
    
    let yPos = 20;
    
    // Header with gradient effect
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Church Interview Assessment', 105, 15, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Position: Church Administrative & Financial Analyst', 105, 23, { align: 'center' });
    doc.text(`Interview ID: ${interview.id}`, 105, 29, { align: 'center' });
    
    yPos = 45;
    
    // Applicant Information
    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Applicant Information', 15, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Name:', 15, yPos);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(fullName, 35, yPos);
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Date:', 120, yPos);
    doc.setTextColor(...darkGray);
    doc.setFont(undefined, 'bold');
    doc.text(date, 135, yPos);
    
    yPos += 12;
    
    // Spiritual Assessment
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...darkGray);
    doc.text('Spiritual & Character Assessment', 15, yPos);
    
    yPos += 7;
    const spiritualItems = [
        { label: 'Born again with sound Christian values', value: interview.spiritualAssessment?.bornAgain },
        { label: 'Active church involvement', value: interview.spiritualAssessment?.activeChurch },
        { label: 'Integrity and fear of God', value: interview.spiritualAssessment?.integrity },
        { label: 'Obedient, teachable, respects authority', value: interview.spiritualAssessment?.obedient },
        { label: 'Good communication and attitude', value: interview.spiritualAssessment?.communication }
    ];
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    spiritualItems.forEach(item => {
        doc.setTextColor(...(item.value ? [16, 185, 129] : [239, 68, 68]));
        doc.text(item.value ? '✓' : '✗', 17, yPos);
        doc.setTextColor(...darkGray);
        doc.text(item.label, 23, yPos);
        yPos += 5;
    });
    
    yPos += 5;
    
    // Administrative Skills Table
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Administrative Skills', 15, yPos);
    yPos += 2;
    
    doc.autoTable({
        startY: yPos,
        head: [['Area', 'Score']],
        body: [
            ['Record keeping & documentation', `${interview.administrativeSkills?.skill1 || 0}/10`],
            ['Office organization & time management', `${interview.administrativeSkills?.skill2 || 0}/10`],
            ['Confidentiality & discretion', `${interview.administrativeSkills?.skill3 || 0}/10`],
            ['Computer skills (Word/Excel/Email)', `${interview.administrativeSkills?.skill4 || 0}/10`],
            ['Attention to details & accuracy', `${interview.administrativeSkills?.skill5 || 0}/10`],
            ['TOTAL', `${interview.scores?.administrative || 0}/50`]
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 35, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Financial Skills Table
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Financial & Analytical Skills', 15, yPos);
    yPos += 2;
    
    doc.autoTable({
        startY: yPos,
        head: [['Area', 'Score']],
        body: [
            ['Understanding of accounting principles', `${interview.financialSkills?.skill1 || 0}/10`],
            ['Budgeting & financial planning', `${interview.financialSkills?.skill2 || 0}/10`],
            ['Financial reporting & analysis', `${interview.financialSkills?.skill3 || 0}/10`],
            ['Spreadsheet proficiency & data analysis', `${interview.financialSkills?.skill4 || 0}/10`],
            ['Attention to financial details & accuracy', `${interview.financialSkills?.skill5 || 0}/10`],
            ['TOTAL', `${interview.scores?.financial || 0}/50`]
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 35, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Check if we need a new page
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }
    
    // Ethics Response
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Ethics & Compliance Check', 15, yPos);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const ethicsText = interview.ethicsCheck || 'No response provided';
    const splitEthics = doc.splitTextToSize(ethicsText, 180);
    doc.text(splitEthics, 15, yPos);
    yPos += splitEthics.length * 5 + 8;
    
    // Check if we need a new page
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }
    
    // Final Assessment
    doc.setFillColor(248, 250, 252);
    doc.rect(10, yPos - 5, 190, 35, 'F');
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...darkGray);
    doc.text('Final Assessment', 15, yPos);
    
    yPos += 8;
    
    // Total Score
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Total Score:', 15, yPos);
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`${interview.scores?.total || 0}/100 (${interview.scores?.total || 0}%)`, 50, yPos);
    
    // Recommendation
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Recommendation:', 120, yPos);
    
    let recText = '';
    let recColor = [107, 114, 128];
    switch(interview.finalDecision?.recommendation) {
        case 'strongly-recommend':
            recText = 'Strongly Recommend';
            recColor = [16, 185, 129];
            break;
        case 'recommend':
            recText = 'Recommend';
            recColor = [59, 130, 246];
            break;
        case 'consider':
            recText = 'Consider';
            recColor = [245, 158, 11];
            break;
        case 'not-recommend':
            recText = 'Not Recommend';
            recColor = [239, 68, 68];
            break;
        default:
            recText = 'Not Specified';
    }
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...recColor);
    doc.text(recText, 155, yPos);
    
    yPos += 10;
    
    // Remarks
    if (interview.finalDecision?.remarks) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...lightGray);
        doc.text('Remarks:', 15, yPos);
        yPos += 5;
        
        doc.setFontSize(9);
        doc.setTextColor(...darkGray);
        const remarksText = interview.finalDecision.remarks;
        const splitRemarks = doc.splitTextToSize(remarksText, 180);
        doc.text(splitRemarks, 15, yPos);
        yPos += splitRemarks.length * 4;
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
    doc.text('Church Interview Assessment System © 2026', 105, 290, { align: 'center' });
    
    // Auto-download
    const fileName = `Interview_${fullName.replace(/\s+/g, '_')}_${interview.id}.pdf`;
    doc.save(fileName);
    
    // Show success notification
    showNotification('PDF downloaded successfully!', 'success');
}

// Data verification function
function verifyDataAccess() {
    console.log('=== DATA VERIFICATION ===');
    
    const results = [];
    let hasIssues = false;
    
    // Check localStorage availability
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        results.push('✓ localStorage is accessible');
    } catch (e) {
        results.push('✗ localStorage is BLOCKED: ' + e.message);
        hasIssues = true;
    }
    
    // Check for data
    const rawData = localStorage.getItem('churchInterviews');
    if (!rawData) {
        results.push('⚠️ NO DATA in localStorage (churchInterviews key is empty)');
        results.push(`Current domain: ${window.location.hostname}`);
        results.push('Make sure you submitted interviews on THIS domain.');
        hasIssues = true;
    } else {
        try {
            const interviews = JSON.parse(rawData);
            results.push(`✓ Found ${interviews.length} interview(s) in storage`);
            
            if (interviews.length > 0) {
                results.push('\nInterview List:');
                interviews.forEach((interview, index) => {
                    const name = interview.basicInfo?.fullName || 'Unknown';
                    const date = interview.basicInfo?.date || 'N/A';
                    results.push(`  ${index + 1}. ${name} - ${date} (${interview.id})`);
                });
            }
        } catch (e) {
            results.push('✗ Data exists but cannot be parsed: ' + e.message);
            hasIssues = true;
        }
    }
    
    // Check all localStorage keys
    results.push(`\nTotal localStorage keys: ${localStorage.length}`);
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        results.push(`  - ${key}`);
    }
    
    // Check session
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const username = sessionStorage.getItem('adminUsername');
    results.push(`\nSession: ${isLoggedIn ? 'Active' : 'Inactive'}`);
    results.push(`User: ${username || 'Unknown'}`);
    
    // Display results
    const message = results.join('\n');
    console.log(message);
    
    if (hasIssues) {
        alert('DATA VERIFICATION RESULTS:\n\n' + message + '\n\nCheck browser console (F12) for more details.');
    } else {
        alert('✓ DATA VERIFICATION SUCCESSFUL:\n\n' + message);
    }
    
    // Reload dashboard
    loadDashboard();
}

function exportAllData() {
    if (allInterviews.length === 0) {
        alert('No interviews to export');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // Landscape for table
    
    const primaryColor = [102, 126, 234];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 297, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Complete Interview Assessment Report', 148.5, 12, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148.5, 20, { align: 'center' });
    doc.text(`Total Interviews: ${allInterviews.length}`, 148.5, 25, { align: 'center' });
    
    // Summary Stats
    const recommended = allInterviews.filter(i => 
        i.finalDecision?.recommendation === 'strongly-recommend' || 
        i.finalDecision?.recommendation === 'recommend'
    ).length;
    
    const avgScore = Math.round(
        allInterviews.reduce((sum, i) => sum + (i.scores?.total || 0), 0) / allInterviews.length
    );
    
    let yPos = 40;
    doc.setTextColor(...darkGray);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`Recommended: ${recommended}`, 15, yPos);
    doc.text(`Average Score: ${avgScore}%`, 100, yPos);
    
    yPos += 8;
    
    // Prepare table data
    const tableData = allInterviews.map((interview, index) => {
        const fullName = `${interview.basicInfo?.firstName || ''} ${interview.basicInfo?.lastName || ''}`.trim();
        const date = new Date(interview.timestamp).toLocaleDateString();
        
        let recText = '';
        switch(interview.finalDecision?.recommendation) {
            case 'strongly-recommend':
                recText = 'Strongly Rec.';
                break;
            case 'recommend':
                recText = 'Recommend';
                break;
            case 'consider':
                recText = 'Consider';
                break;
            case 'not-recommend':
                recText = 'Not Rec.';
                break;
            default:
                recText = 'N/A';
        }
        
        return [
            index + 1,
            fullName,
            date,
            `${interview.scores?.total || 0}`,
            `${interview.scores?.administrative || 0}/50`,
            `${interview.scores?.financial || 0}/50`,
            recText
        ];
    });
    
    // Generate table
    doc.autoTable({
        startY: yPos,
        head: [['#', 'Applicant Name', 'Date', 'Total', 'Admin', 'Finance', 'Recommendation']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 60 },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' },
            6: { cellWidth: 35, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 },
        alternateRowStyles: { fillColor: [249, 250, 252] }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.text(
            `Page ${i} of ${pageCount}`,
            148.5,
            200,
            { align: 'center' }
        );
        doc.text(
            'Church Interview Assessment System © 2026',
            148.5,
            205,
            { align: 'center' }
        );
    }
    
    // Auto-download
    const fileName = `All_Interviews_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    // Show success notification
    showNotification('PDF downloaded successfully!', 'success');
}
    
    const today = new Date().toLocaleDateString();
    
    // Generate interview rows
    let interviewsHTML = '';
    allInterviews.forEach((interview, index) => {
        const fullName = `${interview.basicInfo?.firstName || ''} ${interview.basicInfo?.lastName || ''}`.trim();
        const date = new Date(interview.timestamp).toLocaleDateString();
        const score = interview.scores?.total || 0;
        
        let recText = '';
        let recColor = '';
        switch(interview.finalDecision?.recommendation) {
            case 'strongly-recommend':
                recText = 'Strongly Recommend';
                recColor = '#10b981';
                break;
            case 'recommend':
                recText = 'Recommend';
                recColor = '#3b82f6';
                break;
            case 'consider':
                recText = 'Consider';
                recColor = '#f59e0b';
                break;
            case 'not-recommend':
                recText = 'Not Recommend';
                recColor = '#ef4444';
                break;
            default:
                recText = 'Not Specified';
                recColor = '#6b7280';
        }
        
        interviewsHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${fullName}</strong></td>
                <td>${date}</td>
                <td><span class="score-badge">${score}/100 (${score}%)</span></td>
                <td>${interview.scores?.administrative || 0}/50</td>
                <td>${interview.scores?.financial || 0}/50</td>
                <td><span class="rec-badge" style="background: ${recColor}">${recText}</span></td>
            </tr>
        `;
    });
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>All Interviews Report - ${today}</title>
    <style>
        @media print {
            @page { margin: 1.5cm; }
            body { margin: 0; }
            .no-print { display: none; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 3px solid #667eea;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #667eea;
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #6b7280;
            font-size: 16px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
            position: sticky;
            top: 0;
        }
        
        tr:hover {
            background: #f9fafb;
        }
        
        .score-badge {
            display: inline-block;
            padding: 4px 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
        }
        
        .rec-badge {
            display: inline-block;
            padding: 4px 12px;
            color: white;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
        }
        
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .print-btn:hover {
            background: #5568d3;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
    
    <div class="header">
        <h1>Complete Interview Assessment Report</h1>
        <p>Church Administrative & Financial Analyst Position</p>
        <p>Generated: ${today}</p>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${allInterviews.length}</div>
            <div class="stat-label">Total Interviews</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${allInterviews.filter(i => i.finalDecision?.recommendation === 'strongly-recommend' || i.finalDecision?.recommendation === 'recommend').length}</div>
            <div class="stat-label">Recommended</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${Math.round(allInterviews.reduce((sum, i) => sum + (i.scores?.total || 0), 0) / allInterviews.length)}%</div>
            <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${new Date().toLocaleDateString('en', {month: 'short', year: 'numeric'})}</div>
            <div class="stat-label">Report Period</div>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Applicant Name</th>
                <th>Interview Date</th>
                <th>Total Score</th>
                <th>Admin Score</th>
                <th>Finance Score</th>
                <th>Recommendation</th>
            </tr>
        </thead>
        <tbody>
            ${interviewsHTML}
        </tbody>
    </table>
    
    <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>Church Interview Assessment System © 2026</p>
        <p>Total Records: ${allInterviews.length}</p>
    </div>
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

// Auto-refresh data every 30 seconds to catch new submissions
let autoRefreshInterval;

function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Refresh every 30 seconds
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-refreshing data...');
        const currentCount = allInterviews.length;
        loadDashboard();
        const newCount = allInterviews.length;
        
        if (newCount > currentCount) {
            console.log('New interview(s) detected! ' + currentCount + ' -> ' + newCount);
            // Show notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = (newCount - currentCount) + ' new interview(s) added!';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }, 30000); // 30 seconds
    
    console.log('Auto-refresh enabled (every 30 seconds)');
}

// Start auto-refresh when page loads
if (sessionStorage.getItem('adminLoggedIn')) {
    startAutoRefresh();
}

// Stop auto-refresh when page is hidden (save resources)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden, pausing auto-refresh');
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
    } else {
        console.log('Page visible, resuming auto-refresh');
        startAutoRefresh();
        loadDashboard(); // Refresh immediately
    }
});

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

// -------------------- Back to Top Button --------------------
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }, 100));
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard accessibility
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

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

// Initialize back to top button
initBackToTop();

console.log('%c Admin Dashboard Loaded ', 
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 8px 12px; border-radius: 4px;');
