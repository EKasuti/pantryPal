import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const InputField = ({ label, type, id, value, onChange, required, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="text-start block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          id={id}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            type === 'date' ? 'appearance-none' : ''
          }`}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5 text-gray-500" />
            ) : (
              <FaEye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
        
      </div>
    </div>
  );
};

export default InputField;