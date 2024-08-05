import React from 'react';
import { FaBars, FaChevronRight, FaUserCircle } from 'react-icons/fa';

function DashboardNavbar({ toggleSidebar, isSidebarCollapsed, userName }) {
  const userInitial = userName ? userName.charAt(0).toUpperCase() : '';

  return (
    <nav className='flex justify-between items-center px-4 py-2 bg-white h-16 shadow-md relative z-10'>
      <button 
        onClick={toggleSidebar}
        className="hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        {isSidebarCollapsed ? <FaChevronRight className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
      </button>

      <div className="flex items-center">
        {userInitial ? (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-semibold text-sm">
            {userInitial}
          </div>
        ) : (
          <FaUserCircle className="h-8 w-8 text-gray-500" />
        )}
      </div>
    </nav>    
  );
}

export default DashboardNavbar;