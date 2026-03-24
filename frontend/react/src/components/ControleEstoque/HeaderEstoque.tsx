import React from 'react';

interface HeaderEstoqueProps {
  onCadastrar: () => void;
  onPesquisar: () => void;
}

export const HeaderEstoque: React.FC<HeaderEstoqueProps> = ({ onCadastrar, onPesquisar }) => {
  return (
    <div className="flex justify-between items-center mb-4 w-[95%] max-w-[1800px] shrink-0">
      <div className="flex gap-2">
        <button className="bg-[#0d6efd] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-600 transition">
          PRODUTO
        </button>
        <button className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition">
          BICICLETA
        </button>
        <button className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition">
          SERVIÇO
        </button>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onCadastrar}
          className="bg-[#00c950] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-green-500 transition"
        >
          CADASTRAR
        </button>
        <button 
          onClick={onPesquisar}
          className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition"
        >
          PESQUISAR
        </button>
      </div>
    </div>
  );
};