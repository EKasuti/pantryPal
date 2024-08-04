import React from 'react';
import { FaPencilAlt, FaTrash, FaThumbtack } from 'react-icons/fa';

function PantryList({ pantries }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pantries.map((pantry) => (
        <div key={pantry.id} className="bg-white rounded-lg shadow-md p-4">
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
              <span>{pantry.items}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost:</span>
              <span>${pantry.cost.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button className="text-blue-500 hover:text-blue-700">
              <FaPencilAlt />
            </button>
            <button className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PantryList;