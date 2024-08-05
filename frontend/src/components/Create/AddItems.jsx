import React, { useState } from 'react';
import InputField from '../Auth/InputField';

function AddItems({ pantryName, onClose, onAddItem }) {
  const [itemName, setItemName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create new item object
    const newItem = {
      name: itemName,
      purchaseDate,
      expiryDate,
      category,
      quantity
    };
    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Add Item(s) to {pantryName}</h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            {/* Item Name */}
            <InputField
              label="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

           {/* Purchase Date */}
            <InputField
                label="Purchase Date (optional)"
                type="date"
                id="purchaseDate"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required={false}
            />

            {/* Expiry Date */}
            <InputField
                label="Expiry Date (optional)"
                type="date"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required={false}
                />
            <div className="flex mb-4">
              <InputField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="w-1/2 ml-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button type="button" onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer">
                    <span className="m-auto text-2xl font-thin">−</span>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    className="outline-none focus:outline-none text-center w-full bg-gray-100 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700 outline-none"
                    name="custom-input-number"
                  />
                  <button type="button" onClick={() => setQuantity(prev => prev + 1)} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                ADD ITEM
              </button>
            </div>
          </form>
        </div>
        <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800">
          <span className="text-2xl">&times;</span>
        </button>
      </div>
    </div>
  );
}

export default AddItems;