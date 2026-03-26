const { Pool } = require('pg');

// Use DATABASE_URL from environment (Render PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database - create table if not exists
async function initializeDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                designation TEXT,
                company TEXT,
                phone TEXT,
                email TEXT NOT NULL,
                area_of_interest TEXT,
                specialization TEXT,
                archetype TEXT,
                scores TEXT,
                answers TEXT,
                management_score INTEGER DEFAULT 0,
                technical_score INTEGER DEFAULT 0,
                total_time INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Leads table ready');
    } finally {
        client.release();
    }
}

// Insert new lead
async function insertLead(leadData) {
    const scores = JSON.stringify(leadData.scores || {});
    const answers = JSON.stringify(leadData.answers || []);
    const result = await pool.query(
        `INSERT INTO leads (full_name, designation, company, phone, email, area_of_interest, specialization, archetype, scores, answers, management_score, technical_score, total_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
        [
            leadData.fullName,
            leadData.designation,
            leadData.company,
            leadData.phone,
            leadData.email,
            leadData.areaOfInterest,
            leadData.specialization || null,
            leadData.archetype || null,
            scores,
            answers,
            leadData.managementScore || 0,
            leadData.technicalScore || 0,
            leadData.totalTime || 0
        ]
    );
    console.log(`Lead inserted with ID: ${result.rows[0].id}`);
    return { id: result.rows[0].id };
}

// Get all leads
async function getAllLeads() {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    return result.rows.map(row => ({
        ...row,
        scores: row.scores ? JSON.parse(row.scores) : {},
        answers: row.answers ? JSON.parse(row.answers) : []
    }));
}

// Get lead by ID
async function getLeadById(id) {
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    const row = result.rows[0];
    if (row) {
        row.scores = row.scores ? JSON.parse(row.scores) : {};
        row.answers = row.answers ? JSON.parse(row.answers) : [];
    }
    return row || null;
}

// Get leaderboard (sorted by technical score, then time, then management score)
async function getLeaderboard() {
    const result = await pool.query(`
        SELECT id, full_name, specialization, technical_score, management_score, total_time, created_at
        FROM leads
        ORDER BY technical_score DESC, total_time ASC, management_score DESC
        LIMIT 100
    `);
    console.log(`Leaderboard query returned ${result.rows.length} rows`);
    return result.rows;
}

// Export to CSV format
async function exportToCSV() {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    const rows = result.rows;

    if (rows.length === 0) return 'No leads to export';

    let csv = 'ID,Full Name,Designation,Company,Phone,Email,Area of Interest,Specialization,Archetype,Technical Score,Management Score,Total Time,Created At\n';
    rows.forEach(row => {
        csv += `${row.id},"${row.full_name}","${row.designation || ''}","${row.company || ''}","${row.phone || ''}","${row.email}","${row.area_of_interest || ''}","${row.specialization || ''}","${row.archetype || ''}","${row.technical_score}","${row.management_score}","${row.total_time}","${row.created_at}"\n`;
    });
    return csv;
}

// Reset all leads
async function resetAllLeads() {
    const result = await pool.query('DELETE FROM leads');
    console.log(`All leads deleted. ${result.rowCount} rows affected.`);
    return { deletedCount: result.rowCount };
}

module.exports = {
    initializeDatabase,
    insertLead,
    getAllLeads,
    getLeadById,
    getLeaderboard,
    exportToCSV,
    resetAllLeads
};
