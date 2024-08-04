import React, { useState } from "react";

import DashboardNavbar from "../components/Common/DashboardNavbar";
import Sidebar from "../components/Common/SideBar";
import SearchBar from "../components/Common/SearchBar";
import CreatePantry from "../components/Create/CreatePantry";
import PantryList from "../components/Common/PantryList";

// Data
import { pantryList } from "../data/PantryList";

function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCreatePantry, setShowCreatePantry] = useState(false);
  const [pantries] = useState(pantryList);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleCreatePantry = () => {
    setShowCreatePantry(!showCreatePantry);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard */}
        <DashboardNavbar toggleSidebar={toggleSidebar} />

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
            {showCreatePantry && <CreatePantry onClose={toggleCreatePantry} />}
          </div>

          <div className="flex-grow bg-white rounded-tl-lg rounded-tr-lg p-6">
            <PantryList pantries={pantries} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;