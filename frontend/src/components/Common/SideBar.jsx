import React, { useState, useEffect } from 'react';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../images/logo/logo.png';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from "../../config/api";
import Loader from './Loader';

function Sidebar({ isCollapsed, currentPantryName, toggleSidebar }) {
  const [pantries, setPantries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  useEffect(() => {
    fetchPantries();
  }, []);

  const fetchPantries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/pantry/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pantries');
      }

      const data = await response.json();
      setPantries(data);
    } catch (error) {
      console.error('Error fetching pantries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  const SidebarContent = () => (
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
          {!isCollapsed && pantries.map((pantry) => (
            <li key={pantry.id} className="mb-2">
              <Link 
                to={`/dashboard/pantryList/${pantry.name}`} 
                className={`text-sm ${
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
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-blue-900 p-2 rounded"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:block ${sidebarWidth} bg-blue-900 text-white transition-all duration-300 ease-in-out h-screen`}>
        <SidebarContent />
      </aside>
    </>
  );
}

export default Sidebar;