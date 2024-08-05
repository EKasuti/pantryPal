import React, { useState, useEffect } from "react"; 
import Sidebar from "../components/Common/SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdDeleteOutline, MdEdit, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import DashboardNavbar from "../components/Common/DashboardNavbar";
import SearchBar from "../components/Common/SearchBar";
import AddItems from "../components/Create/AddItems";
import FilterButton from "../components/Common/FilterButton";
import { API_BASE_URL } from "../config/api";

function PantryListPage({ pantryName: defaultPantryName }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [pantryItems, setPantryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { pantryName: urlPantryName } = useParams();
    const currentPantryName = urlPantryName || defaultPantryName || "Pantry 01";
    const navigate = useNavigate();

    useEffect(() => {
        fetchPantryItems();
    }, [currentPantryName]);

    const fetchPantryItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantryName}/items`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pantry items');
            }

            const data = await response.json();
            setPantryItems(data);
        } catch (error) {
            console.error('Error fetching pantry items:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate('/dashboard');
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleQuantityChange = async (itemId, change) => {
        try {
            const token = localStorage.getItem('token');
            const currentItem = pantryItems.find(item => item.id === itemId);
            const newQuantity = Math.max(0, currentItem.quantity + change); // Ensure quantity doesn't go below 0

            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantryName}/item/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update item quantity');
            }

            // Update the local state
            setPantryItems(prevItems => 
                prevItems.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating item quantity:', error);
            setError(error.message);
        }
    };

    const handleAddItem = async (newItem) => {
        try {
            const token = localStorage.getItem('token');
            
            // First, get the pantry ID using the pantry name
            const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!pantryResponse.ok) {
                throw new Error('Failed to fetch pantries');
            }

            const pantries = await pantryResponse.json();
            const currentPantry = pantries.find(p => p.name === currentPantryName);

            if (!currentPantry) {
                throw new Error('Pantry not found');
            }

            // Now use the pantry ID to add the item
            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantry.id}/item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) {
                throw new Error('Failed to add new item');
            }

            const addedItem = await response.json();
            console.log('New item added:', addedItem);

            // Update the items state with the new item
            setPantryItems(prevItems => [...prevItems, addedItem.item]);

            // Close the modal
            setIsAddItemModalOpen(false);
        } catch (error) {
            console.error('Error adding new item:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              currentPantryName={currentPantryName} 
            />
            <div className="flex-1 flex flex-col overflow-hidden">
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
                                        <td className="text-left p-3">{item.expiryDate}</td>
                                        <td className="text-left p-3">
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    className="text-gray-600 hover:text-blue-600"
                                                >
                                                    <MdOutlineKeyboardArrowUp size={24} />
                                                </button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className="text-gray-600 hover:text-blue-600"
                                                    disabled={item.quantity <= 0}
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