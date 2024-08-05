import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import DashboardNavbar from "../components/Common/DashboardNavbar";
import Sidebar from "../components/Common/SideBar";
import SearchBar from "../components/Common/SearchBar";
import CreatePantry from "../components/Create/CreatePantry";
import PantryList from "../components/Common/PantryList";

function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCreatePantry, setShowCreatePantry] = useState(false);
  const [pantries, setPantries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDataAndPantries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Fetch user data
        const userResponse = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.status} ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch pantry list
        const pantriesResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Pantries response:', pantriesResponse);

        if (!pantriesResponse.ok) {
          console.error('Pantries response not ok:', pantriesResponse.status, pantriesResponse.statusText);
          const errorText = await pantriesResponse.text();
          console.error('Error response text:', errorText);
          throw new Error(`Failed to fetch pantry list: ${pantriesResponse.status} ${pantriesResponse.statusText}`);
        }

        const pantriesData = await pantriesResponse.json();
        setPantries(pantriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndPantries();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleCreatePantry = () => {
    setShowCreatePantry(!showCreatePantry);
  };

  const handlePantryCreated = (newPantry) => {
    console.log('New pantry created:', newPantry);
    setPantries(prevPantries => [...prevPantries, newPantry]);
  };

  const handlePantryDeleted = (deletedPantryId) => {
    console.log('Deleting pantry with ID:', deletedPantryId);
    setPantries(prevPantries => prevPantries.filter(pantry => pantry.id !== deletedPantryId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard */}
        <DashboardNavbar 
          toggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed}
          userName={user ? user.name : ''}
        />

        <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="px-4 py-8 bg-background">
            <div className="flex justify-between items-center">
              <div className="w-1/2">
                <SearchBar placeholder="Search Pantry list" />
              </div>
              <button
                onClick={toggleCreatePantry}
                className="bg-primary text-white font-bold py-2 px-4 rounded"
              >
                + Pantry
              </button>
            </div>
            {showCreatePantry && (
              <CreatePantry 
                onClose={toggleCreatePantry} 
                onPantryCreated={handlePantryCreated}
              />
            )}
          </div>

          <div className="flex-grow bg-white rounded-tl-lg rounded-tr-lg p-6">
            <PantryList pantries={pantries} onPantryDeleted={handlePantryDeleted} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;