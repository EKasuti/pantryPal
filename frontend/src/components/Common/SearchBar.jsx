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
    <div className="relative w-full max-w-md mx-auto">
      <div className="text-black absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IoSearchOutline className="h-4 w-4 sm:h-5 sm:w-5 " />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base rounded-lg bg-white border border-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-black shadow-sm"
      />
    </div>
  );
}

export default SearchBar;