const express = require('express');
const router = express.Router();
const database = require('../services/database');

// Simple input sanitization
function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
}

// POST /api/leads - Submit new lead
router.post('/', async (req, res) => {
    try {
        const leadData = req.body;

        // Validate required fields
        if (!leadData.fullName || !leadData.email) {
            return res.status(400).json({
                error: 'Full name and email are required'
            });
        }

        // Sanitize inputs
        const sanitizedData = {
            fullName: sanitizeInput(leadData.fullName),
            designation: sanitizeInput(leadData.designation),
            company: sanitizeInput(leadData.company),
            phone: sanitizeInput(leadData.phone),
            email: sanitizeInput(leadData.email),
            areaOfInterest: sanitizeInput(leadData.areaOfInterest),
            specialization: sanitizeInput(leadData.specialization),
            managementScore: parseInt(leadData.managementScore) || 0,
            technicalScore: parseInt(leadData.technicalScore) || 0,
            totalTime: parseInt(leadData.totalTime) || 0,
            answers: leadData.answers
        };

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedData.email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Insert lead into database
        const result = await database.insertLead(sanitizedData);

        res.status(201).json({
            success: true,
            message: 'Lead captured successfully',
            leadId: result.id
        });

    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({
            error: 'Failed to save lead data'
        });
    }
});

// GET /api/leads - Get all leads (for admin)
router.get('/', async (req, res) => {
    try {
        const leads = await database.getAllLeads();
        res.json({
            success: true,
            count: leads.length,
            leads: leads
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({
            error: 'Failed to fetch leads'
        });
    }
});

// GET /api/leads/export - Export leads as CSV
router.get('/export', async (req, res) => {
    try {
        const csv = await database.exportToCSV();

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.send(csv);

    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({
            error: 'Failed to export CSV'
        });
    }
});

// DELETE /api/leads/reset - Reset all leads (admin only)
router.delete('/reset', async (req, res) => {
    try {
        await database.resetAllLeads();
        
        res.json({
            success: true,
            message: 'All leads have been deleted successfully'
        });
    } catch (error) {
        console.error('Error resetting leads:', error);
        res.status(500).json({
            error: 'Failed to reset database'
        });
    }
});

// GET /api/leads/:id - Get specific lead
router.get('/:id', async (req, res) => {
    try {
        const lead = await database.getLeadById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                error: 'Lead not found'
            });
        }

        res.json({
            success: true,
            lead: lead
        });

    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({
            error: 'Failed to fetch lead'
        });
    }
});

// GET /api/leaderboard - Get leaderboard rankings
router.get('/leaderboard/rankings', async (req, res) => {
    try {
        const leaderboard = await database.getLeaderboard();
        
        res.json({
            success: true,
            count: leaderboard.length,
            leaderboard: leaderboard
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            error: 'Failed to fetch leaderboard'
        });
    }
});

module.exports = router;
