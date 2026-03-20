import React from 'react';

export default function CustomerData() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full lg:w-1/2 flex flex-col gap-3 font-sans text-gray-800 border border-gray-100">
      <h2 className="font-bold text-[1.1rem]">Dados do Cliente</h2>

      {/* Linha 1: Nome */}
      <div className="flex items-center gap-2">
        <label className="w-16 text-right text-[15px]">Nome:</label>
        <input 
          type="text" 
          placeholder="Nome" 
          className="flex-1 bg-[#f4f3eb] rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400" 
        />
      </div>

      {/* Linha 2: Celular e Whatsapp */}
      <div className="flex items-center gap-2">
        <label className="w-16 text-right text-[15px]">Celular:</label>
        <input 
          type="text" 
          placeholder="Celular" 
          className="w-32 bg-[#f4f3eb] rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400" 
        />
        <label className="flex items-center gap-2 text-sm cursor-pointer ml-1">
          <input 
            type="checkbox" 
            className="rounded border-gray-300 w-4 h-4 accent-[#143a64]" 
          />
          Sem Whatsapp
        </label>
      </div>

      {/* Linha 3: Bike */}
      <div className="flex items-center gap-2">
        <label className="w-16 text-right text-[15px]">Bike:</label>
        <input 
          type="text" 
          placeholder='Quadro Cor Aro Detalhe'
          className="flex-1 bg-[#f4f3eb] rounded-md px-3 py-1.5 outline-none text-sm" 
        />
      </div>

      {/* Linha 4: Toggle e Botão de Pesquisa */}
      <div className="flex items-center justify-between mt-2 pl-1">
        <label className="flex items-center gap-2 cursor-pointer relative">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          {/* Fundo do Toggle (Dourado) */}
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#c9b485] transition-colors"></div>
          {/* Bolinha Branca do Toggle */}
          <div className="absolute left-[3px] top-[3px] bg-white w-[18px] h-[18px] rounded-full transition-transform peer-checked:translate-x-5 shadow-sm border border-gray-200"></div>
          <span className="text-[15px]">Emitir Nota Fiscal</span>
        </label>

        <button className="bg-[#143a64] hover:bg-[#0f2d4e] transition-colors text-white rounded-md px-3 py-1.5 flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Pesquisar Cliente
        </button>
      </div>
    </div>
  );
}