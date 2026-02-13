# Public Sector Lost & Found Documentation

This documentation is built with [VitePress](https://vitepress.dev/) and provides comprehensive guides for users, administrators, and developers.

## Documentation Structure

```
docs/
├── .vitepress/
│   └── config.js          # VitePress configuration
├── guide/                 # User guides and tutorials
│   ├── index.md          # Introduction
│   ├── installation.md   # Installation guide
│   ├── quick-start.md    # Quick start tutorial
│   └── ...
├── api/                   # API documentation
│   ├── index.md          # API overview
│   ├── auth.md           # Authentication
│   └── ...
├── admin/                 # Administration guides
│   ├── index.md          # Admin overview
│   ├── super-admin.md    # Super admin guide
│   └── ...
└── index.md              # Documentation homepage
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Running Documentation Locally

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built documentation
npm run docs:preview
```

The documentation will be available at `http://localhost:5173/docs`

## Writing Documentation

### Markdown Features

VitePress supports enhanced Markdown with:

- **Code syntax highlighting**
- **Custom containers** (tips, warnings, etc.)
- **Vue components** in Markdown
- **Table of contents** generation
- **Cross-references** and linking

### Code Blocks

```javascript
// Example code block with syntax highlighting
const api = new LostFoundAPI({
  baseURL: 'https://api.example.com',
  token: 'your-token'
});
```

### Custom Containers

::: tip
This is a tip container
:::

::: warning
This is a warning container
:::

::: danger
This is a danger container
:::

### Internal Links

- [Installation Guide](./guide/installation.md)
- [API Reference](./api/index.md)
- [Admin Guide](./admin/index.md)

## Contributing

### Adding New Pages

1. Create a new `.md` file in the appropriate directory
2. Add the page to the sidebar configuration in `.vitepress/config.js`
3. Use proper frontmatter if needed:

```yaml
---
title: Page Title
description: Page description
---
```

### Updating Navigation

Edit `.vitepress/config.js` to modify:
- Navigation bar items
- Sidebar structure
- Theme configuration

### Style Guidelines

- Use clear, concise headings
- Include code examples where applicable
- Add screenshots for UI-related documentation
- Use consistent terminology throughout
- Include troubleshooting sections for complex topics

## Deployment

### Static Site Generation

```bash
# Build static site
npm run docs:build

# Output will be in docs/.vitepress/dist/
```

### Hosting Options

The documentation can be deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**
- Any static hosting service

### GitHub Pages Deployment

Add this workflow to `.github/workflows/docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run docs:build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

## Maintenance

### Regular Updates

- Keep VitePress updated to latest version
- Review and update outdated information
- Add new features and API changes
- Maintain screenshot currency
- Update external links

### Content Review

- Quarterly review of all documentation
- User feedback integration
- Accessibility compliance checks
- Performance optimization
- SEO improvements

## Support

For documentation-related issues:
- Create an issue in the project repository
- Contact the development team
- Contribute improvements via pull requests