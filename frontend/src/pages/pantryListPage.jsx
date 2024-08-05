import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBackIosNew,
  MdDeleteOutline,
  MdEdit,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import Sidebar from "../components/Common/SideBar";
import DashboardNavbar from "../components/Common/DashboardNavbar";
import SearchBar from "../components/Common/SearchBar";
import AddItems from "../components/Create/AddItems";
import FilterButton from "../components/Common/FilterButton";
import EditItems from "../components/Edit/EditItem";
import { API_BASE_URL } from "../config/api";

function PantryListPage({ pantryName: defaultPantryName }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [filteredPantryItems, setFilteredPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [user, setUser] = useState(null);
  const [reminders, setReminders] = useState({
    lowQuantityItems: [],
    nearingExpiryItems: [],
  });
  const [pantries, setPantries] = useState([]);

  const { pantryName: urlPantryName } = useParams();
  const currentPantryName = (
    urlPantryName ||
    defaultPantryName ||
    "Pantry 01"
  ).trim();
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const fetchPantryItems = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const pantriesResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pantriesResponse.ok) throw new Error("Failed to fetch pantries");

      const pantries = await pantriesResponse.json();
      const currentPantry = pantries.find(
        (p) =>
          p.name.trim().toLowerCase() === currentPantryName.trim().toLowerCase()
      );

      if (!currentPantry) throw new Error("Pantry not found");

      const itemsUrl = `${API_BASE_URL}/api/pantry/${currentPantry.id}/items`;
      const response = await fetch(itemsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch pantry items");

      const data = await response.json();
      setPantryItems(
        data.map((item, index) => ({ ...item, numericId: index + 1 }))
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPantryName]);

  const handleQuantityChange = async (itemId, change) => {
    try {
      const token = localStorage.getItem('token');
      const currentItem = pantryItems.find((item) => item.id === itemId);
      const newQuantity = Math.max(0, currentItem.quantity + change);

      const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pantryResponse.ok) throw new Error("Failed to fetch pantries");

      const pantries = await pantryResponse.json();
      const currentPantry = pantries.find((p) => p.name === currentPantryName);

      if (!currentPantry) throw new Error("Pantry not found");

      const response = await fetch(
        `${API_BASE_URL}/api/pantry/${currentPantry.id}/item/${itemId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error("Failed to update item quantity");

      setPantryItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Update the pantry's total quantity
      const quantityDifference = newQuantity - currentItem.quantity;
      updatePantryQuantity(currentPantry.id, quantityDifference);

    } catch (error) {
      setError(error.message);
    }
  };

  const updatePantryQuantity = (pantryId, quantityChange) => {
    setPantries((prevPantries) =>
      prevPantries.map((pantry) =>
        pantry.id === pantryId
          ? { ...pantry, quantity: pantry.quantity + quantityChange }
          : pantry
      )
    );
  };

  const handleAddItem = async (newItem) => {
    try {
      const token = localStorage.getItem('token');

      const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pantryResponse.ok) throw new Error("Failed to fetch pantries");

      const pantries = await pantryResponse.json();
      const currentPantry = pantries.find((p) => p.name === currentPantryName);

      if (!currentPantry) throw new Error("Pantry not found");

      const response = await fetch(
        `${API_BASE_URL}/api/pantry/${currentPantry.id}/item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newItem),
        }
      );

      if (!response.ok) throw new Error("Failed to add new item");

      const addedItem = await response.json();

      setPantryItems((prevItems) => {
        const newNumericId =
          prevItems.length > 0
            ? Math.max(...prevItems.map((item) => item.numericId)) + 1
            : 1;
        const updatedItem = { ...addedItem, numericId: newNumericId };
        return [...prevItems, updatedItem];
      });

      // Update the pantry's total quantity and items count
      updatePantryQuantity(currentPantry.id, newItem.quantity);
      updatePantryItemsCount(currentPantry.id, 1);

      setIsAddItemModalOpen(false);
      await fetchPantryItems();
    } catch (error) {
      setError(error.message);
    }
  };

  const updatePantryItemsCount = (pantryId, change) => {
    setPantries((prevPantries) =>
      prevPantries.map((pantry) =>
        pantry.id === pantryId
          ? { ...pantry, items: pantry.items + change }
          : pantry
      )
    );
  };

  const handleEditItem = async (updatedItem) => {
    try {
      const token = localStorage.getItem("token");
      const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pantryResponse.ok) throw new Error("Failed to fetch pantries");

      const pantries = await pantryResponse.json();
      const currentPantry = pantries.find((p) => p.name === currentPantryName);

      if (!currentPantry) throw new Error("Pantry not found");

      const response = await fetch(
        `${API_BASE_URL}/api/pantry/${currentPantry.id}/item/${updatedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) throw new Error("Failed to update item");

      const updatedItemFromServer = await response.json();

      setPantryItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id
            ? { ...updatedItemFromServer, numericId: item.numericId }
            : item
        )
      );

      setIsEditItemModalOpen(false);
      setEditingItem(null);
      await fetchPantryItems();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const pantryResponse = await fetch(`${API_BASE_URL}/api/pantry/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pantryResponse.ok) throw new Error("Failed to fetch pantries");

      const pantries = await pantryResponse.json();
      const currentPantry = pantries.find((p) => p.name === currentPantryName);

      if (!currentPantry) throw new Error("Pantry not found");

      const itemToDelete = pantryItems.find(item => item.id === itemId);

      const response = await fetch(
        `${API_BASE_URL}/api/pantry/${currentPantry.id}/item/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete item");

      setPantryItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        return updatedItems.map((item, index) => ({
          ...item,
          numericId: index + 1,
        }));
      });

      // Update the pantry's total quantity and items count
      updatePantryQuantity(currentPantry.id, -itemToDelete.quantity);
      updatePantryItemsCount(currentPantry.id, -1);

      await fetchPantryItems();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilter = useCallback(
    (category) => {
      setCategoryFilter(category);
      if (category) {
        const filtered = pantryItems.filter((item) =>
          item.category.toLowerCase().includes(category.toLowerCase())
        );
        setFilteredPantryItems(filtered);
      } else {
        setFilteredPantryItems(pantryItems);
      }
    },
    [pantryItems]
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      const filtered = pantryItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter
            ? item.category.toLowerCase().includes(categoryFilter.toLowerCase())
            : true)
      );
      setFilteredPantryItems(filtered);
    },
    [pantryItems, categoryFilter]
  );

  const generateReminders = useCallback(() => {
    const lowQuantityThreshold = 3;
    const expiryThresholdDays = 7;

    const lowQuantityItems = pantryItems.filter(
      (item) => item.quantity <= lowQuantityThreshold
    );

    const nearingExpiryItems = pantryItems.filter((item) => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= expiryThresholdDays && daysUntilExpiry > 0;
    });

    return { lowQuantityItems, nearingExpiryItems };
  }, [pantryItems]);

  useEffect(() => {
    fetchUserData();
    fetchPantryItems();
  }, [fetchUserData, fetchPantryItems]);

  useEffect(() => {
    if (categoryFilter) {
      handleFilter(categoryFilter);
    } else {
      setFilteredPantryItems(pantryItems);
    }
    setReminders(generateReminders());
  }, [pantryItems, categoryFilter, handleFilter, generateReminders]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        currentPantryName={currentPantryName}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userName={user ? user.name : ""}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              className="text-primary flex items-center hover:text-primary-dark"
              onClick={() => navigate("/dashboard")}
            >
              <MdArrowBackIosNew className="mr-1" />
              <span>Back</span>
            </button>
            <div className="flex space-x-4">
              <SearchBar
                placeholder={`Search ${currentPantryName} Items`}
                onSearch={handleSearch}
              />
              <FilterButton
                placeholder="Filter by category"
                onFilter={handleFilter}
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
              {filteredPantryItems.length > 0 ? (
                filteredPantryItems.map((item) => (
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
                        <MdDeleteOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Click the "+ Item" button to add items to your pantry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-8 bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b-2">Reminders</h2>
            {reminders.lowQuantityItems.length === 0 &&
            reminders.nearingExpiryItems.length === 0 ? (
              <p>No reminders at this time.</p>
            ) : (
              <div className="space-y-4">
                {reminders.lowQuantityItems.length > 0 && (
                  <div className="bg-orange-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                    <p className="font-bold">Low Quantity Items:</p>
                    <ul className="list-disc list-inside">
                      {reminders.lowQuantityItems.map((item) => (
                        <li key={item.id}>
                          {item.name} (Quantity: {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {reminders.nearingExpiryItems.length > 0 && (
                  <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md">
                    <p className="font-bold">Items Nearing Expiry:</p>
                    <ul className="list-disc list-inside">
                      {reminders.nearingExpiryItems.map((item) => (
                        <li key={item.id}>
                          {item.name} (Expires: {item.expiryDate})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
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
