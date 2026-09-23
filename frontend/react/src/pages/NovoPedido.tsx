import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  ChevronRight,
  ShieldCheck,
  Truck
} from 'lucide-react';

// --- MOCK DATA PARA O DESIGN ---
const cartItems = [
  {
    id: 1,
    name: 'Corrente KMC X9 9v Prata',
    category: 'Transmissão',
    qty: 5,
    suppliers: [
      { name: 'Shimano Brasil', price: 85.00, stock: true, isCheapest: false },
      { name: 'Bicicletaria Atacado', price: 78.50, stock: true, isCheapest: true },
      { name: 'Dist. Duas Rodas', price: 82.00, stock: true, isCheapest: false },
    ]
  },
  {
    id: 2,
    name: 'Pneu Maxxis Ikon 29x2.20 Kevlar',
    category: 'Pneus e Câmaras',
    qty: 10,
    suppliers: [
      { name: 'Bicicletaria Atacado', price: 215.00, stock: true, isCheapest: false },
      { name: 'Dist. Duas Rodas', price: 198.00, stock: true, isCheapest: true },
    ]
  },
  {
    id: 3,
    name: 'Pastilha de Freio Resina B01S',
    category: 'Freios',
    qty: 20,
    suppliers: [
      { name: 'Shimano Brasil', price: 42.00, stock: true, isCheapest: true },
      { name: 'Bicicletaria Atacado', price: 45.00, stock: true, isCheapest: false },
    ]
  }
];

export default function NovoPedido() {
  const [activeTab, setActiveTab] = useState<'optimized' | 'single'>('optimized');

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-gray-800 font-sans pb-12">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                Novo Pedido Inteligente
              </h1>
              <p className="text-sm font-medium text-gray-500">Adicione produtos e encontre a melhor combinação de fornecedores</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-500 font-semibold text-sm hover:text-gray-800 transition-colors">
              Salvar Rascunho
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col xl:flex-row gap-8">
        
        {/* COLUNA ESQUERDA: ITENS DO PEDIDO */}
        <div className="flex-1 space-y-6">
          
          {/* BARRA DE BUSCA */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Search size={24} />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Busque por SKU, nome ou categoria para adicionar..." 
                className="w-full text-lg font-medium bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
              <Plus size={20} /> Adicionar
            </button>
          </div>

          {/* LISTA DE PRODUTOS */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                
                {/* CABEÇALHO DO PRODUTO */}
                <div className="p-5 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Qtd.</label>
                      <input 
                        type="number" 
                        defaultValue={item.qty}
                        className="w-20 text-center font-bold text-gray-800 bg-white border border-gray-200 rounded-lg py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <button className="p-2 mt-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remover item">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* COMPARAÇÃO DE FORNECEDORES */}
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingDown size={14} /> Comparativo de Fornecedores
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {item.suppliers.map((sup, idx) => (
                      <div 
                        key={idx} 
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          sup.isCheapest 
                            ? 'border-emerald-500 bg-emerald-50/30 shadow-sm' 
                            : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/20'
                        }`}
                      >
                        {sup.isCheapest && (
                          <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles size={10} /> Melhor Preço
                          </span>
                        )}
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{sup.name}</h4>
                        <div className="flex justify-between items-end mt-3">
                          <p className="text-xl font-extrabold text-gray-900">
                            <span className="text-sm font-medium text-gray-500 mr-1">R$</span>
                            {sup.price.toFixed(2).replace('.', ',')}
                          </p>
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck size={12} /> Em estoque
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: INTELIGÊNCIA DE COMPRA E RESUMO */}
        <div className="w-full xl:w-[400px]">
          <div className="sticky top-28 space-y-6">
            
            {/* PAINEL DE OTIMIZAÇÃO */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2 mb-2">
                  <Sparkles size={20} className="text-blue-200" /> Inteligência de Compra
                </h2>
                <p className="text-blue-100 text-sm font-medium leading-relaxed">
                  O sistema analisou os preços e encontrou opções para otimizar seu lucro. Escolha a melhor estratégia:
                </p>
              </div>

              {/* TABS DE ESTRATÉGIA */}
              <div className="flex p-2 bg-gray-50 border-b border-gray-100">
                <button 
                  onClick={() => setActiveTab('optimized')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'optimized' ? 'bg-white text-emerald-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Maior Economia
                </button>
                <button 
                  onClick={() => setActiveTab('single')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'single' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Fornecedor Único
                </button>
              </div>

              {/* CONTEÚDO DO RESUMO */}
              <div className="p-6">
                
                {activeTab === 'optimized' ? (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Economia Estimada</p>
                      <p className="text-2xl font-extrabold text-emerald-700">R$ 215,00</p>
                      <p className="text-xs font-medium text-emerald-600 mt-1">Dividindo o pedido em 3 fornecedores.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Bicicletaria Atacado
                        </span>
                        <span className="font-bold text-gray-900">R$ 392,50</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Dist. Duas Rodas
                        </span>
                        <span className="font-bold text-gray-900">R$ 1.980,00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-sky-500"></span> Shimano Brasil
                        </span>
                        <span className="font-bold text-gray-900">R$ 840,00</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Fornecedor Recomendado</p>
                      <p className="text-lg font-extrabold text-blue-800">Bicicletaria Atacado</p>
                      <p className="text-xs font-medium text-blue-600 mt-1 flex items-center gap-1">
                        <Truck size={12}/> Frete único, menos burocracia.
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700">Subtotal</span>
                        <span className="font-bold text-gray-900">R$ 3.427,50</span>
                    </div>
                    <p className="text-xs text-red-500 font-medium">*Você deixa de economizar R$ 215,00 comprando tudo aqui.</p>
                  </div>
                )}

                <div className="border-t border-gray-100 mt-6 pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total a Pagar</span>
                    <span className="text-3xl font-extrabold text-gray-900">
                      {activeTab === 'optimized' ? 'R$ 3.212,50' : 'R$ 3.427,50'}
                    </span>
                  </div>

                  <button className="w-full bg-[#00c950] text-black font-extrabold text-lg py-4 rounded-xl hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 uppercase tracking-wide">
                    Gerar Pedidos <ChevronRight size={20} />
                  </button>
                  <p className="text-center text-xs font-medium text-gray-400 mt-3">
                    {activeTab === 'optimized' ? '3 pedidos serão gerados separadamente.' : '1 pedido será gerado.'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}