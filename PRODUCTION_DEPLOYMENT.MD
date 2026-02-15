# 🚀 Production Deployment Guide

Complete guide for deploying the Corporate Archetype Tool to production.

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors
- [ ] Database working correctly
- [ ] CSV export tested
- [ ] Reset functionality tested
- [ ] Mobile responsive verified
- [ ] Cross-browser tested

### Configuration
- [ ] `.env` file not committed (in `.gitignore`)
- [ ] `package.json` has correct start script
- [ ] Port is dynamic (`process.env.PORT || 3000`)
- [ ] Database path is configurable
- [ ] All dependencies in `package.json`

### Security
- [ ] Input validation implemented
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CORS properly set up
- [ ] No sensitive data in code

---

## 🎯 Recommended: Render.com (Free Tier)

### Why Render.com?
- ✅ Free tier: 750 hours/month
- ✅ Full-stack support (Node.js + SQLite)
- ✅ Auto-deploy from GitHub
- ✅ HTTPS included
- ✅ Easy setup (5 minutes)
- ✅ Professional URLs

### Step-by-Step Deployment

#### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 2. Create Render Account

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

#### 3. Create Web Service

1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Click "Connect" next to your repo

#### 4. Configure Service

**Basic Settings:**
```
Name: corporate-archetype-tool
Environment: Node
Region: Choose closest to your users
Branch: main
```

**Build & Deploy:**
```
Build Command: npm install
Start Command: node backend/server.js
```

**Plan:**
```
Select: Free
```

#### 5. Environment Variables (Optional)

If you have any environment variables:

1. Scroll to "Environment Variables"
2. Click "Add Environment Variable"
3. Add your variables:
   ```
   NODE_ENV=production
   ```

#### 6. Deploy

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Watch the logs for any errors
4. Once deployed, you'll see "Live" status

#### 7. Get Your URLs

```
Main App:    https://corporate-archetype-tool.onrender.com
Admin Panel: https://corporate-archetype-tool.onrender.com/admin
```

### Important Notes

**Free Tier Limitations:**
- Server sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month (plenty for demos and testing)

**Pro Tip:** Visit your URL 2 minutes before any client demo to wake up the server!

---

## 🔄 Alternative Deployment Options

### Option 2: Railway.app

**Best for:** Quick deployment with persistent database

**Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-detects Node.js
7. Click "Deploy"
8. Generate domain in Settings → Networking

**Cost:** $5 credit/month (usually enough for demos)

---

### Option 3: Vercel (Frontend) + Render (Backend)

**Best for:** Separate frontend/backend deployment

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd public
vercel
```

**Backend on Render:**
Follow Render.com steps above for backend only.

**Connect:**
Update `public/js/app.js` and `admin/js/admin.js`:
```javascript
const config = {
    apiBaseUrl: 'https://your-backend.onrender.com'
};
```

---

### Option 4: Glitch.com

**Best for:** Quick demos with live editing

**Steps:**
1. Go to https://glitch.com
2. Click "New Project"
3. Select "Import from GitHub"
4. Enter your repository URL
5. Glitch auto-deploys

**URL:** `https://your-project.glitch.me`

---

### Option 5: Cyclic.sh

**Best for:** Node.js apps with database

**Steps:**
1. Go to https://cyclic.sh
2. Sign in with GitHub
3. Click "Deploy"
4. Select your repository
5. Cyclic auto-deploys

**URL:** `https://your-app.cyclic.app`

---

## 🔧 Troubleshooting

### Issue: Deployment Failed

**Check:**
1. Review deployment logs
2. Verify `package.json` has all dependencies
3. Check start command is correct
4. Ensure Node version compatibility

**Solution:**
```bash
# Test locally first
npm install
npm start

# If works locally, check deployment logs for specific error
```

### Issue: Database Not Persisting

**Problem:** SQLite database resets on each deployment

**Solution:**
- Render.com: Database persists automatically
- Other platforms: May need to configure persistent storage
- For production: Consider PostgreSQL or MySQL

### Issue: Port Binding Error

**Problem:** App trying to use fixed port

**Solution:**
Ensure `backend/server.js` uses dynamic port:
```javascript
const PORT = process.env.PORT || 3000;
```

### Issue: CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
Already configured in `backend/server.js`:
```javascript
app.use(cors());
```

### Issue: CSV Export Not Working

**Problem:** Downloads not working in production

**Solution:**
CSV export is client-side, should work everywhere. Check:
1. Browser console for errors
2. Pop-up blocker settings
3. Download permissions

### Issue: Reset Functionality Not Working

**Problem:** Database reset fails

**Solution:**
Check:
1. API endpoint is accessible
2. Database has write permissions
3. No errors in server logs

---

## 📊 Post-Deployment Verification

### Test Main App
1. Visit your production URL
2. Instructions popup should appear
3. Complete full assessment
4. Submit form with test data
5. Verify results display correctly

### Test Admin Panel
1. Visit `/admin` route
2. Check dashboard loads
3. Verify test lead appears
4. Test all date filters
5. Export CSV with different filters
6. Test reset functionality (optional)

### Performance Check
1. Test on mobile device
2. Check load times
3. Verify all icons display
4. Test on different browsers
5. Check responsive design

---

## 🔒 Security Considerations

### For Production Use

**Add Authentication:**
```javascript
// Example: Basic auth for admin panel
app.use('/admin', (req, res, next) => {
    // Add authentication logic
    next();
});
```

**Environment Variables:**
```env
# Add to Render environment variables
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

**Rate Limiting:**
Already implemented in `backend/server.js`:
```javascript
// 100 requests per minute per IP
const MAX_REQUESTS = 100;
```

**HTTPS:**
Automatic on all recommended platforms.

---

## 📈 Monitoring & Maintenance

### Check Deployment Status

**Render.com:**
- Dashboard shows "Live" status
- View logs in real-time
- Monitor resource usage

**Railway.app:**
- Deployment tab shows status
- Logs available in dashboard
- Metrics for CPU/memory

### View Logs

**Render:**
```
Dashboard → Your Service → Logs
```

**Railway:**
```
Project → Deployments → View Logs
```

### Update Deployment

**Automatic (Recommended):**
```bash
# Just push to GitHub
git add .
git commit -m "Update feature"
git push origin main

# Render/Railway auto-deploys
```

**Manual:**
```
Dashboard → Manual Deploy → Deploy Latest Commit
```

---

## 🎯 Production Best Practices

### Database Backups

**SQLite (Current):**
```bash
# Backup database file
cp backend/data/leads.db backend/data/leads.backup.db
```

**For Production:**
Consider migrating to PostgreSQL or MySQL for:
- Better scalability
- Automatic backups
- Better concurrent access

### Monitoring

**Set up monitoring for:**
- Uptime (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance (New Relic, DataDog)

### Regular Maintenance

**Weekly:**
- Check error logs
- Monitor lead submissions
- Verify CSV exports work
- Test admin panel

**Monthly:**
- Review security updates
- Update dependencies
- Check performance metrics
- Backup database

---

## 📱 Client Demo Preparation

### Before Demo

**1 Day Before:**
- [ ] Deploy to production
- [ ] Test all features
- [ ] Add 2-3 sample leads
- [ ] Verify admin panel works
- [ ] Test on mobile

**1 Hour Before:**
- [ ] Visit URL to wake up server (if free tier)
- [ ] Clear any test data
- [ ] Prepare talking points
- [ ] Have backup plan ready

**During Demo:**
1. Show instructions popup
2. Complete quick assessment
3. Show personalized results
4. Open admin panel
5. Demonstrate filters
6. Export CSV
7. Show analytics

### Demo Script

**Introduction (1 min):**
"This is the Corporate Archetype Diagnostic Tool for upGrad. It helps professionals discover their leadership style and get personalized program recommendations."

**User Flow (3 min):**
- Show instructions popup
- Complete assessment
- Display results
- Highlight program recommendations

**Admin Features (3 min):**
- Dashboard overview
- Date range filters
- CSV export options
- Analytics charts

**Q&A (3 min):**
- Answer questions
- Discuss customizations
- Review next steps

---

## 🎉 Success Checklist

### Deployment Complete When:
- [ ] App is live and accessible
- [ ] Main app loads correctly
- [ ] Admin panel accessible
- [ ] Assessment flow works
- [ ] Form submission works
- [ ] CSV export works
- [ ] Filters work correctly
- [ ] Reset functionality works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] HTTPS enabled
- [ ] Professional appearance

---

## 📞 Support & Resources

### Platform Documentation
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Glitch: https://glitch.com/help
- Cyclic: https://docs.cyclic.sh

### Common Issues
- Check deployment logs first
- Verify environment variables
- Test locally before deploying
- Review platform status pages

### Getting Help
- Platform support channels
- Community forums
- Stack Overflow
- GitHub Issues

---

## 🚀 You're Ready!

Your application is production-ready and can be deployed in under 10 minutes using any of the recommended platforms.

**Recommended Path:**
1. Push to GitHub
2. Deploy on Render.com (5 minutes)
3. Test all features
4. Share with client

**Good luck with your deployment!** 🎊

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
