import React, { useState, useEffect } from 'react';
import InputField from '../Auth/InputField';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown, MdClose } from "react-icons/md";

function EditItems({ item, onClose, onEditItem }) {
    const [editedItem, setEditedItem] = useState({
        name: '',
        category: '',
        quantity: 0,
        purchaseDate: '',
        expiryDate: ''
    });

    useEffect(() => {
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
        const { name, value } = e.target;
        setEditedItem(prev => ({ ...prev, [name]: value }));
    };

    const handleQuantityChange = (change) => {
        setEditedItem(prev => ({
            ...prev,
            quantity: Math.max(0, Number(prev.quantity) + change)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting edited item:", editedItem); // Add this line for debugging
        onEditItem({
            ...editedItem,
            quantity: Number(editedItem.quantity)
        });
    };

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
                        name="name"
                        value={editedItem.name}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Category"
                        name="category"
                        value={editedItem.category}
                        onChange={handleChange}
                        required
                    />
                    <div className="mb-4">
                        <div className="flex justify-between items-center">
                            <InputField
                                label="Quantity"
                                name="quantity"
                                value={editedItem.quantity}
                                onChange={handleChange}
                                required
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
                        name="purchaseDate"
                        value={editedItem.purchaseDate}
                        onChange={handleChange}
                    />
                    <InputField
                        type="date"
                        label="Expiry Date"
                        name="expiryDate"
                        value={editedItem.expiryDate}
                        onChange={handleChange}
                    />  
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditItems;