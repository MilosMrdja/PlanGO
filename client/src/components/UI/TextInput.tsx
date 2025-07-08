import React from 'react';
interface TextInputProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string;
    required?: boolean;
    min?: number;
    placeholder?: string;
  }

  const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    name,
    required = false,
    min,
    placeholder,
  }) => {
    return (
      <div>
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          min={min}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    );
  };
  
  export default TextInput;