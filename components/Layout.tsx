import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS, THEME } from '../constants';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Hide nav on onboarding
  if (location.pathname === '/onboarding') {
    return <div className="min-h-screen bg-transparent">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row max-w-7xl mx-auto md:shadow-2xl overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="p-6 flex items-center justify-center">
          <Logo />
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${THEME.colors.primary} text-white shadow-md`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[100dvh] md:h-screen relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-center border-b border-gray-100 dark:border-gray-700 z-10 sticky top-0 transition-colors duration-300">
           <div className="scale-75">
             <Logo />
           </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-20 md:pb-0 text-gray-900 dark:text-gray-100">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2 flex justify-between items-center z-50 pb-safe transition-colors duration-300">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive ? THEME.colors.primaryText + ' dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`
              }
            >
              <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'fill-current' : ''}`} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;