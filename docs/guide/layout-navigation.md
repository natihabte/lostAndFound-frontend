# Layout and Navigation

This guide explains the layout structure, navigation system, and how header/footer components work across the application.

## Overview

The application uses a consistent layout system with:
- **Global Header** - Appears on all pages
- **Global Footer** - Appears on all pages (except for super admin)
- **Admin Sidebar** - Appears for admin users on specific pages
- **Responsive Design** - Adapts to different screen sizes

## Layout Components

### AppLayout

The main layout wrapper for regular pages.

**Features:**
- Global header with navigation
- Optional admin sidebar for admin users
- Global footer with platform support info
- Dark mode support
- Responsive design

**Usage:**
```jsx
// Automatically applied to routes in router configuration
<AppLayout>
  <YourPageComponent />
</AppLayout>
```

### AdminLayout

Specialized layout for admin-only pages.

**Features:**
- Global header
- Fixed admin sidebar with navigation
- Global footer
- Admin-specific navigation items

**Usage:**
```jsx
// Applied to /admin/* routes
<AdminLayout>
  <AdminPageComponent />
</AdminLayout>
```

## Header Component

### ModernHeader

The global header component that appears on all pages.

**Features:**
- **Platform Support Banner** - Shows contact info (hidden for super admin)
- **Logo and Branding** - Organization branding
- **Navigation Links** - Browse, Organizations, Dashboard
- **User Menu** - Profile, settings, logout
- **Language Selector** - Multi-language support
- **Dark Mode Toggle** - Theme switching
- **Mobile Menu** - Responsive navigation

**Platform Banner:**
```jsx
// Visible for: Regular users, Organization admins
// Hidden for: Super admin
{platformSupport.enabled && userRole !== 'superAdmin' && (
  <div className="bg-blue-600 text-white py-2">
    <span>📞 Platform Support {platformSupport.phoneNumber}</span>
    <span>🕒 {platformSupport.is24x7 ? '24/7 Service' : 'Business Hours'}</span>
  </div>
)}
```

## Footer Component

### Global Footer

The footer appears on all pages with dynamic platform support information.

**Features:**
- **App Information** - Platform name and description
- **Quick Links** - Browse, Add Item, My Account
- **Support Section** - Dynamic contact information
- **Legal Links** - Privacy Policy, Terms of Service
- **Dark Mode Support** - Adapts to theme

**Dynamic Support Info:**
```jsx
<div>
  <h3>Support</h3>
  <ul>
    <li>Platform Support</li>
    <li>📞 {platformSupport.phoneNumber}</li>
    <li>🕒 {platformSupport.is24x7 ? '24/7 Service' : 'Business Hours'}</li>
  </ul>
</div>
```

**Visibility:**
- ✅ Visible for regular users
- ✅ Visible for organization admins
- ❌ Hidden for super admin

## Admin Sidebar

### Sidebar Navigation

Admin users see a sidebar on their profile page (/) with quick access to admin features.

**Features:**
- **My Profile** - Link to user dashboard (/)
- **Admin Dashboard** - Expandable section with:
  - Organizations
  - Users
  - System Reports
- **User Info** - Current user details at bottom

**Visibility:**
```jsx
// Show sidebar for admin users on specific pages
const showAdminSidebar = isAdmin && (
  location.pathname === '/' || 
  location.pathname === '/profile'
);
```

**Navigation Items:**
```jsx
const navigationItems = [
  {
    id: 'home',
    label: 'My Profile',
    icon: Home,
    path: '/'
  },
  {
    id: 'adminDashboard',
    label: 'Admin Dashboard',
    icon: Shield,
    path: '/admin',
    expandable: true,
    children: [
      { id: 'organizations', label: 'Organizations', path: '/admin/organizations' },
      { id: 'users', label: 'Users', path: '/admin/users' },
      { id: 'systemReports', label: 'System Reports', path: '/admin/reports' }
    ]
  }
];
```

## Route Structure

### User Routes

**Regular Users:**
- `/` - User Dashboard
- `/profile` - User Dashboard (alias)
- `/items/add` - Add Item
- `/settings` - User Settings

**Admin Users:**
- `/` - User Dashboard with admin sidebar
- `/admin` - Admin Dashboard
- `/admin/organizations` - Organization Management
- `/admin/users` - User Management
- `/admin/reports` - System Reports

### Layout Assignment

```jsx
// AppLayout for regular pages
{
  path: '/',
  element: <AppLayout />,
  children: [
    { index: true, element: <SmartHome /> },
    { path: '/items/add', element: <ModernAddItem /> },
    // ... other routes
  ]
}

// AdminLayout for admin pages
{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminDashboardRouter /> },
    { path: 'users', element: <AdminUsers /> },
    // ... other admin routes
  ]
}
```

## Platform Support

### Dynamic Contact Information

Platform support information is managed centrally in `AppContext` and shared across all components.

**Data Structure:**
```javascript
{
  enabled: true,
  phoneNumber: '+1-800-555-0123',
  is24x7: true
}
```

**API Integration:**
```javascript
// Fetched once in AppContext
useEffect(() => {
  const loadPlatformSettings = async () => {
    const response = await platformSettingsAPI.getPublic();
    setPlatformSupport(response.data);
  };
  loadPlatformSettings();
}, []);
```

**Usage in Components:**
```jsx
// Access from context
const { platformSupport } = useApp();

// Display in footer
<span>📞 {platformSupport.phoneNumber}</span>
<span>🕒 {platformSupport.is24x7 ? '24/7 Service' : 'Business Hours'}</span>
```

## Responsive Design

### Mobile Navigation

The header includes a mobile menu for smaller screens:

```jsx
{mobileMenuOpen && (
  <div className="md:hidden">
    <nav>
      <button onClick={() => navigate('/')}>Browse Items</button>
      <button onClick={() => navigate('/organizations')}>Organizations</button>
      {dashboardButton && (
        <button onClick={() => navigate(dashboardButton.route)}>
          {dashboardButton.name}
        </button>
      )}
    </nav>
  </div>
)}
```

### Sidebar Responsiveness

The admin sidebar is hidden on mobile and shown on desktop:

```jsx
// Fixed sidebar on desktop
<div className="w-64 fixed left-0 top-16 bottom-0 z-40">
  {/* Sidebar content */}
</div>

// Main content adjusts margin
<main className={`${showAdminSidebar ? 'ml-64' : ''}`}>
  {/* Page content */}
</main>
```

## Dark Mode Support

All layout components support dark mode:

```jsx
// Header
<header className={`${darkMode ? 'bg-gray-900' : 'bg-white'}`}>

// Footer
<footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>

// Sidebar
<div className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
```

## Internationalization

Layout components use i18n for all text:

```jsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

// Usage
<span>{t('navigation.browse')}</span>
<span>{t('footer.support')}</span>
<span>{t('contact.platformSupport')}</span>
```

**Translation Keys:**
- `navigation.*` - Navigation links
- `footer.*` - Footer content
- `contact.*` - Contact information
- `legal.*` - Legal links

## Best Practices

### Layout Usage

1. **Use AppLayout for regular pages** - Provides consistent header/footer
2. **Use AdminLayout for admin pages** - Includes admin sidebar
3. **Don't nest layouts** - Each page should use one layout
4. **Respect visibility rules** - Follow platform banner/footer visibility logic

### Navigation

1. **Use ROUTES constants** - Import from `constants/routes`
2. **Use navigate() hook** - For programmatic navigation
3. **Check user role** - Before showing admin links
4. **Handle mobile** - Ensure mobile menu works

### Platform Support

1. **Use context** - Access `platformSupport` from `useApp()`
2. **Don't fetch locally** - Data is centralized in AppContext
3. **Handle loading** - Show defaults while loading
4. **Update translations** - Keep i18n files in sync

## Troubleshooting

### Sidebar Not Showing

Check:
1. User role is 'superAdmin' or 'admin'
2. Current path is '/' or '/profile'
3. `showAdminSidebar` condition is met

### Footer Not Showing

Check:
1. User role (hidden for super admin)
2. Layout component (AppLayout or AdminLayout)
3. Route configuration

### Platform Banner Overlapping

Check:
1. Header height calculation (`top-24` vs `top-16`)
2. Content padding (`pt-24` vs `pt-16`)
3. Sidebar positioning

### Dark Mode Not Working

Check:
1. `darkMode` from `useApp()` context
2. Conditional classes applied correctly
3. Tailwind dark mode configuration

## Related Documentation

- [Dark Mode Guide](./dark-mode.md)
- [Internationalization](./i18n.md)
- [User Registration](./user-registration.md)
- [Admin Dashboard](../admin/index.md)
