import React, { useState } from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdEdit, MdExpandMore, MdExpandLess } from "react-icons/md";
import { API_BASE_URL } from "../../config/api";

function PantryList({ pantries, onPantryDeleted, onPantryUpdated }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [expandedPantry, setExpandedPantry] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [newNotes, setNewNotes] = useState('');

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
          throw new Error(`Failed to delete pantry: ${response.statusText}`);
        }

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

  const toggleExpand = (pantryId) => {
    setExpandedPantry(expandedPantry === pantryId ? null : pantryId);
  };

  const handleAddNotes = (pantryId) => {
    setEditingNotes(pantryId);
    setNewNotes('');
  };

  const handleSaveNotes = async (pantryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/pantry/${pantryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: newNotes }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update pantry notes: ${response.statusText}`);
      }

      const updatedPantry = await response.json();
      if (typeof onPantryUpdated === 'function') {
        onPantryUpdated(updatedPantry);
      }

      setEditingNotes(null);
      setNewNotes('');
      setError(null);
    } catch (error) {
      console.error('Error updating pantry notes:', error);
      setError(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
            <h3 className="text-lg sm:text-xl font-semibold truncate">{pantry.name}</h3>
            <button className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
              <FaThumbtack />
            </button>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            <div className="flex justify-between">
              <span>Categories:</span>
              <span>{pantry.categories || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{pantry.items || 0}</span>
            </div>
           
          </div>
          {pantry.notes || editingNotes === pantry.id ? (
            <div className="mt-2">
              {editingNotes === pantry.id ? (
                <>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    rows="3"
                  />
                  <button
                    onClick={() => handleSaveNotes(pantry.id)}
                    className="mt-2 bg-primary text-white px-2 py-1 rounded text-sm"
                  >
                    Save Notes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(pantry.id)}
                    className="flex items-center text-xs sm:text-sm text-primary hover:text-blue-700"
                  >
                    {expandedPantry === pantry.id ? (
                      <>
                        <MdExpandLess className="mr-1" /> Hide Notes
                      </>
                    ) : (
                      <>
                        <MdExpandMore className="mr-1" /> Show Notes
                      </>
                    )}
                  </button>
                  {expandedPantry === pantry.id && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-600">{pantry.notes}</p>
                  )}
                </>
              )}
            </div>
          ) : null}
          <div className="flex justify-between items-center space-x-1 mt-2">
            {!pantry.notes && (
              <button 
                className="text-primary hover:text-primary-100 text-xs sm:text-sm"
                onClick={() => handleAddNotes(pantry.id)}
              >
                Add a note
              </button>
            )}
            <div className="flex space-x-1">
              <button 
                className="text-primary hover:text-primary-100"
                onClick={(e) => handleEditClick(e, pantry.name)}
              >
                <MdEdit size={18} />
              </button>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={(e) => handleDeleteClick(e, pantry.id)}
              >
                <MdDeleteOutline size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PantryList;