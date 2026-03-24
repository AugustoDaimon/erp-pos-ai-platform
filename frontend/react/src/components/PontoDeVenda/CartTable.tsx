import React from 'react';
import HoverScrollText from '../HoverScrollText';

// Exportamos a interface para o PointOfSale poder usá-la
export interface CartItem {
  id: string; // Mudamos para string para usar o truque "id-isInstalled"
  productId: number;
  name: string;
  qty: number;
  unitPrice: number;
}

interface CartTableProps {
  items: CartItem[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

export default function CartTable({ items, onIncrease, onDecrease }: CartTableProps) {

  const formatPrice = (value: number) => {
    const parts = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',');
    return { integer: parts[0], cents: parts[1] };
  };

  return (
    <div className="flex-1 bg-[#f8f9fa] flex flex-col overflow-hidden shrink-0 font-sans border border-gray-200">

      {/* Cabeçalho */}
      <div className="flex w-full px-4 py-3 border-b border-gray-300 bg-white text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 gap-8">
        <div className="flex-1 pl-1">Produto</div>
        <div className="w-24 text-center">Qtd.</div>
        <div className="w-28 text-right pr-2">Valor Unit.</div>
        <div className="w-32 text-right pr-2">Total</div>
      </div>

      {/* Corpo da Tabela */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">

        {/* Adicionei uma mensagem para carrinho vazio */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 font-medium pb-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Seu carrinho está vazio
          </div>
        )}

        {items.map((item) => {
          const totalValue = item.qty * item.unitPrice;
          const unitPriceFormatted = formatPrice(item.unitPrice);
          const totalPriceFormatted = formatPrice(totalValue);

          return (
            <div key={item.id} className="flex items-center w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 shrink-0 gap-8">

              {/* Coluna 1: Produto */}
              {/* Coluna 1: Produto (NOVO E ANIMADO) */}
              <div className="flex-1 flex items-center min-w-0 pr-4"> {/* pr-4 dá um respiro pro texto não colar na Qtd */}
                <HoverScrollText
                  text={item.name}
                  className="text-sm font-medium text-gray-800 uppercase w-full"
                />
              </div>
              
              {/* Coluna 2: Controles de Quantidade */}
              <div className="w-24 flex items-center justify-center shrink-0">
                <div className="flex h-8 rounded border border-gray-300 overflow-hidden shadow-sm">
                  {/* Mudança: onDecrease */}
                  <button onClick={() => onDecrease(item.id)} className="w-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    {item.qty === 1 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                    )}
                  </button>

                  <input type="text" value={item.qty} readOnly className="w-8 text-center text-sm font-bold text-gray-800 outline-none" />

                  {/* Mudança: onIncrease */}
                  <button onClick={() => onIncrease(item.id)} className="w-8 bg-[#497ca4] hover:bg-[#3a6282] flex items-center justify-center transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </button>
                </div>
              </div>

              {/* Coluna 3 e 4 mantidas idênticas... */}
              <div className="w-24 flex justify-between items-end shrink-0">
                <span className="text-gray-600 text-sm pb-[1px]">R$</span>
                <div className="text-gray-800 font-medium text-[15px] leading-none text-right flex items-baseline">
                  <span>{unitPriceFormatted.integer}</span>
                  <span className="text-[11px]">,{unitPriceFormatted.cents}</span>
                </div>
              </div>

              <div className="w-28 flex justify-between items-end shrink-0 pr-2">
                <span className="text-black font-bold text-sm pb-[1px]">R$</span>
                <div className="text-black font-bold text-base leading-none text-right flex items-baseline">
                  <span>{totalPriceFormatted.integer}</span>
                  <span className="text-xs">,{totalPriceFormatted.cents}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}