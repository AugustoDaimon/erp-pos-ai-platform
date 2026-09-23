import React, { useState } from 'react';

export interface AutocompleteProps {
  placeholder?: string;
  options: string[];
  className?: string;
  onSelect?: (value: string) => void; 
}

export default function AutocompleteInput({ 
  placeholder, 
  options, 
  className = '',
  onSelect 
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const firstMatch = inputValue
    ? options.find((opt) => opt.toLowerCase().startsWith(inputValue.toLowerCase()))
    : null;

  const inlineSuggestion = firstMatch && inputValue
    ? inputValue + firstMatch.slice(inputValue.length)
    : '';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && inlineSuggestion) {
      e.preventDefault(); // Evita que o foco pule para o próximo campo ao usar o Tab
      setInputValue(firstMatch!); 
      setIsOpen(false);
      if (onSelect) onSelect(firstMatch!);
    }
  };

  const inputStyleBase =
    'border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full transition-all';

  return (
    <div className={`relative w-full ${className}`}>
      {/* INPUT DE FUNDO (Sugestão fantasma) */}
      <input
        type="text"
        className={`${inputStyleBase} absolute top-0 left-0 bg-gray-50 text-gray-400 pointer-events-none placeholder-transparent`}
        value={inlineSuggestion}
        readOnly
        tabIndex={-1}
      />

      {/* INPUT PRINCIPAL */}
      <input
        type="text"
        placeholder={placeholder}
        className={`${inputStyleBase} relative z-10 bg-transparent placeholder-gray-400 font-medium`}
        value={inputValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setInputValue(newValue);
          setIsOpen(true);
          if (onSelect) onSelect(newValue); // Sincroniza imediatamente com o pai
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />

      {/* DROPDOWN MENU */}
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-1.5 rounded-xl shadow-lg max-h-52 overflow-y-auto overflow-x-hidden">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onMouseDown={(e) => {
                // onMouseDown é usado ao invés de onClick para disparar ANTES do onBlur do input
                e.preventDefault();
                setInputValue(opt);
                setIsOpen(false);
                if (onSelect) onSelect(opt);
              }}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors border-b border-gray-100 last:border-0"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}