const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const DB_PATH = path.join(__dirname, '../data/leads.db');

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

            // Create leads table
            db.run(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          designation TEXT,
          company TEXT,
          phone TEXT,
          email TEXT NOT NULL,
          area_of_interest TEXT,
          archetype TEXT,
          scores TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    reject(err);
                } else {
                    console.log('Leads table ready');
                    resolve(db);
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
      INSERT INTO leads (full_name, designation, company, phone, email, area_of_interest, archetype, scores)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const scores = JSON.stringify(leadData.scores || {});

        db.run(sql, [
            leadData.fullName,
            leadData.designation,
            leadData.company,
            leadData.phone,
            leadData.email,
            leadData.areaOfInterest,
            leadData.archetype,
            scores
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
                // Parse scores JSON
                const leads = rows.map(row => ({
                    ...row,
                    scores: row.scores ? JSON.parse(row.scores) : {}
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
                    row.scores = row.scores ? JSON.parse(row.scores) : {};
                }
                resolve(row);
            }
            db.close();
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
            let csv = 'ID,Full Name,Designation,Company,Phone,Email,Area of Interest,Archetype,Created At\n';

            // CSV rows
            rows.forEach(row => {
                csv += `${row.id},"${row.full_name}","${row.designation}","${row.company}","${row.phone}","${row.email}","${row.area_of_interest}","${row.archetype}","${row.created_at}"\n`;
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
    exportToCSV,
    resetAllLeads
};
