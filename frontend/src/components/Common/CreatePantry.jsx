import React, { useState } from "react";
import InputField from "../Auth/InputField";

function CreatePantry({ onClose }) {
  const [pantryName, setPantryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend logic
    console.log("Creating pantry:", pantryName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-12 rounded-lg shadow-xl">
        <h2 className="text-2xl mb-4">Create a New Pantry</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Pantry Name"
            value={pantryName}
            onChange={(e) => setPantryName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Create Pantry
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePantry;
