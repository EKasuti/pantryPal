import React, { useState } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { API_BASE_URL } from "../../config/api";

function PantryList({ pantries, onPantryDeleted }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleEditClick = (event, pantryName) => {
    event.stopPropagation(); 
    navigate(`/dashboard/pantryList/${pantryName}`);
  };

  const handleDeleteClick = async (event, pantryId) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this pantry? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/pantry/${pantryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`Failed to delete pantry: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Deletion successful:', data);
        
        // Call onPantryDeleted only if it's a function
        if (typeof onPantryDeleted === 'function') {
          onPantryDeleted(pantryId);
        } else {
          console.error('onPantryDeleted is not a function');
        }
        
        setError(null);
      } catch (error) {
        console.error('Error deleting pantry:', error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {error && (
        <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {pantries.map((pantry) => (
        <div
          key={pantry.id}
          className="bg-white rounded-lg shadow-md p-4 border"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">{pantry.name}</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <FaThumbtack />
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <div className="flex justify-between">
              <span>Categories:</span>
              <span>{pantry.categories}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{pantry.quantity}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-1">
            <button 
              className="text-blue-500 hover:text-blue-700"
              onClick={(e) => handleEditClick(e, pantry.name)}
            >
              <MdEdit size={20} />
            </button>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={(e) => handleDeleteClick(e, pantry.id)}
            >
              <MdDeleteOutline size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PantryList;