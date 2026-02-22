/**
 * Application Routes Constants
 * 
 * URL paths for React Router navigation.
 * Use these constants with useNavigate() hook.
 * 
 * Usage:
 * import { ROUTES } from './constants/routes';
 * import { useNavigate } from 'react-router-dom';
 * 
 * const navigate = useNavigate();
 * navigate(ROUTES.ADMIN_USERS);
 */

export const ROUTES = {
  // ============================================
  // PUBLIC ROUTES
  // ============================================
  HOME: '/',  // Smart route - shows landing for guests, browse for logged-in users
  LANDING: '/',  // Alias for HOME
  BROWSE: '/',  // Alias for HOME
  LOGIN: '/login',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  
  // ============================================
  // ORGANIZATION ROUTES
  // ============================================
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_DETAIL: (id) => `/organizations/${id}`,
  REGISTER_ORGANIZATION: '/organizations/register',
  PUBLIC_SECTOR_REGISTRATION: '/organizations/public-sector',
  ORGANIZATION_VERIFICATION: '/organizations/verify',
  
  // ============================================
  // ITEM ROUTES
  // ============================================
  ADD_ITEM: '/items/add',
  ITEM_DETAIL: (id) => `/items/${id}`,
  
  // ============================================
  // USER ROUTES
  // ============================================
  PROFILE: '/profile',
  USER_SETTINGS: '/settings',
  
  // ============================================
  // ADMIN ROUTES
  // ============================================
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_ORDERS: '/admin/orders',
  SIMPLE_ADMIN_ORDERS: '/admin/orders/simple',
  ADMIN_ORGANIZATIONS: '/admin/organizations',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ACTIVITY_LOG: '/admin/activity',
  ADMIN_ANALYTICS: '/admin/analytics',
  PLATFORM_SUPPORT: '/admin/platform-support'
};

/**
 * List of all valid route paths for validation
 */
export const VALID_ROUTES = [
  '/', '/login', '/terms', '/privacy',
  '/organizations', '/organizations/register', '/organizations/public-sector', '/organizations/verify',
  '/items/add', '/profile', '/settings',
  '/admin', '/admin/users', '/admin/posts', '/admin/reports', '/admin/orders',
  '/admin/orders/simple', '/admin/organizations', '/admin/settings',
  '/admin/activity', '/admin/platform-support'
];

/**
 * Route groups for access control
 */
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.LANDING,
    ROUTES.LOGIN,
    ROUTES.BROWSE,
    ROUTES.TERMS,
    ROUTES.PRIVACY
  ],
  
  ORGANIZATION: [
    ROUTES.ORGANIZATIONS,
    ROUTES.REGISTER_ORGANIZATION,
    ROUTES.PUBLIC_SECTOR_REGISTRATION,
    ROUTES.ORGANIZATION_VERIFICATION
  ],
  
  USER: [
    ROUTES.PROFILE,
    ROUTES.USER_SETTINGS,
    ROUTES.ADD_ITEM
  ],
  
  ADMIN: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_POSTS,
    ROUTES.ADMIN_REPORTS,
    ROUTES.ADMIN_ORDERS,
    ROUTES.SIMPLE_ADMIN_ORDERS,
    ROUTES.ADMIN_ORGANIZATIONS,
    ROUTES.ADMIN_SETTINGS,
    ROUTES.ADMIN_ACTIVITY_LOG,
    ROUTES.PLATFORM_SUPPORT
  ]
};

/**
 * Check if a route path is valid
 * @param {string} path - Route path to validate
 * @returns {boolean}
 */
export const isValidRoute = (path) => {
  return VALID_ROUTES.includes(path) || path.startsWith('/items/') || path.startsWith('/organizations/');
};

/**
 * Check if a route requires authentication
 * @param {string} path - Route path to check
 * @returns {boolean}
 */
export const requiresAuth = (path) => {
  return ![...ROUTE_GROUPS.PUBLIC].includes(path);
};

/**
 * Check if a route requires admin access
 * @param {string} path - Route path to check
 * @returns {boolean}
 */
export const requiresAdmin = (path) => {
  return path.startsWith('/admin');
};

/**
 * Get the default route for a user role
 * @param {string} role - User role (user, admin, superAdmin)
 * @param {boolean} isLoggedIn - Whether user is logged in
 * @returns {string}
 */
export const getDefaultRoute = (role, isLoggedIn) => {
  if (!isLoggedIn) {
    return ROUTES.HOME;  // Shows landing page
  }
  
  if (role === 'superAdmin' || role === 'admin' || role === 'hallAdmin' || role === 'orgAdmin') {
    return ROUTES.ADMIN;
  }
  
  return ROUTES.HOME;  // Shows browse page for logged-in users
};

export default ROUTES;
