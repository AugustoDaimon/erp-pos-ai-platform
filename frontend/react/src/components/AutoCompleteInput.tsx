import React, { useState } from 'react';

export interface AutocompleteProps {
  placeholder: string;
  options: string[];
  className?: string;
}

export default function AutocompleteInput({ 
  placeholder, 
  options, 
  className = '' 
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

  // FUNÇÃO CORRIGIDA: Agora o Tab completa e pula para o próximo campo!
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && inlineSuggestion) {
      // Removemos o e.preventDefault() daqui!
      setInputValue(firstMatch!); // Completa com a sugestão
      setIsOpen(false);           // Fecha o dropdown
      // O navegador agora fará o trabalho dele e moverá o foco naturalmente.
    }
  };

  const inputStyleBase =
    'border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className={`relative w-full ${className}`}>
      {/* INPUT DE FUNDO (Sugestão azul) */}
      <input
        type="text"
        className={`${inputStyleBase} absolute top-0 left-0 bg-[#fdf2e3] text-blue-500 pointer-events-none placeholder-transparent`}
        value={inlineSuggestion}
        readOnly
        tabIndex={-1} // Garante que o usuário nunca foque neste input fantasma acidentalmente
      />

      {/* INPUT PRINCIPAL */}
      <input
        type="text"
        placeholder={placeholder}
        className={`${inputStyleBase} relative z-10 bg-transparent placeholder-black`}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />

      {/* DROPDOWN MENU */}
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full bg-[#fdf2e3] border-2 border-black mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onMouseDown={(e) => {
                e.preventDefault();
                setInputValue(opt);
                setIsOpen(false);
              }}
              className="px-3 py-2 hover:bg-[#b1e1fb] cursor-pointer font-bold text-gray-800 border-b border-gray-300 last:border-0 transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}