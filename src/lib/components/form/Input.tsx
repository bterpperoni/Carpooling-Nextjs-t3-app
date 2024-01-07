// Input.tsx

import { InputProps } from '$/utils/interface';
import React from 'react';



const Input: React.FC<InputProps> = ({ label, classInput, type, value, onChange, placeholder }) => {
  return (
    <div className="mt-4 flex flex-col items-center">
      <label className="w-full text-center border-b-2 text-xl md:text-2xl text-black text-left" htmlFor={label}>
        {label}
      </label>
      <input
        className={`rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 text-center ${classInput}`}
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

