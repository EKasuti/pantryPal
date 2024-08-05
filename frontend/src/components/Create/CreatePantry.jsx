import React, { useState } from "react";
import InputField from "../Auth/InputField";
import { MdClose } from "react-icons/md";
import { API_BASE_URL } from "../../config/api";

function CreatePantry({ onClose, onPantryCreated }) {
  const [pantryName, setPantryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/pantry/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: pantryName })
      });

      if (!response.ok) {
        throw new Error('Failed to create pantry');
      }

      const data = await response.json();
      console.log("Pantry created:", data);
      
      // Call the onPantryCreated callback if provided
      if (onPantryCreated) {
        onPantryCreated(data.pantry);
      }

      onClose();
    } catch (error) {
      console.error("Error creating pantry:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-12 rounded-lg shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-2xl mb-4">Create a New Pantry</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Pantry Name"
            value={pantryName}
            onChange={(e) => setPantryName(e.target.value)}
            required
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Pantry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePantry;