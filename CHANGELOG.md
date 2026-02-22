# Changelog

All notable changes to the Lost & Found Frontend will be documented in this file.

## [Unreleased] - 2024-02-22

### Added
- **Global Header and Footer**: Header and footer components now render on all pages across the application
- **Dynamic Platform Support**: Footer displays dynamic platform support contact information from API
- **Centralized Platform Settings**: Platform support data now managed in AppContext for shared access
- **Admin Sidebar**: Admin users see a sidebar on their profile page (/) with navigation to admin features
- **Responsive Layout**: Content properly centered when admin sidebar is visible
- **Dark Mode Support**: Footer and all components fully support dark/light theme switching

### Changed
- **Route Structure**: 
  - `/` now shows user dashboard for signed-in users (both regular and admin)
  - `/admin` shows admin dashboard for admin users
  - Admin users see sidebar on `/` with quick access to admin features
- **Platform Banner**: Now hidden only for super admin users (visible for org admins and regular users)
- **Footer Visibility**: Footer hidden only for super admin users
- **Header Height**: Dynamically adjusts based on platform banner visibility
- **Sidebar Positioning**: Properly positioned below header accounting for platform banner height

### Fixed
- **Double Footer Issue**: Resolved issue where footer appeared twice on user dashboard
- **Dark Mode Footer**: Footer now correctly responds to dark mode toggle
- **Translation Keys**: Fixed footer support section to use proper translation keys
- **Sidebar Overlap**: Fixed sidebar being hidden behind platform banner
- **Content Centering**: User dashboard content now properly centered in available space

### Improved
- **Code Organization**: Removed duplicate platform support fetching logic
- **Performance**: Single API call for platform settings shared across all components
- **Maintainability**: Platform support data managed in one place (AppContext)
- **User Experience**: Consistent header and footer across all pages

### Technical Details

#### Modified Files
- `src/layouts/AppLayout.jsx` - Added admin sidebar, dynamic header height, footer
- `src/layouts/AdminLayout.jsx` - Added dynamic header height, footer, platform support
- `src/components/ModernHeader.jsx` - Updated to use platform support from context
- `src/contexts/AppContext.jsx` - Added platform support state and API fetching
- `src/router/index.jsx` - Updated routing structure for admin users
- `src/pages/UserDashboardPage.jsx` - Improved content centering
- `src/i18n/locales/*.json` - Updated translation keys for footer support section

#### New Features
- Admin sidebar navigation on user profile page
- Dynamic platform support contact information
- Centralized platform settings management
- Responsive layout with sidebar support

#### Breaking Changes
- None - All changes are backward compatible

---

## Previous Versions

For changes prior to this version, please refer to git commit history.

