import React, { useState } from 'react';

// Interface para os itens do carrinho
interface CartItem {
  id: number;
  name: string;
  qty: number;
  unitPrice: number;
  imageUrl?: string;
}

export default function CartTable() {
  // Estado simulando os itens no carrinho
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, name: 'CÂMARA DE AR ARO 29', qty: 1, unitPrice: 20.00 },
    { id: 2, name: 'PNEU CONTINENTAL GATOR SKIN 700x23', qty: 2, unitPrice: 100.00 },
    { id: 3, name: 'KIT REMENDO PEDALFAST', qty: 1, unitPrice: 15.00 },
    { id: 4, name: 'CAPACETE BELL FALCON', qty: 1, unitPrice: 30222.00 },
  ]);

  // Função para formatar o preço separando os centavos
  const formatPrice = (value: number) => {
    // Formata com separador de milhar (pt-BR) e garante 2 casas decimais
    const parts = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',');
    return { integer: parts[0], cents: parts[1] };
  };

  // Funções mock para os botões de quantidade (não alteram estado real neste exemplo, apenas para demonstração)
  const increaseQty = (id: number) => console.log('Aumentar', id);
  const decreaseQty = (id: number) => console.log('Diminuir/Remover', id);

    return (
        <div className="flex-1 bg-[#f8f9fa] flex flex-col overflow-hidden shrink-0 font-sans border border-gray-200">
        
        {/* Cabeçalho da Tabela - Adicionado gap-8 e voltado aos tamanhos originais */}
        <div className="flex w-full px-4 py-3 border-b border-gray-300 bg-white text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 gap-8">
            <div className="flex-1 pl-1">Produto</div>
            <div className="w-24 text-center">Qtd.</div>
            <div className="w-28 text-right pr-2">Valor Unit.</div>
            <div className="w-32 text-right pr-2">Total</div>
        </div>
        
        {/* Corpo da Tabela */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            {items.map((item) => {
            const totalValue = item.qty * item.unitPrice;
            const unitPriceFormatted = formatPrice(item.unitPrice);
            const totalPriceFormatted = formatPrice(totalValue);

            return (
                // Adicionado gap-8 aqui também para espelhar o cabeçalho
                <div key={item.id} className="flex items-center w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 shrink-0 gap-8">
                
                {/* Coluna 1: Produto */}
                <div className="flex-1 flex items-center min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate uppercase">
                    {item.name}
                    </span>
                </div>

                {/* Coluna 2: Controles de Quantidade (w-24) */}
                <div className="w-24 flex items-center justify-center shrink-0">
                    <div className="flex h-8 rounded border border-gray-300 overflow-hidden shadow-sm">
                    <button 
                        onClick={() => decreaseQty(item.id)}
                        className="w-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        {item.qty === 1 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                        )}
                    </button>
                    
                    <input 
                        type="text" 
                        value={item.qty} 
                        readOnly
                        className="w-8 text-center text-sm font-bold text-gray-800 outline-none"
                    />
                    
                    <button 
                        onClick={() => increaseQty(item.id)}
                        className="w-8 bg-[#497ca4] hover:bg-[#3a6282] flex items-center justify-center transition-colors text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    </div>
                </div>

                {/* Coluna 3: Valor Unitário (w-24) */}
                <div className="w-24 flex justify-between items-end shrink-0">
                    <span className="text-gray-600 text-sm pb-[1px]">R$</span>
                    <div className="text-gray-800 font-medium text-[15px] leading-none text-right flex items-baseline">
                    <span>{unitPriceFormatted.integer}</span>
                    <span className="text-[11px]">,{unitPriceFormatted.cents}</span>
                    </div>
                </div>

                {/* Coluna 4: Total (w-28) */}
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