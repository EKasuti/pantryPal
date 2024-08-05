import React, { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";

function SearchBar({ placeholder, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className="text-black absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IoSearchOutline className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-primary placeholder-black"
      />
    </div>
  );
}

export default SearchBar;