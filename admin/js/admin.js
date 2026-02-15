// Admin Dashboard JavaScript

let leadsData = [];
let filteredLeads = [];
let currentFilter = 'all';

// Configuration
const config = {
    apiBaseUrl: window.location.origin
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function () {
    initializeAdmin();
    loadLeads();

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
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Switch between sections
function switchSection(sectionName) {
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Update header title
    const titles = {
        dashboard: 'Dashboard',
        leads: 'All Leads',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    document.getElementById('section-title').textContent = titles[sectionName];
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
    // Total leads
    document.getElementById('total-leads').textContent = leadsData.length;

    // Count archetypes
    const archetypeCounts = {
        architect: 0,
        commander: 0,
        pioneer: 0,
        catalyst: 0
    };

    leadsData.forEach(lead => {
        if (archetypeCounts.hasOwnProperty(lead.archetype)) {
            archetypeCounts[lead.archetype]++;
        }
    });

    document.getElementById('architect-count').textContent = archetypeCounts.architect;
    document.getElementById('commander-count').textContent = archetypeCounts.commander;
    document.getElementById('pioneer-count').textContent = archetypeCounts.pioneer;
    document.getElementById('catalyst-count').textContent = archetypeCounts.catalyst;

    // Show recent leads (last 5)
    const recentLeads = leadsData.slice(0, 5);
    const recentContainer = document.getElementById('recent-leads');

    if (recentLeads.length === 0) {
        recentContainer.innerHTML = '<p style="color: var(--text-muted);">No leads yet</p>';
        return;
    }

    recentContainer.innerHTML = recentLeads.map(lead => `
    <div class="lead-preview-item">
      <div class="lead-info">
        <div class="lead-name">${lead.full_name}</div>
        <div class="lead-details">${lead.company} • ${lead.designation}</div>
      </div>
      <div class="lead-archetype archetype-${lead.archetype}">
        ${formatArchetype(lead.archetype)}
      </div>
    </div>
  `).join('');
}

// Render leads table
function renderLeadsTable() {
    const tbody = document.getElementById('leads-table-body');

    if (filteredLeads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No leads found for this filter</td></tr>';
        return;
    }

    tbody.innerHTML = filteredLeads.map(lead => `
    <tr>
      <td>${lead.id}</td>
      <td>${lead.full_name}</td>
      <td>${lead.designation || '-'}</td>
      <td>${lead.company || '-'}</td>
      <td>${lead.phone || '-'}</td>
      <td>${lead.email}</td>
      <td>${lead.area_of_interest || '-'}</td>
      <td><span class="lead-archetype archetype-${lead.archetype}">${formatArchetype(lead.archetype)}</span></td>
      <td>${formatDate(lead.created_at)}</td>
    </tr>
  `).join('');
}

// Render analytics charts
function renderAnalytics() {
    // Archetype distribution
    const archetypeCounts = {
        'Strategic Architect': 0,
        'Operational Commander': 0,
        'Innovation Pioneer': 0,
        'People Catalyst': 0
    };

    leadsData.forEach(lead => {
        const formatted = formatArchetype(lead.archetype);
        if (archetypeCounts.hasOwnProperty(formatted)) {
            archetypeCounts[formatted]++;
        }
    });

    const maxCount = Math.max(...Object.values(archetypeCounts), 1);

    const archetypeChart = document.getElementById('archetype-chart');
    archetypeChart.innerHTML = Object.entries(archetypeCounts).map(([label, count]) => {
        const percentage = (count / maxCount) * 100;
        return `
      <div class="chart-bar">
        <div class="chart-label">${label}</div>
        <div class="chart-bar-container">
          <div class="chart-bar-fill" style="width: ${percentage}%">
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
          <div class="chart-bar-fill" style="width: ${percentage}%">
            <span class="chart-bar-value">${count}</span>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

// Export CSV
async function exportCSV(filter = 'all') {
    try {
        // Close modal if open
        closeExportModal();
        
        // Get filtered leads based on selection
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
        let csv = 'ID,Full Name,Designation,Company,Phone,Email,Area of Interest,Archetype,Created At\n';
        
        leadsToExport.forEach(lead => {
            csv += `${lead.id},"${lead.full_name}","${lead.designation || ''}","${lead.company || ''}","${lead.phone || ''}","${lead.email}","${lead.area_of_interest || ''}","${formatArchetype(lead.archetype)}","${lead.created_at}"\n`;
        });
        
        // Create download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename with filter and date
        const dateStr = new Date().toISOString().split('T')[0];
        const filterName = filter === 'all' ? 'all-time' : filter;
        a.download = `leads-${filterName}-${dateStr}.csv`;
        
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

// Show export modal
function showExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close export modal
function closeExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show success notification
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 15px 20px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Show reset modal
function showResetModal() {
    const modal = document.getElementById('reset-modal');
    const input = document.getElementById('reset-confirmation');
    const btn = document.getElementById('confirm-reset-btn');
    
    if (modal) {
        modal.style.display = 'flex';
        input.value = '';
        btn.disabled = true;
        
        // Enable button when "admin" is typed
        input.addEventListener('input', function() {
            btn.disabled = this.value.toLowerCase() !== 'admin';
        });
    }
}

// Close reset modal
function closeResetModal() {
    const modal = document.getElementById('reset-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Confirm and execute reset
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
            
            // Reload data after 1 second
            setTimeout(() => {
                loadLeads();
            }, 1000);
        } else {
            throw new Error(data.error || 'Failed to reset database');
        }
    } catch (error) {
        console.error('Error resetting database:', error);
        showError('Failed to reset database. Please try again.');
    }
}

// Helper functions
function formatArchetype(archetype) {
    const map = {
        architect: 'Strategic Architect',
        commander: 'Operational Commander',
        pioneer: 'Innovation Pioneer',
        catalyst: 'People Catalyst'
    };
    return map[archetype] || archetype;
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

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ff4444; color: white; padding: 15px 20px; border-radius: 8px; z-index: 1000;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function initializeAdmin() {
    console.log('Admin dashboard initialized');
}
