# Corporate Archetype Diagnostic Tool | upGrad

A professional, enterprise-grade web application for assessing corporate leadership archetypes and capturing qualified leads.

## 🎯 Overview

This tool helps professionals discover their corporate archetype through an interactive 2-minute assessment, providing personalized program recommendations from upGrad's portfolio.

### Key Features

**User-Facing:**
- Interactive 2-minute assessment with progress tracking
- Personalized archetype results (Strategic Architect, Operational Commander, Innovation Pioneer, People Catalyst)
- Tailored program recommendations
- Professional upGrad branding and design
- Instructions popup for first-time users
- Mobile-responsive design

**Admin Panel:**
- Real-time dashboard with statistics
- Date range filters (Today, This Week, This Month, This Year, All Time)
- Filtered CSV export with custom date ranges
- Analytics and charts
- Database reset functionality with confirmation
- Professional SVG icons throughout

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd upgrad

# Install dependencies
npm install

# Start the server
npm start
```

### Access the Application

- **Main App:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## 📁 Project Structure

```
upgrad/
├── admin/                  # Admin panel
│   ├── css/
│   │   └── admin.css      # Admin styles
│   ├── js/
│   │   └── admin.js       # Admin functionality
│   └── index.html         # Admin interface
├── backend/               # Server-side code
│   ├── data/
│   │   └── leads.db       # SQLite database
│   ├── routes/
│   │   └── leads.js       # API routes
│   ├── services/
│   │   └── database.js    # Database operations
│   └── server.js          # Express server
├── public/                # Main application
│   ├── css/
│   │   └── styles.css     # Main styles
│   ├── js/
│   │   ├── app.js         # Main app logic
│   │   ├── archetypes.js  # Archetype definitions
│   │   └── questions.js   # Assessment questions
│   └── index.html         # Main interface
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.MD             # This file
```

## 🎨 Features in Detail

### Main Application

**Instructions Popup**
- Automatically displays on page load
- Explains the 4-step assessment process
- Shows admin access information
- Professional SVG icons

**Assessment Flow**
- Progress bar showing completion
- Emoji-based questions for engagement
- Smooth transitions between questions
- Real-time score calculation

**Results & Lead Capture**
- Blurred results preview
- Form overlay for lead capture
- Email and phone validation
- Results reveal after submission

### Admin Panel

**Dashboard**
- Total leads count
- Archetype distribution
- Recent leads preview
- Professional statistics cards

**Leads Management**
- Comprehensive leads table
- Date range filtering (5 options)
- Real-time filter statistics
- Search and sort capabilities

**Export Functionality**
- Modal with date range selection
- Filtered CSV export
- Descriptive filenames (e.g., `leads-today-2026-02-15.csv`)
- Success notifications

**Settings**
- Database reset with confirmation
- Type "admin" to confirm deletion
- Danger zone with clear warnings
- Irreversible action protection

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

### Database

The application uses SQLite for data storage. The database is automatically created on first run at `backend/data/leads.db`.

## 📊 API Endpoints

### Public Endpoints

```
POST   /api/leads          # Submit new lead
GET    /api/health         # Health check
```

### Admin Endpoints

```
GET    /api/leads          # Get all leads
GET    /api/leads/:id      # Get specific lead
DELETE /api/leads/reset    # Reset all data (admin only)
```

## 🎯 Admin Panel Features

### Date Filters
- **All Time:** Export all leads
- **Today:** Leads from today only
- **This Week:** Last 7 days
- **This Month:** Current month
- **This Year:** Current year

### Database Reset
1. Navigate to Settings section
2. Click "Reset Database"
3. Type "admin" in confirmation box
4. Click "Delete All Data"
5. All leads permanently deleted

## 🚀 Deployment

### Recommended: Render.com (Free)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Render**
- Go to https://render.com
- Sign up with GitHub
- New Web Service
- Connect your repository
- Configure:
  - Build Command: `npm install`
  - Start Command: `node backend/server.js`
  - Plan: Free

3. **Access Your App**
- Main: `https://your-app.onrender.com`
- Admin: `https://your-app.onrender.com/admin`

### Alternative Platforms
- Railway.app
- Vercel (frontend) + Render (backend)
- Glitch.com
- Cyclic.sh

See `PRODUCTION_DEPLOYMENT.MD` for detailed deployment instructions.

## 🧪 Testing

### Local Testing
```bash
npm start
```

### Test Checklist
- [ ] Instructions popup appears
- [ ] Assessment completes successfully
- [ ] Form validation works
- [ ] Results display correctly
- [ ] Admin panel loads
- [ ] Filters work correctly
- [ ] CSV export works
- [ ] Reset functionality works

## 🎨 Design System

### Colors
- Primary Red: `#EB2226` (upGrad brand)
- Background: `#FFFFFF` (Clean white)
- Text: `#000000` / `#333333`
- Borders: `#DDDDDD`

### Typography
- Font Family: Inter
- Weights: 400, 500, 600, 700, 800

### Icons
- Format: SVG (inline)
- Style: Outline/stroke
- Stroke Width: 1.5-2px

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🔒 Security Features

- Input sanitization
- Email validation
- Phone validation
- Rate limiting (100 requests/minute)
- Security headers (XSS, CSRF protection)
- CORS enabled
- SQL injection prevention

## 📈 Performance

- Lightweight (< 500KB total)
- Fast load times
- Optimized images
- Inline SVG icons
- Client-side CSV generation
- Efficient database queries

## 🤝 Contributing

This is a proprietary project for upGrad. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

## 📄 License

Proprietary - upGrad AIverse

## 📞 Support

For technical support or questions:
- Email: support@upgrad.com
- Phone: 1800 210 2020

## 🎉 Credits

Developed for upGrad AIverse
- Design: upGrad Brand Guidelines
- Development: Custom built
- Icons: Custom SVG icons

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready ✅
