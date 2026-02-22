import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Home, 
  Users, 
  Building2, 
  BarChart3, 
  ChevronDown, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { ROUTES } from '../constants/routes';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, currentUser, userRole } = useApp();
  const [expandedSections, setExpandedSections] = useState({
    adminDashboard: true
  });

useEffect(()=>{
  if (!userRole || !['superAdmin', 'admin'].includes(userRole)) {
    // Redirect non-admin users
    navigate(ROUTES.HOME);
  }
}, [userRole, navigate])


  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if current path matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if current path starts with
  const isActiveSection = (path) => {
    return location.pathname.startsWith(path);
  };

  // Sidebar navigation items
  const navigationItems = [
    {
      id: 'home',
      label: 'My Dashboard',
      icon: Home,
      path: '/',
      active: location.pathname === '/' || isActive('/admin/user-settings')
    },
    {
      id: 'adminDashboard',
      label: 'Admin Dashboard',
      icon: Shield,
      path: ROUTES.ADMIN,
      active: location.pathname === '/admin' || (isActiveSection('/admin') && location.pathname !== '/' && location.pathname !== '/admin/user-settings'),
      expandable: true,
      expanded: expandedSections.adminDashboard,
      children: [
        {
          id: 'organizations',
          label: 'Organizations',
          icon: Building2,
          path: ROUTES.ADMIN_ORGANIZATIONS,
          active: isActive(ROUTES.ADMIN_ORGANIZATIONS)
        },
        {
          id: 'users',
          label: 'Users',
          icon: Users,
          path: ROUTES.ADMIN_USERS,
          active: isActive(ROUTES.ADMIN_USERS)
        },
        {
          id: 'systemReports',
          label: 'System Reports',
          icon: BarChart3,
          path: ROUTES.ADMIN_REPORTS,
          active: isActive(ROUTES.ADMIN_REPORTS)
        }
      ]
    }
  ];

  // Render navigation item
  const renderNavItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.expanded;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren && item.expandable) {
              // For expandable items with path (like Admin Dashboard)
              if (item.path) {
                // Navigate to the path AND toggle expansion
                navigate(item.path);
                toggleSection(item.id);
              } else {
                // Just toggle expansion for items without path
                toggleSection(item.id);
              }
            } else if (item.path) {
              // Navigate to path for non-expandable items
              navigate(item.path);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            level === 0 ? 'mb-1' : 'mb-0.5'
          } ${
            item.active
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${(level * 16) + 16}px` }}
        >
          <div className="flex items-center">
            {Icon && <Icon className="h-5 w-5 mr-3" />}
            <span>{item.label}</span>
          </div>
          {hasChildren && item.expandable && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </button>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar - positioned below header */}
      <div className={`w-64 fixed left-0 top-16 bottom-0 z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col overflow-hidden`}>
        {/* Sidebar Header - Only show when not on My Dashboard */}
        {location.pathname !== '/' && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Admin Panel
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {userRole === 'superAdmin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 p-4 space-y-2 overflow-y-auto ${location.pathname === '/' ? 'pt-6' : ''}`}>
          {navigationItems.map(item => renderNavItem(item))}
        </nav>

        {/* User Info */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentUser?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser?.name || 'Admin'}
              </p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentUser?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64 mt-16">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;