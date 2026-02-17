require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./services/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Rate limiting (simple in-memory implementation)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per window

function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return next();
    }
    
    const record = requestCounts.get(ip);
    
    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + RATE_LIMIT_WINDOW;
        return next();
    }
    
    if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    
    record.count++;
    next();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// API Routes (must come before static files)
const leadsRouter = require('./routes/leads');
app.use('/api/leads', leadsRouter);

// Leaderboard API endpoint
app.get('/api/leaderboard', async (req, res) => {
    try {
        console.log('Leaderboard endpoint called');
        const leaderboard = await database.getLeaderboard();
        console.log(`Returning ${leaderboard.length} leaderboard entries`);
        
        res.json({
            success: true,
            count: leaderboard.length,
            leaderboard: leaderboard
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch leaderboard',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// HTML Routes (must come before static files to take precedence)
// Serve leaderboard page
app.get('/leaderboard', (req, res) => {
    console.log('Serving leaderboard page');
    res.sendFile(path.join(__dirname, '../public/leaderboard.html'));
});

// Root route - serve main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Serve static files from public directory (comes after specific routes)
app.use(express.static(path.join(__dirname, '../public')));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
    try {
        await database.initializeDatabase();

        app.listen(PORT, () => {
            console.log('');
            console.log('==============================================');
            console.log('  🎓 upGrad AI Specialization Quiz');
            console.log('  🤖 Discover Your AI Superpower!');
            console.log('==============================================');
            console.log('');
            console.log(`✓ Server running on port: ${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✓ Main app: http://localhost:${PORT}`);
            console.log(`✓ Admin panel: http://localhost:${PORT}/admin`);
            console.log(`✓ API endpoints: http://localhost:${PORT}/api`);
            console.log(`✓ Leaderboard: http://localhost:${PORT}/api/leaderboard`);
            console.log('');
            console.log('==============================================');
            console.log('  Ready for users! 🚀');
            console.log('==============================================');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
