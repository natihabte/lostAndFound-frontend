# Public Sector Lost & Found Management SaaS Platform - Frontend

React frontend for the **Public Sector Lost & Found Management SaaS Platform** - a multi-tenant solution for public sector organizations.

## 🏗️ Platform Overview

This frontend serves a **multi-tenant SaaS platform** designed for:
- 🏫 Universities and Educational Institutions
- 🏛️ Government Offices and Agencies
- 🏥 Hospitals and Healthcare Facilities
- 🏢 Municipalities and Local Government
- 🚌 Transport Authorities and Transit Systems

## ✨ Frontend Features

- ✅ **Multi-Tenant UI** - Organization-aware components
- ✅ **Role-Based Interface** - Different views for each role
- ✅ **Subscription Management** - Plan selection and billing
- ✅ **Organization Dashboard** - Admin and user interfaces
- ✅ **Multi-Language Support** - English, Amharic, Afaan Oromo, Tigrinya
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Theme** - User preference support
- ✅ **Real-time Updates** - Live data synchronization

## 🎨 Tech Stack

- **React 19** - Frontend framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React i18next** - Internationalization
- **Framer Motion** - Animations
- **React Router** - Navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 5001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

4. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🏢 Multi-Tenant Features

### Organization Context
The frontend automatically detects organization context through:
- **Subdomain**: `university.yourdomain.com`
- **URL Parameter**: `?org=university`
- **User Session**: From logged-in user's organization

### Role-Based UI
Different interfaces for each role:
- **Super Admin**: Platform management, all organizations
- **Organization Admin**: Organization settings, user management
- **Staff**: Item management, approval workflows
- **User**: Create/edit items, claim items
- **Public**: Search and view public items

## 🌍 Multi-Language Support

Supported languages:
- **English (en)** - Default
- **Amharic (am)** - አማርኛ
- **Afaan Oromo (om)** - Afaan Oromoo
- **Tigrinya (ti)** - ትግርኛ

Language files located in `src/i18n/locales/`

## 📱 Components Structure

```
src/
├── components/
│   ├── organization/     # Organization management
│   ├── subscription/     # Subscription components
│   ├── admin/           # Admin interfaces
│   ├── common/          # Shared components
│   └── ui/              # UI components
├── pages/
│   ├── organization/    # Organization pages
│   ├── subscription/    # Billing pages
│   └── admin/           # Admin pages
├── contexts/
│   ├── OrganizationContext.js
│   └── SubscriptionContext.js
└── utils/
    ├── multiTenant.js
    └── permissions.js
```

## 🎯 Key Pages

### Public Pages
- **Landing Page** - Organization showcase
- **Search** - Public item search
- **Item Details** - Public item viewing

### User Pages
- **Dashboard** - User overview
- **Add Item** - Report lost/found items
- **My Items** - User's items management
- **Profile** - User settings

### Admin Pages
- **Organization Dashboard** - Organization overview
- **User Management** - Manage organization users
- **Subscription** - Plan management and billing
- **Reports** - Analytics and insights

### Super Admin Pages
- **Platform Dashboard** - All organizations overview
- **Organization Management** - Approve/suspend organizations
- **System Settings** - Platform configuration

## 🔧 Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration:
- **Dark/Light themes** supported
- **Responsive design** with mobile-first approach
- **Custom color palette** for branding
- **Component-based styling**

### Theme Support
- **Light Theme** - Default professional look
- **Dark Theme** - User preference with system detection
- **Organization Branding** - Custom colors per organization (Premium+)

## 🌐 API Integration

### API Client
Located in `src/services/api.js` with:
- **Multi-tenant aware** requests
- **Authentication** handling
- **Error handling** and retry logic
- **Organization context** injection

### Authentication
- **JWT tokens** for API authentication
- **Role-based** route protection
- **Organization membership** validation
- **Session management**

## 📊 State Management

### Context Providers
- **OrganizationContext** - Current organization state
- **SubscriptionContext** - Subscription and billing state
- **AuthContext** - User authentication state
- **ThemeContext** - UI theme preferences

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_ENVIRONMENT=production
```

### Deployment Options
- **Netlify** - Static site hosting
- **Vercel** - Serverless deployment
- **AWS S3 + CloudFront** - Scalable hosting
- **Docker** - Containerized deployment

## 🔍 Testing

### Unit Tests
```bash
npm test
```

### E2E Testing
- **Cypress** for end-to-end testing
- **Multi-tenant scenarios** testing
- **Role-based access** testing

## 📈 Performance

### Optimization Features
- **Code splitting** by routes and components
- **Lazy loading** for heavy components
- **Image optimization** with Cloudinary
- **Bundle analysis** with webpack-bundle-analyzer

### Monitoring
- **Web Vitals** tracking
- **Error boundary** components
- **Performance metrics** collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT

---

## 🆘 Troubleshooting

### Common Issues

**Build fails to minify**
See: [troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

**API Connection Issues**
- Check `REACT_APP_API_URL` in `.env`
- Ensure backend is running on correct port
- Verify CORS configuration

**Multi-tenant Context Issues**
- Check organization detection in browser dev tools
- Verify subdomain configuration
- Check user organization membership

For more help, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
