import React from 'react';

export default function OrderSummary() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full lg:w-1/2 flex flex-col gap-1.5 font-sans text-gray-800 border border-gray-100">
      <h2 className="font-bold text-[1.1rem] uppercase mb-1">Resumo do Pedido</h2>

      {/* Subtotal */}
      <div className="flex items-center text-[15px]">
        <span className="flex-1">Subtotal:</span>
        <span className="w-8 text-right pr-2">R$</span>
        <span className="w-24 text-right font-bold tracking-wide">20,00</span>
      </div>

      {/* Taxas Cartão */}
      <div className="flex items-center text-[15px]">
        <span className="flex-1">Taxas Cartão:</span>
        <span className="w-8 text-right pr-2">R$</span>
        <span className="w-24 text-right font-bold tracking-wide">5,00</span>
      </div>

      {/* Desconto */}
      <div className="flex items-center my-0.5">
        <button className="bg-[#2970b5] hover:bg-[#205b95] transition-colors text-white px-2 py-0.5 rounded text-sm flex items-center gap-1 shadow-sm">
          Desconto: <span className="font-sans font-medium text-lg leading-none mb-[2px]">+</span>
        </button>
        <div className="flex-1"></div>
        <span className="w-8 text-right pr-2 text-[15px]">R$</span>
        <span className="w-24 text-right font-bold tracking-wide text-[15px]">99.999,00</span>
      </div>

      {/* Divisória sutil */}
      <div className="border-t border-gray-200 my-1"></div>

      {/* Valor Total */}
      <div className="flex items-center font-bold text-[16px]">
        <span className="flex-1">Valor Total:</span>
        <span className="w-8 text-right pr-2">R$</span>
        <span className="w-24 text-right tracking-wide">20,00</span>
      </div>

      {/* Valor Pago (Com Input) */}
      <div className="flex items-center font-bold text-[16px] mt-1">
        <span className="flex-1">Valor Pago:</span>
        <div className="w-32 flex justify-end">
          <input 
            type="text" 
            defaultValue="25,00" 
            className="w-24 border border-gray-300 rounded px-2 py-0.5 text-right font-normal text-[15px] outline-none focus:border-[#143a64]" 
          />
        </div>
      </div>

      {/* Troco e Método de Pagamento */}
      <div className="flex items-center justify-between font-bold text-[16px] mt-2">
        <span>MEtodo</span>
        <div className="relative">
          <select className="bg-[#143a64] hover:bg-[#0f2d4e] transition-colors text-white px-4 py-1.5 rounded-md text-sm outline-none appearance-none pr-8 cursor-pointer shadow-sm">
            <option>Método</option>
            <option>Dinheiro</option>
            <option>PIX</option>
            <option>Cartão Crédito</option>
          </select>
          {/* Ícone de Seta do Select */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}