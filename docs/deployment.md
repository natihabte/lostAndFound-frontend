# Documentation Deployment Guide

This guide covers deploying the VitePress documentation to various hosting platforms.

## Build Process

### Local Build

```bash
# Build the documentation
npm run docs:build

# Preview the built documentation
npm run docs:preview
```

The built files will be in `docs/.vitepress/dist/`

## Deployment Options

### 1. GitHub Pages

#### Automatic Deployment with GitHub Actions

Create `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build documentation
        run: |
          cd frontend
          npm run docs:build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: frontend/docs/.vitepress/dist
          cname: your-docs-domain.com # Optional: custom domain
```

#### Manual Deployment

```bash
# Build documentation
npm run docs:build

# Deploy to gh-pages branch
npx gh-pages -d docs/.vitepress/dist
```

### 2. Netlify

#### Option A: Git Integration

1. Connect your repository to Netlify
2. Set build settings:
   - **Build command**: `cd frontend && npm run docs:build`
   - **Publish directory**: `frontend/docs/.vitepress/dist`
   - **Node version**: 18

#### Option B: Manual Deploy

```bash
# Build documentation
npm run docs:build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=docs/.vitepress/dist
```

### 3. Vercel

#### Option A: Git Integration

1. Import project to Vercel
2. Set framework preset to "Other"
3. Configure build settings:
   - **Build Command**: `cd frontend && npm run docs:build`
   - **Output Directory**: `frontend/docs/.vitepress/dist`
   - **Install Command**: `cd frontend && npm install`

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Build documentation
npm run docs:build

# Deploy
vercel --prod docs/.vitepress/dist
```

### 4. AWS S3 + CloudFront

#### Setup S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://your-docs-bucket

# Configure for static website hosting
aws s3 website s3://your-docs-bucket \
  --index-document index.html \
  --error-document 404.html
```

#### Deploy Script

```bash
#!/bin/bash
# deploy-to-s3.sh

# Build documentation
npm run docs:build

# Sync to S3
aws s3 sync docs/.vitepress/dist/ s3://your-docs-bucket \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.xml"

# Upload HTML files with shorter cache
aws s3 sync docs/.vitepress/dist/ s3://your-docs-bucket \
  --delete \
  --cache-control "max-age=3600" \
  --include "*.html" \
  --include "*.xml"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### 5. Docker Deployment

#### Dockerfile

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

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Build and Deploy

```bash
# Build Docker image
docker build -t docs-app .

# Run container
docker run -p 80:80 docs-app
```

## Custom Domain Setup

### DNS Configuration

For custom domains, configure DNS records:

```
# A record (for apex domain)
docs.yoursite.com → [hosting-provider-ip]

# CNAME record (for subdomain)
docs → your-site.netlify.app
```

### SSL Certificate

Most hosting providers offer automatic SSL:

- **GitHub Pages**: Automatic with custom domains
- **Netlify**: Automatic Let's Encrypt certificates
- **Vercel**: Automatic SSL for all domains
- **CloudFront**: Use AWS Certificate Manager

## Environment-Specific Configuration

### Production Configuration

Update `docs/.vitepress/config.js` for production:

```javascript
export default defineConfig({
  title: 'Public Sector Lost & Found',
  description: 'Documentation',
  base: '/docs/', // If deployed to subdirectory
  
  head: [
    ['link', { rel: 'icon', href: '/docs/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    // Analytics
    ['script', { 
      async: true, 
      src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' 
    }]
  ],

  themeConfig: {
    // Production-specific theme config
    editLink: {
      pattern: 'https://github.com/your-org/repo/edit/main/frontend/docs/:path'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/repo' }
    ]
  }
})
```

## Monitoring and Analytics

### Google Analytics

Add to `docs/.vitepress/config.js`:

```javascript
export default defineConfig({
  head: [
    ['script', { 
      async: true, 
      src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' 
    }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `]
  ]
})
```

### Performance Monitoring

Monitor documentation performance:

- **Core Web Vitals**: Use Google PageSpeed Insights
- **Uptime Monitoring**: Use services like UptimeRobot
- **Error Tracking**: Implement error logging
- **User Analytics**: Track popular pages and search terms

## Maintenance

### Regular Updates

```bash
# Update VitePress
npm update vitepress

# Update dependencies
npm update

# Rebuild and redeploy
npm run docs:build
```

### Content Management

- Review and update documentation quarterly
- Check for broken links
- Update screenshots and examples
- Maintain API documentation accuracy

### Backup Strategy

- **Git Repository**: Primary backup through version control
- **Automated Backups**: Regular backups of built documentation
- **Content Versioning**: Tag releases for documentation versions

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**Deployment Issues**
- Verify build output directory
- Check hosting provider configuration
- Ensure proper file permissions

**Performance Issues**
- Optimize images and assets
- Enable compression
- Use CDN for static assets
- Monitor bundle size

### Getting Help

- Check VitePress documentation
- Review hosting provider docs
- Contact development team for custom issues