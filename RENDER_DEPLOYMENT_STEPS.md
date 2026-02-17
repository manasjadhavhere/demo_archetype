# Render Deployment - Quick Steps

## ✅ Code is Ready!
Your code has been pushed to GitHub and is ready for deployment.

## 🚀 Deploy on Render (5 minutes)

### Step 1: Go to Render Dashboard
Visit: https://dashboard.render.com

### Step 2: Create New Web Service
1. Click **"New"** → **"Web Service"**
2. Click **"Connect account"** if not already connected to GitHub
3. Find and select your repository: **demo_archetype**

### Step 3: Configure Service
Fill in these details:

**Basic Settings:**
- **Name**: `upgrad-ai-assessment` (or any name you prefer)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings (click "Advanced"):**
- **Auto-Deploy**: Yes (recommended - deploys on every push)

**Environment Variables:**
Add these:
- Key: `NODE_ENV` → Value: `production`
- Key: `PORT` → Value: `3000`

### Step 4: Choose Plan
- **Free Plan**: Good for testing (has limitations)
  - Spins down after 15 min of inactivity
  - Database resets on restart
  - 750 hours/month free
  
- **Starter Plan ($7/month)**: Recommended for production
  - Always on
  - Persistent storage available
  - Better performance

### Step 5: Deploy!
Click **"Create Web Service"**

Render will:
1. Clone your repository
2. Run `npm install`
3. Start the server with `npm start`
4. Provide you with a URL

## 📱 Your App URLs

Once deployed, you'll get a URL like:
```
https://upgrad-ai-assessment.onrender.com
```

Access points:
- **Main App**: https://your-app.onrender.com/
- **Admin Panel**: https://your-app.onrender.com/admin
- **Leaderboard**: https://your-app.onrender.com/leaderboard
- **API Health**: https://your-app.onrender.com/api/health

## ✅ Post-Deployment Checklist

After deployment completes (5-10 minutes):

1. **Test Main App**
   - Visit your app URL
   - Click "Start Assessment"
   - Fill form and complete quiz
   - Check if results display correctly

2. **Test Leaderboard**
   - Go to /leaderboard
   - Verify your entry appears
   - Check ranking is correct

3. **Test Admin Panel**
   - Go to /admin
   - Login with password: `upgradopen`
   - Check dashboard shows your data
   - Verify leaderboard section works

4. **Test API**
   - Visit /api/health
   - Should return: `{"status":"healthy","timestamp":"..."}`

## ⚠️ Important Notes

### Database (Free Tier)
- SQLite database resets when service restarts
- For production, upgrade to paid plan with persistent disk
- Or migrate to external database (PostgreSQL)

### First Deploy
- First deployment takes 5-10 minutes
- Subsequent deploys are faster (2-3 minutes)
- Watch the logs in Render dashboard

### Auto-Deploy
- Every push to `main` branch triggers automatic deployment
- You can disable this in Render settings if needed

### Custom Domain (Optional)
- Go to Settings → Custom Domain
- Add your domain
- Update DNS records as instructed
- SSL certificate is automatic

## 🐛 Troubleshooting

### Build Failed
- Check logs in Render dashboard
- Verify package.json has all dependencies
- Ensure Node version is compatible

### App Not Loading
- Check if service is running (should show "Live")
- View logs for errors
- Test /api/health endpoint

### Database Empty
- Free tier resets database on restart
- This is normal behavior
- Upgrade to paid plan for persistence

### 404 Errors
- Ensure routes are correct in backend/server.js
- Check that files are in correct directories
- Verify build completed successfully

## 📊 Monitoring

### View Logs
Dashboard → Your Service → Logs

### Metrics
Dashboard → Your Service → Metrics
- CPU usage
- Memory usage
- Request count

### Alerts
Set up in Settings → Notifications

## 🔄 Updating Your App

To deploy updates:
```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy!

## 💡 Tips

1. **Test Locally First**: Always test changes locally before pushing
2. **Monitor Logs**: Keep an eye on logs after deployment
3. **Use Environment Variables**: For sensitive data (don't hardcode)
4. **Enable Persistent Disk**: For production use (paid plans)
5. **Set Up Monitoring**: Use Render's built-in monitoring

## 🎉 You're Done!

Your app is now live and accessible worldwide!

Share your app URL with users and start collecting leads.

---

**Need Help?**
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Support: support@render.com
