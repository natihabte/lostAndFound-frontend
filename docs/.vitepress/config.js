import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/lostAndFound-frontend/',
  title: 'Public Sector Lost & Found',
  description: 'Multi-tenant SaaS platform for lost and found management in public sector organizations',
  
  ignoreDeadLinks: true,
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Admin', link: '/admin/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/index.html' },
            { text: 'Installation', link: '/guide/installation.html' },
            { text: 'Quick Start', link: '/guide/quick-start.html' }
          ]
        },
        {
          text: 'User Guide',
          items: [
            { text: 'User Registration', link: '/guide/user-registration.html' },
            { text: 'Organization Setup', link: '/guide/organization-setup.html' },
            { text: 'Item Management', link: '/guide/item-management.html' },
            { text: 'Claims Process', link: '/guide/claims-process.html' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Multi-language Support', link: '/guide/i18n.html' },
            { text: 'Dark Mode', link: '/guide/dark-mode.html' },
            { text: 'Email Verification', link: '/guide/email-verification.html' },
            { text: 'File Upload', link: '/guide/file-upload.html' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/index.html' },
            { text: 'Authentication', link: '/api/auth.html' },
            { text: 'Users', link: '/api/users.html' },
            { text: 'Organizations', link: '/api/organizations.html' },
            { text: 'Items', link: '/api/items.html' },
            { text: 'Claims', link: '/api/claims.html' }
          ]
        }
      ],
      '/admin/': [
        {
          text: 'Administration',
          items: [
            { text: 'Overview', link: '/admin/index.html' },
            { text: 'Super Admin', link: '/admin/super-admin.html' },
            { text: 'Organization Admin', link: '/admin/org-admin.html' },
            { text: 'Hall Admin', link: '/admin/hall-admin.html' },
            { text: 'User Management', link: '/admin/user-management.html' },
            { text: 'Reports', link: '/admin/reports.html' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/public-sector-lost-found' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Public Sector Lost & Found Team'
    }
  }
})