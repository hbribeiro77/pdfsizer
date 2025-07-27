'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, AlertCircle } from 'lucide-react';

interface SizeInputProps {
  name: string;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function SizeInput({ 
  name, 
  label, 
  placeholder = "0.0", 
  min = 0.1, 
  max = 100, 
  step = 0.1 
}: SizeInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          {...register(name)}
          type="number"
          id={name}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
            }
            ${isFocused ? 'ring-2 ring-blue-500' : ''}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">MB</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error.message as string}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Tamanho entre {min}MB e {max}MB
      </div>
    </div>
  );
} 