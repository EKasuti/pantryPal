import React from 'react';
import { FaHome } from 'react-icons/fa';
import logo from '../../images/logo/logo.png';

function Sidebar({ isCollapsed }) {
  const sidebarWidth = isCollapsed ? 'w-30' : 'w-64';

  return (
    <aside className={`${sidebarWidth} bg-blue-900 text-white transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={logo} alt="Pantry Pal" className="w-8 h-8 mr-2" />
          {!isCollapsed && <h1 className="text-xl font-bold">Pantry Pal</h1>}
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#pantries" className={`flex items-center p-2 rounded hover:bg-blue-800 ${isCollapsed ? 'justify-center' : ''}`}>
                <FaHome className="w-5 h-5 mr-2" />
                {!isCollapsed && <span>Pantries</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;