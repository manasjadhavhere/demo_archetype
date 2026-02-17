// Admin Dashboard JavaScript - upGrad AI Assessment

let leadsData = [];
let filteredLeads = [];
let currentFilter = 'all';

// Configuration
const config = {
    apiBaseUrl: window.location.origin
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    if (sessionStorage.getItem('adminAuth') !== 'true') {
        window.location.href = '/admin/login.html';
        return;
    }

    initializeAdmin();
    loadLeads();

    // Auto-refresh every 30 seconds
    setInterval(() => {
        console.log('Auto-refreshing data...');
        loadLeads();
        
        // Refresh leaderboard if on that section
        const leaderboardSection = document.getElementById('leaderboard-section');
        if (leaderboardSection && leaderboardSection.classList.contains('active')) {
            loadLeaderboard();
        }
    }, 30000);

    // Set up navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionName = this.getAttribute('data-section');
            switchSection(sectionName);
        });
    });

    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            applyFilter(filter);
            
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminAuth');
        window.location.href = '/admin/login.html';
    }
}

// Switch between sections
function switchSection(sectionName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');

    const titles = {
        dashboard: 'Dashboard',
        leads: 'All Participants',
        leaderboard: 'Leaderboard',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    document.getElementById('section-title').textContent = titles[sectionName];

    // Load leaderboard when switching to that section
    if (sectionName === 'leaderboard') {
        loadLeaderboard();
    }
}

// Load leads from API
async function loadLeads() {
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/leads`);
        const data = await response.json();

        if (data.success) {
            leadsData = data.leads;
            filteredLeads = [...leadsData];
            updateDashboard();
            renderLeadsTable();
            renderAnalytics();
            updateFilterStats();
        }
    } catch (error) {
        console.error('Error loading leads:', error);
        showError('Failed to load leads. Please refresh the page.');
    }
}

// Load leaderboard
async function loadLeaderboard() {
    console.log('Loading leaderboard...');
    
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/leaderboard`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Leaderboard loaded:', data);

        if (data.success && data.leaderboard && data.leaderboard.length > 0) {
            renderLeaderboard(data.leaderboard);
        } else {
            const container = document.getElementById('leaderboard-list');
            container.innerHTML = '<p style="text-align: center; color: #6B7280; padding: 2rem;">No participants yet</p>';
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showError('Failed to load leaderboard: ' + error.message);
        
        const container = document.getElementById('leaderboard-list');
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #EF4444; margin-bottom: 1rem;">Failed to load leaderboard</p>
                <button onclick="loadLeaderboard()" class="btn-primary">Retry</button>
            </div>
        `;
    }
}

// Render leaderboard
function renderLeaderboard(leaderboard) {
    const container = document.getElementById('leaderboard-list');

    if (leaderboard.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6B7280; padding: 2rem;">No participants yet</p>';
        return;
    }

    container.innerHTML = leaderboard.map((entry, index) => {
        const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const rankClass = index < 3 ? 'top-rank' : '';
        
        return `
            <div class="leaderboard-item ${rankClass}">
                <div class="rank">${rankEmoji} #${index + 1}</div>
                <div class="user-info">
                    <div class="user-name">${entry.full_name}</div>
                    <div class="user-spec">${formatSpecialization(entry.specialization)}</div>
                </div>
                <div class="scores">
                    <div class="score-badge primary">🎯 ${entry.technical_score}/100</div>
                    <div class="score-badge time">⏱️ ${formatTimeMs(entry.total_time)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Apply date filter
function applyFilter(filter) {
    currentFilter = filter;
    const now = new Date();
    
    if (filter === 'all') {
        filteredLeads = [...leadsData];
    } else {
        filteredLeads = leadsData.filter(lead => {
            const leadDate = new Date(lead.created_at);
            
            switch(filter) {
                case 'today':
                    return leadDate.toDateString() === now.toDateString();
                    
                case 'week':
                    const weekAgo = new Date(now);
                    weekAgo.setDate(now.getDate() - 7);
                    return leadDate >= weekAgo;
                    
                case 'month':
                    return leadDate.getMonth() === now.getMonth() && 
                           leadDate.getFullYear() === now.getFullYear();
                    
                case 'year':
                    return leadDate.getFullYear() === now.getFullYear();
                    
                default:
                    return true;
            }
        });
    }
    
    renderLeadsTable();
    updateFilterStats();
}

// Update filter statistics
function updateFilterStats() {
    document.getElementById('filtered-count').textContent = filteredLeads.length;
    document.getElementById('total-count').textContent = leadsData.length;
}

// Update dashboard stats
function updateDashboard() {
    document.getElementById('total-leads').textContent = leadsData.length;

    const specializationCounts = {
        genai: 0,
        agentic: 0,
        applied: 0,
        mixed: 0
    };

    leadsData.forEach(lead => {
        if (specializationCounts.hasOwnProperty(lead.specialization)) {
            specializationCounts[lead.specialization]++;
        }
    });

    document.getElementById('genai-count').textContent = specializationCounts.genai;
    document.getElementById('agentic-count').textContent = specializationCounts.agentic;
    document.getElementById('applied-count').textContent = specializationCounts.applied;
    document.getElementById('mixed-count').textContent = specializationCounts.mixed;

    // Show recent leads
    const recentLeads = leadsData.slice(0, 5);
    const recentContainer = document.getElementById('recent-leads');

    if (recentLeads.length === 0) {
        recentContainer.innerHTML = '<p style="color: #6B7280;">No participants yet</p>';
        return;
    }

    recentContainer.innerHTML = recentLeads.map(lead => `
        <div class="lead-preview-item">
            <div class="lead-info">
                <div class="lead-name">${lead.full_name}</div>
                <div class="lead-details">${lead.email} • ${lead.company || 'N/A'}</div>
            </div>
            <div class="lead-spec spec-${lead.specialization}">
                ${formatSpecialization(lead.specialization)}
            </div>
            <div class="lead-scores">
                <span class="score-mini">🎯 ${lead.technical_score}/100</span>
                <span class="score-mini">⏱️ ${formatTimeMs(lead.total_time)}</span>
            </div>
        </div>
    `).join('');
}

// Render leads table
function renderLeadsTable() {
    const tbody = document.getElementById('leads-table-body');

    if (filteredLeads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2rem;">No leads found for this filter</td></tr>';
        return;
    }

    tbody.innerHTML = filteredLeads.map(lead => `
        <tr>
            <td>${lead.id}</td>
            <td>${lead.full_name}</td>
            <td>${lead.email}</td>
            <td>${lead.phone || '-'}</td>
            <td>${lead.company || '-'}</td>
            <td>${lead.area_of_interest || '-'}</td>
            <td><span class="spec-badge spec-${lead.specialization}">${formatSpecialization(lead.specialization)}</span></td>
            <td><strong>${lead.technical_score}/100</strong></td>
            <td>${lead.management_score}</td>
            <td>${formatTimeMs(lead.total_time)}</td>
            <td>${formatDate(lead.created_at)}</td>
        </tr>
    `).join('');
}

// Render analytics charts
function renderAnalytics() {
    // Specialization distribution
    const specializationCounts = {
        'Gen AI': 0,
        'Agentic AI': 0,
        'Applied AI': 0,
        'Generalist': 0
    };

    leadsData.forEach(lead => {
        const formatted = formatSpecialization(lead.specialization);
        if (formatted.includes('Gen AI')) specializationCounts['Gen AI']++;
        else if (formatted.includes('Agentic')) specializationCounts['Agentic AI']++;
        else if (formatted.includes('Applied')) specializationCounts['Applied AI']++;
        else specializationCounts['Generalist']++;
    });

    const maxCount = Math.max(...Object.values(specializationCounts), 1);

    const specializationChart = document.getElementById('specialization-chart');
    specializationChart.innerHTML = Object.entries(specializationCounts).map(([label, count]) => {
        const percentage = (count / maxCount) * 100;
        const color = label === 'Gen AI' ? '#8B5CF6' : 
                     label === 'Agentic AI' ? '#3B82F6' : 
                     label === 'Applied AI' ? '#10B981' : '#F59E0B';
        return `
            <div class="chart-bar">
                <div class="chart-label">${label}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background: ${color};">
                        <span class="chart-bar-value">${count}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Interest distribution
    const interestCounts = {};
    leadsData.forEach(lead => {
        const interest = lead.area_of_interest || 'Not Specified';
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });

    const maxInterest = Math.max(...Object.values(interestCounts), 1);

    const interestChart = document.getElementById('interest-chart');
    interestChart.innerHTML = Object.entries(interestCounts).map(([label, count]) => {
        const percentage = (count / maxInterest) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-label">${label}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background: #FF4D00;">
                        <span class="chart-bar-value">${count}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Average scores
    const avgTechnical = leadsData.length > 0 ? 
        Math.round(leadsData.reduce((sum, l) => sum + l.technical_score, 0) / leadsData.length) : 0;
    const avgManagement = leadsData.length > 0 ? 
        Math.round(leadsData.reduce((sum, l) => sum + l.management_score, 0) / leadsData.length) : 0;
    const avgTime = leadsData.length > 0 ? 
        Math.round(leadsData.reduce((sum, l) => sum + l.total_time, 0) / leadsData.length) : 0;

    const scoresChart = document.getElementById('scores-chart');
    scoresChart.innerHTML = `
        <div class="chart-bar">
            <div class="chart-label">Avg Technical Score</div>
            <div class="chart-bar-container">
                <div class="chart-bar-fill" style="width: ${(avgTechnical/50)*100}%; background: #3B82F6;">
                    <span class="chart-bar-value">${avgTechnical}</span>
                </div>
            </div>
        </div>
        <div class="chart-bar">
            <div class="chart-label">Avg Management Score</div>
            <div class="chart-bar-container">
                <div class="chart-bar-fill" style="width: ${(avgManagement/15)*100}%; background: #8B5CF6;">
                    <span class="chart-bar-value">${avgManagement}</span>
                </div>
            </div>
        </div>
        <div class="chart-bar">
            <div class="chart-label">Avg Time (seconds)</div>
            <div class="chart-bar-container">
                <div class="chart-bar-fill" style="width: ${(avgTime/300)*100}%; background: #10B981;">
                    <span class="chart-bar-value">${avgTime}s</span>
                </div>
            </div>
        </div>
    `;
}

// Export CSV
async function exportCSV(filter = 'all') {
    try {
        closeExportModal();
        
        let leadsToExport = [];
        const now = new Date();
        
        if (filter === 'all') {
            leadsToExport = leadsData;
        } else {
            leadsToExport = leadsData.filter(lead => {
                const leadDate = new Date(lead.created_at);
                
                switch(filter) {
                    case 'today':
                        return leadDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now);
                        weekAgo.setDate(now.getDate() - 7);
                        return leadDate >= weekAgo;
                    case 'month':
                        return leadDate.getMonth() === now.getMonth() && 
                               leadDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return leadDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }
        
        if (leadsToExport.length === 0) {
            showError('No leads found for the selected date range');
            return;
        }
        
        // Generate CSV
        let csv = 'ID,Full Name,Email,Phone,Company,Designation,Area of Interest,Specialization,Technical Score,Management Score,Total Time,Created At\n';
        
        leadsToExport.forEach(lead => {
            csv += `${lead.id},"${lead.full_name}","${lead.email}","${lead.phone || ''}","${lead.company || ''}","${lead.designation || ''}","${lead.area_of_interest || ''}","${formatSpecialization(lead.specialization)}",${lead.technical_score},${lead.management_score},${lead.total_time},"${lead.created_at}"\n`;
        });
        
        // Create download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const dateStr = new Date().toISOString().split('T')[0];
        const filterName = filter === 'all' ? 'all-time' : filter;
        a.download = `upgrad-ai-assessment-${filterName}-${dateStr}.csv`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showSuccess(`Exported ${leadsToExport.length} leads successfully`);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showError('Failed to export CSV');
    }
}

// Show/close modals
function showExportModal() {
    document.getElementById('export-modal').style.display = 'flex';
}

function closeExportModal() {
    document.getElementById('export-modal').style.display = 'none';
}

function showResetModal() {
    const modal = document.getElementById('reset-modal');
    const input = document.getElementById('reset-confirmation');
    const btn = document.getElementById('confirm-reset-btn');
    
    if (modal) {
        modal.style.display = 'flex';
        input.value = '';
        btn.disabled = true;
        
        input.addEventListener('input', function() {
            btn.disabled = this.value.toLowerCase() !== 'admin';
        });
    }
}

function closeResetModal() {
    document.getElementById('reset-modal').style.display = 'none';
}

async function confirmReset() {
    const input = document.getElementById('reset-confirmation');
    
    if (input.value.toLowerCase() !== 'admin') {
        showError('Please type "admin" to confirm');
        return;
    }
    
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/leads/reset`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeResetModal();
            showSuccess('All data has been deleted successfully');
            setTimeout(() => loadLeads(), 1000);
        } else {
            throw new Error(data.error || 'Failed to reset database');
        }
    } catch (error) {
        console.error('Error resetting database:', error);
        showError('Failed to reset database. Please try again.');
    }
}

// Helper functions
function formatSpecialization(spec) {
    const map = {
        genai: 'Generative AI Specialist',
        agentic: 'Agentic AI Specialist',
        applied: 'Applied AI Specialist',
        mixed: 'AI Generalist'
    };
    return map[spec] || spec;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimeMs(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Centiseconds
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 15px 20px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); animation: slideIn 0.3s ease;';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #EF4444; color: white; padding: 15px 20px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); animation: slideIn 0.3s ease;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function initializeAdmin() {
    console.log('upGrad Admin Dashboard initialized');
}
