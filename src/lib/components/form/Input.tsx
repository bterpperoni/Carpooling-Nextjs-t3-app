// Input.tsx

import { InputProps } from '$/utils/interface';
import React from 'react';



const Input: React.FC<InputProps> = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="mb-2">
      <label className="text-gray-700 text-sm font-bold mb-1" htmlFor={label}>
        {label}
      </label>
      <input
        className="rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 mb-1"
        type={type}
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

