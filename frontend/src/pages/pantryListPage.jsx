import React, { useState } from "react"; 
import Sidebar from "../components/Common/SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { pantryList } from "../data/PantryList";
import { MdArrowBackIosNew, MdDeleteOutline, MdEdit, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import DashboardNavbar from "../components/Common/DashboardNavbar";
import SearchBar from "../components/Common/SearchBar";
import AddItems from "../components/Create/AddItems";
import FilterButton from "../components/Common/FilterButton";


function PantryListPage({ pantryName: defaultPantryName }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const { pantryName: urlPantryName } = useParams();
    const currentPantryName = urlPantryName || defaultPantryName || "Pantry 01";
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/dashboard');
    };
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
      };

    // Find the current pantry and its items
    const currentPantry = pantryList.find(pantry => pantry.name === currentPantryName);
    const pantryItems = currentPantry ? currentPantry.items || [] : [];

    const handleQuantityChange = (itemName, change) => {
        // Backend call to update quantity  
        console.log(`Update quantity for ${itemName} by ${change}`);
       
    };

    const handleAddItem = (newItem) => {
        // Backend to add the new item to the pantry
        console.log("Adding new item:", newItem);
       
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              currentPantryName={currentPantryName} 
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard */}
                <DashboardNavbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <button 
                            className="text-primary flex items-center hover:text-primary-dark"
                            onClick={handleBackClick}
                        >
                            <MdArrowBackIosNew className="mr-1" />
                            <span>Back</span>
                        </button>
                        <div className="flex space-x-4">
                            <SearchBar 
                            placeholder={`Search ${currentPantryName} Items`}/>

                            <FilterButton 
                                placeholder="Filter by category"
                            />
                            <button 
                                className="bg-primary text-white px-4 py-2 rounded-md"
                                onClick={() => setIsAddItemModalOpen(true)}
                            >
                                + Item
                            </button>
                        </div>
                    </div>
                    <table className="w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3"></th>
                                <th className="text-left p-3">Item</th>
                                <th className="text-left p-3">Category</th>
                                <th className="text-left p-3">Purchase Date</th>
                                <th className="text-left p-3">Expiry Date</th>
                                <th className="text-left p-3">Quantity</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pantryItems.length > 0 ? (
                                pantryItems.map((item) => (
                                    <tr key={item.id} className="border-b">
                                         <td className="p-3">{item.id}</td>
                                        <td className="text-left p-3">{item.name}</td>
                                        <td className="text-left p-3">{item.category}</td>
                                        <td className="text-left p-3">{item.purchaseDate}</td>
                                        <td className="text-left p-3">{item.expirationDate}</td>
                                        <td className="text-left p-3">
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.name, 1)}
                                                    className="text-gray-600 hover:text-blue-600"
                                                >
                                                    <MdOutlineKeyboardArrowUp size={24} />
                                                </button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.name, -1)}
                                                    className="text-gray-600 hover:text-blue-600"
                                                >
                                                    <MdOutlineKeyboardArrowDown size={24} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-left p-3">
                                            <button className="text-blue-600 mr-2 hover:text-blue-800">
                                                <MdEdit size={18} />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800">
                                               
                                                <MdDeleteOutline size={20}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">
                                        No items in this pantry.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </main>
            </div>
            {isAddItemModalOpen && (
                <AddItems 
                    pantryName={currentPantryName}
                    onClose={() => setIsAddItemModalOpen(false)}
                    onAddItem={handleAddItem}
                />
            )}
        </div>
    );
}

export default PantryListPage;