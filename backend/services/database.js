const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path - ensure data directory exists
const DATA_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DATA_DIR, 'leads.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created data directory');
}

// Initialize database
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }

            console.log('Connected to SQLite database');

            // Create leads table with updated schema
            db.run(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          designation TEXT,
          company TEXT,
          phone TEXT,
          email TEXT NOT NULL,
          area_of_interest TEXT,
          specialization TEXT,
          management_score INTEGER DEFAULT 0,
          technical_score INTEGER DEFAULT 0,
          total_time INTEGER DEFAULT 0,
          answers TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    reject(err);
                } else {
                    console.log('Leads table ready');
                    
                    // Check if we need to migrate from old schema
                    db.all("PRAGMA table_info(leads)", (err, columns) => {
                        if (err) {
                            console.error('Error checking schema:', err);
                            reject(err);
                            return;
                        }
                        
                        const hasSpecialization = columns.some(col => col.name === 'specialization');
                        const hasTechnicalScore = columns.some(col => col.name === 'technical_score');
                        
                        if (!hasSpecialization || !hasTechnicalScore) {
                            console.warn('⚠ Old database schema detected!');
                            console.warn('⚠ Please run: node migrate-database.js');
                            console.warn('⚠ Then restart the server');
                        }
                        
                        resolve(db);
                    });
                }
            });
        });
    });
}

// Insert new lead
function insertLead(leadData) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH);

        const sql = `
      INSERT INTO leads (full_name, designation, company, phone, email, area_of_interest, specialization, management_score, technical_score, total_time, answers)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const answers = JSON.stringify(leadData.answers || []);

        db.run(sql, [
            leadData.fullName,
            leadData.designation,
            leadData.company,
            leadData.phone,
            leadData.email,
            leadData.areaOfInterest,
            leadData.specialization,
            leadData.managementScore || 0,
            leadData.technicalScore || 0,
            leadData.totalTime || 0,
            answers
        ], function (err) {
            if (err) {
                console.error('Error inserting lead:', err);
                reject(err);
            } else {
                console.log(`Lead inserted with ID: ${this.lastID}`);
                resolve({ id: this.lastID });
            }
            db.close();
        });
    });
}

// Get all leads
function getAllLeads() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH);

        db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
            if (err) {
                console.error('Error fetching leads:', err);
                reject(err);
            } else {
                // Parse answers JSON
                const leads = rows.map(row => ({
                    ...row,
                    answers: row.answers ? JSON.parse(row.answers) : []
                }));
                resolve(leads);
            }
            db.close();
        });
    });
}

// Get lead by ID
function getLeadById(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH);

        db.get('SELECT * FROM leads WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error fetching lead:', err);
                reject(err);
            } else {
                if (row) {
                    row.answers = row.answers ? JSON.parse(row.answers) : [];
                }
                resolve(row);
            }
            db.close();
        });
    });
}

// Get leaderboard (sorted by technical score, then time with milliseconds, then management score)
function getLeaderboard() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database for leaderboard:', err);
                reject(err);
                return;
            }
        });

        const sql = `
            SELECT id, full_name, specialization, technical_score, management_score, total_time, created_at
            FROM leads
            ORDER BY technical_score DESC, total_time ASC, management_score DESC
            LIMIT 100
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error fetching leaderboard:', err);
                db.close();
                reject(err);
            } else {
                console.log(`Leaderboard query returned ${rows.length} rows`);
                db.close();
                resolve(rows);
            }
        });
    });
}

// Export to CSV format
function exportToCSV() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH);

        db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
            if (err) {
                console.error('Error fetching leads for CSV:', err);
                reject(err);
                return;
            }

            if (rows.length === 0) {
                resolve('No leads to export');
                db.close();
                return;
            }

            // CSV header
            let csv = 'ID,Full Name,Designation,Company,Phone,Email,Area of Interest,Specialization,Technical Score,Management Score,Total Time,Created At\n';

            // CSV rows
            rows.forEach(row => {
                csv += `${row.id},"${row.full_name}","${row.designation}","${row.company}","${row.phone}","${row.email}","${row.area_of_interest}","${row.specialization}","${row.technical_score}","${row.management_score}","${row.total_time}","${row.created_at}"\n`;
            });

            resolve(csv);
            db.close();
        });
    });
}

// Reset all leads (delete all data)
function resetAllLeads() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH);

        db.run('DELETE FROM leads', [], function (err) {
            if (err) {
                console.error('Error resetting leads:', err);
                reject(err);
            } else {
                console.log(`All leads deleted. ${this.changes} rows affected.`);
                resolve({ deletedCount: this.changes });
            }
            db.close();
        });
    });
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
