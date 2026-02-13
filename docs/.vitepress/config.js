import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/lostAndFound-frontend/',
  title: 'Public Sector Lost & Found',
  description: 'Multi-tenant SaaS platform for lost and found management in public sector organizations',
  
  // Ignore dead links during build
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
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'User Guide',
          items: [
            { text: 'User Registration', link: '/guide/user-registration' },
            { text: 'Organization Setup', link: '/guide/organization-setup' },
            { text: 'Item Management', link: '/guide/item-management' },
            { text: 'Claims Process', link: '/guide/claims-process' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Multi-language Support', link: '/guide/i18n' },
            { text: 'Dark Mode', link: '/guide/dark-mode' },
            { text: 'Email Verification', link: '/guide/email-verification' },
            { text: 'File Upload', link: '/guide/file-upload' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Authentication', link: '/api/auth' },
            { text: 'Users', link: '/api/users' },
            { text: 'Organizations', link: '/api/organizations' },
            { text: 'Items', link: '/api/items' },
            { text: 'Claims', link: '/api/claims' }
          ]
        }
      ],
      '/admin/': [
        {
          text: 'Administration',
          items: [
            { text: 'Overview', link: '/admin/' },
            { text: 'Super Admin', link: '/admin/super-admin' },
            { text: 'Organization Admin', link: '/admin/org-admin' },
            { text: 'Hall Admin', link: '/admin/hall-admin' },
            { text: 'User Management', link: '/admin/user-management' },
            { text: 'Reports', link: '/admin/reports' }
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