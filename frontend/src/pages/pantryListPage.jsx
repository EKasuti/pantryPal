import React, { useState, useEffect, useCallback } from "react"; 
import Sidebar from "../components/Common/SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdDeleteOutline, MdEdit, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import DashboardNavbar from "../components/Common/DashboardNavbar";
import SearchBar from "../components/Common/SearchBar";
import AddItems from "../components/Create/AddItems";
import FilterButton from "../components/Common/FilterButton";
import { API_BASE_URL } from "../config/api";
import EditItems from "../components/Edit/EditItem";

function PantryListPage({ pantryName: defaultPantryName }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [pantryItems, setPantryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { pantryName: urlPantryName } = useParams();
    const currentPantryName = (urlPantryName || defaultPantryName || "Pantry 01").trim();
    const navigate = useNavigate();

    const fetchPantryItems = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const pantriesResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!pantriesResponse.ok) throw new Error('Failed to fetch pantries');

            const pantries = await pantriesResponse.json();
            const currentPantry = pantries.find(p => p.name.trim().toLowerCase() === currentPantryName.trim().toLowerCase());

            if (!currentPantry) throw new Error('Pantry not found');

            const itemsUrl = `${API_BASE_URL}/api/pantry/${currentPantry.id}/items`;
            const response = await fetch(itemsUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch pantry items');

            const data = await response.json();
            setPantryItems(data.map((item, index) => ({ ...item, numericId: index + 1 })));
        } catch (error) {
            console.error('Error fetching pantry items:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [currentPantryName]);

    useEffect(() => {
        fetchPantryItems();
    }, [fetchPantryItems]);

    useEffect(() => {
        if (!isAddItemModalOpen) {
            fetchPantryItems();
        }
    }, [isAddItemModalOpen, fetchPantryItems]);

    const handleQuantityChange = async (itemId, change) => {
        try {
            const token = localStorage.getItem('token');
            const currentItem = pantryItems.find(item => item.id === itemId);
            const newQuantity = Math.max(0, currentItem.quantity + change);

            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantryName}/item/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) throw new Error('Failed to update item quantity');

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
            
            const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!pantryResponse.ok) throw new Error('Failed to fetch pantries');

            const pantries = await pantryResponse.json();
            const currentPantry = pantries.find(p => p.name === currentPantryName);

            if (!currentPantry) throw new Error('Pantry not found');

            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantry.id}/item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) throw new Error('Failed to add new item');

            const addedItem = await response.json();
            
            setPantryItems(prevItems => {
                const newNumericId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.numericId)) + 1 : 1;
                const updatedItem = { ...addedItem, numericId: newNumericId };
                return [...prevItems, updatedItem];
            });

            setIsAddItemModalOpen(false);
        } catch (error) {
            console.error('Error adding new item:', error);
            setError(error.message);
        }
    };

    const handleEditItem = async (updatedItem) => {
        try {
            console.log("Handling edit item:", updatedItem); // Add this line for debugging
            const token = localStorage.getItem('token');
            const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!pantryResponse.ok) throw new Error('Failed to fetch pantries');

            const pantries = await pantryResponse.json();
            const currentPantry = pantries.find(p => p.name === currentPantryName);

            if (!currentPantry) throw new Error('Pantry not found');

            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantry.id}/item/${updatedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) throw new Error('Failed to update item');

            const updatedItemFromServer = await response.json();

            setPantryItems(prevItems =>
                prevItems.map(item =>
                    item.id === updatedItem.id ? { ...updatedItemFromServer, numericId: item.numericId } : item
                )
            );

            setIsEditItemModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
            setError(error.message);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!pantryResponse.ok) throw new Error('Failed to fetch pantries');

            const pantries = await pantryResponse.json();
            const currentPantry = pantries.find(p => p.name === currentPantryName);

            if (!currentPantry) throw new Error('Pantry not found');

            const response = await fetch(`${API_BASE_URL}/api/pantry/${currentPantry.id}/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete item');

            setPantryItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.id !== itemId);
                return updatedItems.map((item, index) => ({ ...item, numericId: index + 1 }));
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            setError(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isCollapsed={isSidebarCollapsed} currentPantryName={currentPantryName} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                <main className="flex-1 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <button 
                            className="text-primary flex items-center hover:text-primary-dark"
                            onClick={() => navigate('/dashboard')}
                        >
                            <MdArrowBackIosNew className="mr-1" />
                            <span>Back</span>
                        </button>
                        <div className="flex space-x-4">
                            <SearchBar placeholder={`Search ${currentPantryName} Items`}/>
                            <FilterButton placeholder="Filter by category" />
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
                                <th className="text-left p-3">ID</th>
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
                                        <td className="p-3">{item.numericId}</td>
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
                                            <button 
                                                className="text-blue-600 mr-2 hover:text-blue-800"
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setIsEditItemModalOpen(true);
                                                }}
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
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
            {isEditItemModalOpen && (
                <EditItems 
                    item={editingItem}
                    onClose={() => {
                        setIsEditItemModalOpen(false);
                        setEditingItem(null);
                    }}
                    onEditItem={handleEditItem}
                />
            )}
        </div>
    );
}

export default PantryListPage;