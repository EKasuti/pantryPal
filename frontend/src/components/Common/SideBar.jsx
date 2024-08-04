import React from 'react';
import { FaHome } from 'react-icons/fa';
import logo from '../../images/logo/logo.png';
import { Link } from 'react-router-dom';
import { pantryList } from "../../data/PantryList";

function Sidebar({ isCollapsed, currentPantryName }) {
  const sidebarWidth = isCollapsed ? 'w-30' : 'w-64';


  return (
    <aside className={`${sidebarWidth} bg-blue-900 text-white transition-all duration-300 ease-in-out h-screen`}>
      <div className="p-4">
        <Link to="/dashboard/" className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={logo} alt="Pantry Pal" className="w-8 h-8 mr-2" />
          {!isCollapsed && <h1 className="text-xl font-bold">Pantry Pal</h1>}
        </Link>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/dashboard/" className={`flex items-center p-2 rounded hover:bg-blue-800 ${isCollapsed ? 'justify-center' : ''}`}>
                <FaHome className="w-5 h-5 mr-2" />
                {!isCollapsed && <span className="text-lg">Pantries</span>}
              </Link>
            </li>
            {!isCollapsed && pantryList.map((pantry) => (
              <li key={pantry.id} className="mb-2 ">
                <Link 
                  to={`/dashboard/pantryList/${pantry.name}`} 
                  className={`text-sm  ${
                    currentPantryName === pantry.name 
                      ? 'border-b-4 border-secondary text-white text-xl' 
                      : ''
                  }`}
                >
                  {pantry.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;