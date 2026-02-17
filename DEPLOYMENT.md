# Deployment Guide - Render

## Prerequisites
- GitHub repository with latest code
- Render account (https://render.com)

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready - Complete AI assessment platform"
git push origin main
```

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click "Apply" to deploy

#### Option B: Manual Setup
1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: upgrad-ai-assessment
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV` = `production`
     - `PORT` = `3000`

### 3. Verify Deployment
Once deployed, Render will provide a URL like:
`https://upgrad-ai-assessment.onrender.com`

Test the following:
- Main app: `https://your-app.onrender.com/`
- Admin: `https://your-app.onrender.com/admin`
- Leaderboard: `https://your-app.onrender.com/leaderboard`
- API Health: `https://your-app.onrender.com/api/health`

## Important Notes

### Database
- SQLite database will be created automatically on first run
- Database is stored in `backend/data/leads.db`
- **Warning**: Render's free tier uses ephemeral storage - database resets on restart
- For production, consider upgrading to persistent storage or using external database

### Audio Files
- Background music file (`A_Lonely_Cherry_Tree_256KBPS.webm`) is excluded from git
- Upload manually to `public/audio/` after deployment, or:
  - Use Render's persistent disk feature
  - Host audio on CDN (recommended for production)

### Admin Password
- Default password: `upgradopen`
- Change in `admin/login.html` for production
- Consider implementing proper authentication for production

### Environment Variables
Set these in Render dashboard:
- `NODE_ENV=production`
- `PORT=3000` (Render sets this automatically)

## Monitoring

### Logs
View logs in Render dashboard:
- Dashboard → Your Service → Logs

### Health Check
Render automatically monitors: `https://your-app.onrender.com/api/health`

## Troubleshooting

### Build Fails
- Check Node version in `package.json` engines
- Verify all dependencies are in `package.json`
- Check build logs in Render dashboard

### Database Issues
- Database resets on free tier restarts
- Upgrade to paid plan for persistent storage
- Or migrate to external database (PostgreSQL, MongoDB)

### 404 Errors
- Ensure all routes are defined in `backend/server.js`
- Check that static files are in correct directories
- Verify build completed successfully

### Performance Issues
- Free tier has limited resources
- Consider upgrading for production use
- Enable caching for static assets

## Post-Deployment Checklist

- [ ] Test main assessment flow
- [ ] Verify form submission saves to database
- [ ] Check leaderboard displays correctly
- [ ] Test admin login and dashboard
- [ ] Verify all API endpoints work
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Monitor initial user feedback

## Updating Deployment

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically redeploy on push to main branch.

## Custom Domain (Optional)

1. Go to Render dashboard → Your Service → Settings
2. Scroll to "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate is automatically provisioned

## Scaling

For production use:
- Upgrade to paid plan for better performance
- Enable persistent disk for database
- Consider using external database service
- Set up monitoring and alerts
- Implement proper backup strategy

---

**Need Help?**
- Render Docs: https://render.com/docs
- Support: support@render.com
