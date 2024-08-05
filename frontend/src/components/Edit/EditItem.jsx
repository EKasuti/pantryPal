import React, { useState, useEffect } from 'react';
import InputField from '../Auth/InputField';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown, MdClose } from "react-icons/md";

function EditItems({ item, onClose, onEditItem }) {
    const [editedItem, setEditedItem] = useState({
        id: '',
        name: '',
        category: '',
        quantity: 0,
        purchaseDate: '',
        expiryDate: ''
    });

    useEffect(() => {
        console.log("Item received in EditItems:", item);
        setEditedItem({
            id: item.id,
            name: item.name || '',
            category: item.category || '',
            quantity: item.quantity || 0,
            purchaseDate: item.purchaseDate || '',
            expiryDate: item.expiryDate || ''
        });
    }, [item]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setEditedItem(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleQuantityChange = (change) => {
        setEditedItem(prev => ({
            ...prev,
            quantity: Math.max(0, Number(prev.quantity) + change)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onEditItem({
            ...editedItem,
            quantity: Number(editedItem.quantity)
        });
    };

    console.log("Current editedItem state:", editedItem);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <MdClose size={24} />
                </button>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Item</h3>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Item Name"   
                        type="text"
                        id="name"
                        value={editedItem.name}
                        onChange={handleChange}
                        required={true}
                        placeholder="Enter item name"
                    />
                    <InputField
                        label="Category"
                        type="text"
                        id="category"
                        value={editedItem.category}
                        onChange={handleChange}
                        required={true}
                        placeholder="Enter category"
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                        </label>
                        <div className="flex items-center">
                            <InputField
                                type="number"
                                id="quantity"
                                value={editedItem.quantity}
                                onChange={handleChange}
                                required={true}
                                placeholder="Enter quantity"
                            />
                            <div className="flex flex-col ml-2">
                                <button 
                                    type="button"
                                    onClick={() => handleQuantityChange(1)}
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <MdOutlineKeyboardArrowUp size={24} />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleQuantityChange(-1)}
                                    className="text-gray-600 hover:text-blue-600"
                                    disabled={editedItem.quantity <= 0}
                                >
                                    <MdOutlineKeyboardArrowDown size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <InputField
                        type="date"
                        label="Purchase Date"
                        id="purchaseDate"
                        value={editedItem.purchaseDate}
                        onChange={handleChange}
                    />
                    <InputField
                        type="date"
                        label="Expiry Date"
                        id="expiryDate"
                        value={editedItem.expiryDate}
                        onChange={handleChange}
                    />  
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-primary text-white rounded-md"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditItems;