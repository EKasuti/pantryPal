import React from 'react';
import { FaBars, FaChevronRight } from 'react-icons/fa';
import { FaRegCircleUser } from "react-icons/fa6";

function DashboardNavbar({ toggleSidebar, isSidebarCollapsed }) {
  return (
    <nav className='flex justify-between items-center px-4 py-2 bg-white h-16 shadow-md relative z-10'>
      <button 
        onClick={toggleSidebar}
        className="hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        {isSidebarCollapsed ? <FaChevronRight className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
      </button>

      <div className="flex items-center">
        <FaRegCircleUser className="h-8 w-8 text-black" />
      </div>
    </nav>    
  );
}

export default DashboardNavbar;