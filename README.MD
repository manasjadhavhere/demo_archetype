# upGrad AI Specialization Assessment Platform

A gamified, interactive assessment platform that helps users discover their perfect AI career path through a fun, Kahoot-style quiz experience.

## 🎯 Features

- **Interactive Quiz**: 15 questions (5 leadership + 10 technical) with countdown timers
- **AI Specialization Detection**: Identifies whether users are best suited for:
  - 🎨 Generative AI
  - 🤖 Agentic AI
  - 📊 Applied AI
  - 🌟 AI Generalist
- **Gamification**: Animations, confetti, sound effects, and background music
- **Global Leaderboard**: Real-time rankings based on performance
- **Admin Dashboard**: Comprehensive analytics and lead management
- **Mobile Responsive**: Optimized for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd upgrad
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open in browser
```
Main App: http://localhost:3000
Admin Panel: http://localhost:3000/admin
Leaderboard: http://localhost:3000/leaderboard
```

## 📊 Scoring System

- **Technical Questions (Q6-15)**: 10 marks each = 100 total
- **Leadership Questions (Q1-5)**: For perspective only (not scored)
- **Leaderboard Ranking**:
  1. Technical Score (higher is better)
  2. Time Taken (faster is better, tracked in milliseconds)
  3. Leadership Score (tiebreaker only)

## 🎮 How It Works

1. **Landing Page**: User sees "How It Works" and starts assessment
2. **Form**: User fills in basic details (name, email, phone, company, role)
3. **Assessment**: 15 questions with countdown timers
   - Leadership questions: 15 seconds each
   - Technical questions: 20 seconds each
4. **Results**: Personalized AI specialization with score and recommendations
5. **Leaderboard**: Global rankings updated in real-time

## 🔧 Admin Panel

Access: `http://localhost:3000/admin`  
Password: `upgradopen`

### Features
- Dashboard with participant statistics
- Complete lead management
- Leaderboard view
- Analytics and charts
- CSV export functionality
- Auto-refresh every 30 seconds

## 📁 Project Structure

```
upgrad/
├── backend/
│   ├── data/              # SQLite database
│   ├── routes/            # API routes
│   ├── services/          # Database services
│   └── server.js          # Express server
├── public/
│   ├── audio/             # Background music
│   ├── css/               # Stylesheets
│   ├── js/                # Frontend JavaScript
│   ├── index.html         # Main app
│   └── leaderboard.html   # Leaderboard page
├── admin/
│   ├── css/               # Admin styles
│   ├── js/                # Admin JavaScript
│   ├── index.html         # Admin dashboard
│   └── login.html         # Admin login
└── package.json
```

## 🗄️ Database

SQLite database with the following schema:

```sql
CREATE TABLE leads (
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
```

## 🔌 API Endpoints

### Public Endpoints
- `GET /` - Main application
- `GET /leaderboard` - Leaderboard page
- `GET /api/health` - Health check
- `GET /api/leaderboard` - Get leaderboard data
- `POST /api/leads` - Submit assessment results

### Admin Endpoints
- `GET /admin` - Admin dashboard
- `GET /api/leads` - Get all leads
- `GET /api/leads/export` - Export leads as CSV
- `DELETE /api/leads/reset` - Reset all data

## 🎨 Customization

### Theme Colors
Primary color: `#FF4D00` (Orange)  
Defined in: `public/css/styles.css` and `admin/css/admin.css`

### Questions
Edit question sets in: `public/js/questions.js`  
5 different question sets available for variety

### Specializations
Modify AI specializations in: `public/js/specializations.js`

## 🔒 Security Features

- Rate limiting (100 requests per minute per IP)
- Input sanitization
- Email validation
- Security headers (XSS, Frame, Content-Type protection)
- Admin password protection

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /F /PID <process_id>

# Restart
npm start
```

### Database issues
```bash
# Test database
node test-db.js

# Check schema
node check-schema.js

# Migrate if needed
node migrate-database.js
```

### Leaderboard not loading
1. Ensure server is running
2. Check browser console for errors
3. Verify database has correct schema
4. Test API: `curl http://localhost:3000/api/leaderboard`

## 📝 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Testing
1. Take the assessment at `http://localhost:3000`
2. Check results are saved in database
3. Verify leaderboard updates
4. Test admin dashboard functionality

## 🚢 Deployment

### Environment Variables
Create a `.env` file:
```
PORT=3000
NODE_ENV=production
```

### Production Checklist
- [ ] Update admin password
- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging

## 📄 License

MIT License

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for upGrad**
