import React from 'react';
import { FaBars, FaUser, FaChevronRight } from 'react-icons/fa';

function DashboardNavbar({ toggleSidebar, isSidebarCollapsed }) {
  return (
    <nav className='flex justify-between items-center px-4 py-2 bg-white h-16'>
      <button 
        onClick={toggleSidebar}
        className=" hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        {isSidebarCollapsed ? <FaChevronRight className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
      </button>

      <div className="flex items-center">
        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
          <FaUser className="h-5 w-5" />
        </button>
      </div>
    </nav>    
  );
}

export default DashboardNavbar;