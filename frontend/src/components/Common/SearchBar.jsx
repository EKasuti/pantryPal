import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ placeholder }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

export default SearchBar;