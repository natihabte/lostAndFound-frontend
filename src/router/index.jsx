import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { authHelpers } from '../services/api';
import { useApp } from '../contexts/AppContext';

// Layouts
import AppLayout from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages - Lazy load for better performance
const LandingPage = React.lazy(() => import('../components/ModernLandingPage'));
const ModernAuth = React.lazy(() => import('../components/ModernAuth'));
const BrowseItemsPage = React.lazy(() => import('../pages/BrowseItemsPage'));
const ItemDetailPage = React.lazy(() => import('../pages/ItemDetailPage'));
const UserDashboardPage = React.lazy(() => import('../pages/UserDashboardPage'));
const UserSettings = React.lazy(() => import('../pages/UserSettings'));
const ModernAddItem = React.lazy(() => import('../components/ModernAddItem'));

// Organization Pages
const OrganizationsDashboard = React.lazy(() => import('../pages/OrganizationsDashboard'));
const OrganizationDetailPage = React.lazy(() => import('../pages/OrganizationDetailPage'));
const OrganizationRegister = React.lazy(() => import('../pages/OrganizationRegister'));
const PublicSectorRegistration = React.lazy(() => import('../pages/PublicSectorRegistration'));
const OrganizationVerification = React.lazy(() => import('../pages/OrganizationVerification'));

// Admin Pages
const HallAdminDashboard = React.lazy(() => import('../pages/admin/HallAdminDashboard'));
const OrgAdminDashboard = React.lazy(() => import('../pages/admin/OrgAdminDashboard'));
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('../pages/admin/AdminUsers'));
const AdminPosts = React.lazy(() => import('../pages/admin/AdminPosts'));
const AdminReports = React.lazy(() => import('../pages/admin/AdminReports'));
const AdminOrders = React.lazy(() => import('../pages/admin/AdminOrders'));
const SimpleAdminOrders = React.lazy(() => import('../pages/admin/SimpleAdminOrders'));
const AdminOrganizations = React.lazy(() => import('../pages/admin/AdminOrganizations'));
const AdminSettings = React.lazy(() => import('../pages/admin/AdminSettings'));
const AdminActivityLog = React.lazy(() => import('../pages/admin/AdminActivityLog'));

// Legal Pages
const PrivacyPolicy = React.lazy(() => import('../components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('../components/TermsOfService'));

// Smart Home Component - Shows Landing or User Dashboard based on auth status
const SmartHome = () => {
  const { isLoggedIn } = useApp();
  const user = authHelpers.getUser();
  
  // Show user dashboard for logged-in users, landing for guests
  if (isLoggedIn) {
    // For admin users, render with AdminLayout (sidebar)
    if (user?.role === 'superAdmin' || user?.role === 'admin') {
      return (
        <AdminLayout>
          <UserDashboardPage />
        </AdminLayout>
      );
    }
    // For regular users, show user dashboard (no sidebar)
    return <UserDashboardPage />;
  }
  
  return <LandingPage />;
};

// Profile Router - Uses AdminLayout for admins, AppLayout for regular users
const ProfileRouter = () => {
  const user = authHelpers.getUser();
  
  if (user?.role === 'superAdmin' || user?.role === 'admin') {
    // Admin users get the sidebar layout
    return (
      <AdminLayout>
        <UserDashboardPage />
      </AdminLayout>
    );
  }
  
  // Regular users get the normal layout
  return <UserDashboardPage />;
};

// Admin Dashboard Router - Shows correct dashboard based on role
const AdminDashboardRouter = () => {
  const user = authHelpers.getUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    
    // Role-based dashboard routing
    if (user.role === 'superAdmin') {
      // SuperAdmin sees HallAdminDashboard (full access)
      return;
    } else if (user.role === 'admin') {
      // Admin (org admin) sees OrgAdminDashboard  
      return;
    } else {
      // Regular users shouldn't be here
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);
  
  // Render appropriate dashboard
  if (user?.role === 'superAdmin') {
    return <HallAdminDashboard />;
  } else if (user?.role === 'admin') {
    return <OrgAdminDashboard />;
  }
  
  return <Navigate to={ROUTES.HOME} replace />;
};

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const isAuthenticated = authHelpers.isAuthenticated();
  const user = authHelpers.getUser();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (requireAdmin && user?.role !== 'superAdmin' && user?.role !== 'admin') {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  return children;
};

// Create router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Root route - Smart home that shows landing or browse based on auth
      {
        index: true,
        element: <SmartHome />
      },
      
      // Legacy routes - redirect to root
      {
        path: ROUTES.LANDING,
        element: <Navigate to="/" replace />
      },
      {
        path: ROUTES.HOME,
        element: <Navigate to="/" replace />
      },
      {
        path: ROUTES.BROWSE,
        element: <Navigate to="/" replace />
      },
      
      // Public Routes
      {
        path: ROUTES.LOGIN,
        element: <ModernAuth />
      },
      {
        path: ROUTES.TERMS,
        element: <TermsOfService />
      },
      {
        path: ROUTES.PRIVACY,
        element: <PrivacyPolicy />
      },
      
      // Organization Routes
      {
        path: ROUTES.ORGANIZATIONS,
        element: <OrganizationsDashboard />
      },
      {
        path: '/organizations/:id',
        element: <OrganizationDetailPage />
      },
      {
        path: ROUTES.REGISTER_ORGANIZATION,
        element: <OrganizationRegister />
      },
      {
        path: ROUTES.PUBLIC_SECTOR_REGISTRATION,
        element: <PublicSectorRegistration />
      },
      {
        path: ROUTES.ORGANIZATION_VERIFICATION,
        element: <OrganizationVerification />
      },
      
      // Item Routes
      {
        path: '/items/:id',
        element: <ItemDetailPage />
      },
      {
        path: ROUTES.ADD_ITEM,
        element: (
          <ProtectedRoute>
            <ModernAddItem />
          </ProtectedRoute>
        )
      },
      
      // User Routes (Protected) - Non-admin users only
      {
        path: ROUTES.USER_SETTINGS,
        element: (
          <ProtectedRoute>
            <UserSettings />
          </ProtectedRoute>
        )
      },
      
      // 404 - Catch all - redirect to home
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  },
  
  // Admin Layout - Separate layout for admin users
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Admin Dashboard Overview
      {
        index: true,
        element: <AdminDashboardRouter />
      },
      
      // Admin Routes
      {
        path: 'users',
        element: <AdminUsers />
      },
      {
        path: 'posts',
        element: <AdminPosts />
      },
      {
        path: 'reports',
        element: <AdminReports />
      },
      {
        path: 'orders',
        element: <AdminOrders />
      },
      {
        path: 'orders/simple',
        element: <SimpleAdminOrders />
      },
      {
        path: 'organizations',
        element: <AdminOrganizations />
      },
      {
        path: 'settings',
        element: <AdminSettings />
      },
      {
        path: 'activity',
        element: <AdminActivityLog />
      },
      {
        path: 'platform-support',
        element: <AdminSettings defaultTab="platform" />
      },
      {
        path: 'profile',
        element: <UserDashboardPage />
      },
      {
        path: 'user-settings',
        element: <UserSettings />
      }
    ]
  },
  
  // Profile Route - Uses AdminLayout for admins, AppLayout for regular users
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <ProfileRouter />
      </ProtectedRoute>
    )
  }
]);

export default router;
