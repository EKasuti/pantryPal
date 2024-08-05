import React, { useState } from 'react';
import { CiFilter } from "react-icons/ci";

function FilterButton({ placeholder, onFilter }) {
  const [filterValue, setFilterValue] = useState('');

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    onFilter(value);
  };

  return (
    <div className="relative">
      <div className="text-black absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <CiFilter className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={filterValue}
        onChange={handleFilterChange}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-primary placeholder-black"
      />
    </div>
  );
}

export default FilterButton;