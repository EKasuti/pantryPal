import React from 'react';
import { FaThumbtack } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdEdit} from "react-icons/md";

function PantryList({ pantries }) {
  const navigate = useNavigate();

  const handlePantryClick = (pantryName) => {
    navigate(`/dashboard/pantryList/${pantryName}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {pantries.map((pantry) => (
        <div
          key={pantry.id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer border"
          onClick={() => handlePantryClick(pantry.name)}
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
            <button className="text-blue-500 hover:text-blue-700">
              <MdEdit size={20} />
            </button>
            <button className="text-red-500 hover:text-red-700">
              <MdDeleteOutline size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PantryList;