# Public Sector Lost & Found Management Platform

A comprehensive multi-tenant SaaS solution designed for public sector organizations including universities, government agencies, hospitals, and other public institutions to efficiently manage lost and found items.

## Features

- **Multi-tenant Architecture**: Separate data and customization for each organization
- **Multi-language Support**: Available in English, Amharic, Oromo, and Tigrinya
- **Role-based Access Control**: Super Admin, Organization Admin, and Hall Admin roles
- **Global Header & Footer**: Consistent navigation across all pages
- **Dynamic Platform Support**: Configurable contact information in footer
- **Admin Sidebar**: Quick access to admin features for admin users
- **Real-time Notifications**: Email verification and claim notifications
- **Advanced Search**: Powerful search and filtering capabilities
- **Dark/Light Mode**: User preference-based theming with full support
- **Mobile Responsive**: Optimized for all device sizes
- **File Upload**: Cloudinary integration for image management

## Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture Overview

The platform consists of:

- **Frontend**: React 19 with Vite, TailwindCSS, and i18next
- **Backend**: Node.js with Express and MongoDB
- **Authentication**: JWT-based with email verification
- **File Storage**: Cloudinary for image uploads
- **Email Service**: Nodemailer for notifications

## Getting Started

1. [Installation Guide](/guide/installation)
2. [Quick Start Tutorial](/guide/quick-start)
3. [User Registration](/guide/user-registration)
4. [Organization Setup](/guide/organization-setup)

## API Documentation

Explore our comprehensive [API documentation](/api/) for integration details.

## Administration

Learn about the [administration features](/admin/) and role management.