# Documentation Deployment Guide

Complete guide for deploying your VitePress documentation to various platforms.

## Quick Deploy Options

### Option 1: GitHub Pages (Recommended - Free)

**Automatic deployment via GitHub Actions:**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add documentation"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy

3. **Access your docs**:
   - URL: `https://your-username.github.io/your-repo-name/`
   - Usually available within 2-3 minutes

**Manual GitHub Pages deployment:**

```bash
cd frontend
npm run docs:build
npx gh-pages -d docs/.vitepress/dist
```

### Option 2: Netlify (Easy, Free Tier)

**Method A: Git Integration**

1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run docs:build`
   - **Publish directory**: `frontend/docs/.vitepress/dist`
5. Click "Deploy site"

**Method B: Drag and Drop**

1. Build locally:
   ```bash
   cd frontend
   npm run docs:build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `frontend/docs/.vitepress/dist` folder
4. Done! Your site is live

**Method C: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build documentation
cd frontend
npm run docs:build

# Deploy
netlify deploy --prod --dir=docs/.vitepress/dist
```

### Option 3: Vercel (Fast, Free Tier)

**Method A: Git Integration**

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run docs:build`
   - **Output Directory**: `docs/.vitepress/dist`
5. Click "Deploy"

**Method B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Build documentation
cd frontend
npm run docs:build

# Deploy
vercel --prod docs/.vitepress/dist
```

### Option 4: Local Server (Testing)

**Simple HTTP Server:**

```bash
# Build first
cd frontend
npm run docs:build

# Serve with Python
cd docs/.vitepress/dist
python -m http.server 8080

# Or with Node.js
npx serve docs/.vitepress/dist
```

Access at: `http://localhost:8080`

### Option 5: Docker Deployment

**Create Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run docs:build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run:**

```bash
docker build -t docs-app .
docker run -p 80:80 docs-app
```

## Configuration for Different Platforms

### Base URL Configuration

If deploying to a subdirectory, update `frontend/docs/.vitepress/config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/', // For GitHub Pages
  // or
  base: '/', // For custom domain
  
  // ... rest of config
})
```

### Custom Domain Setup

**GitHub Pages:**

1. Add `CNAME` file to `frontend/docs/public/`:
   ```
   docs.yourdomain.com
   ```

2. Configure DNS:
   ```
   CNAME record: docs → your-username.github.io
   ```

**Netlify/Vercel:**

1. Go to domain settings
2. Add custom domain
3. Follow DNS configuration instructions

## Environment Variables

For production builds, you may need environment variables:

**Create `.env.production`:**

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Your App Name
```

## Build Optimization

### Optimize for Production

```bash
# Clean build
cd frontend
rm -rf docs/.vitepress/dist docs/.vitepress/cache
npm run docs:build

# Check build size
du -sh docs/.vitepress/dist
```

### Performance Tips

1. **Enable compression** (handled by most platforms)
2. **Use CDN** for assets
3. **Optimize images** before adding to docs
4. **Minimize custom CSS**

## Continuous Deployment

### GitHub Actions (Already configured)

The workflow at `.github/workflows/deploy-docs.yml` automatically:
- Builds on every push to main/master
- Deploys to GitHub Pages
- Handles caching for faster builds

### Netlify Auto-Deploy

Netlify automatically deploys on:
- Every push to connected branch
- Pull request previews
- Branch deploys

### Vercel Auto-Deploy

Vercel automatically:
- Deploys production on main branch
- Creates preview deployments for PRs
- Provides deployment URLs

## Monitoring Deployment

### Check Build Status

**GitHub Actions:**
- Go to "Actions" tab in your repository
- View workflow runs and logs

**Netlify:**
- Dashboard → Site → Deploys
- View build logs and status

**Vercel:**
- Dashboard → Project → Deployments
- View deployment logs

### Common Issues

**Build fails:**
```bash
# Test build locally first
cd frontend
npm run docs:build

# Check for errors
# Fix issues and push again
```

**404 errors:**
- Check base URL configuration
- Verify file paths are correct
- Ensure all links use relative paths

**Slow builds:**
- Enable caching in CI/CD
- Optimize dependencies
- Use incremental builds

## Rollback Deployment

**GitHub Pages:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

**Netlify:**
- Dashboard → Deploys
- Click on previous deploy
- Click "Publish deploy"

**Vercel:**
- Dashboard → Deployments
- Find previous deployment
- Click "Promote to Production"

## Security

### HTTPS

All platforms provide free HTTPS:
- GitHub Pages: Automatic
- Netlify: Automatic with Let's Encrypt
- Vercel: Automatic

### Access Control

**Password Protection (Netlify):**
- Site settings → Access control
- Set password for site

**Basic Auth (Nginx):**
```nginx
location / {
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

## Cost Comparison

| Platform | Free Tier | Bandwidth | Build Minutes |
|----------|-----------|-----------|---------------|
| GitHub Pages | Yes | 100GB/month | Unlimited |
| Netlify | Yes | 100GB/month | 300 min/month |
| Vercel | Yes | 100GB/month | 6000 min/month |

## Quick Deployment Checklist

- [ ] Documentation builds successfully locally
- [ ] All links work (no 404s)
- [ ] Images load correctly
- [ ] Search functionality works
- [ ] Mobile responsive
- [ ] Base URL configured correctly
- [ ] Environment variables set (if needed)
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Monitoring set up

## Next Steps

1. **Choose deployment platform** (GitHub Pages recommended)
2. **Configure base URL** if needed
3. **Push to repository** or deploy manually
4. **Verify deployment** works correctly
5. **Set up custom domain** (optional)
6. **Monitor** for issues

## Support

- **GitHub Pages**: [Documentation](https://docs.github.com/pages)
- **Netlify**: [Documentation](https://docs.netlify.com)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **VitePress**: [Deployment Guide](https://vitepress.dev/guide/deploy)

Your documentation is now ready to be deployed to the world! 🚀