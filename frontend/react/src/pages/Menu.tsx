import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Tags, Wrench, Bike, Users, BarChart3, Store } from 'lucide-react';

export default function Menu() {
  return (
    <div className="min-h-screen w-full bg-[#f4f6f9] p-6 lg:p-10 font-sans flex flex-col items-center justify-center">

      <div className="w-full max-w-5xl">

        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm border border-blue-200">
            <Store size={32} strokeWidth={2} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#143a64] uppercase tracking-tight mb-2">
            Menu Principal
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">

          <Link
            to="/ponto-de-venda"
            className="col-span-2 md:col-span-1 row-span-2 bg-[#0d74ff] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#0b66e6]"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 border-2 border-dashed border-white/40 rounded-xl flex items-center justify-center text-white/60 mb-4 md:mb-6">
              <ShoppingCart size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-extrabold text-2xl md:text-3xl mb-1 tracking-tight">PONTO DE<br />VENDA</h3>
            <p className="text-blue-100 text-sm font-medium mt-1">Realizar Novas Vendas</p>
          </Link>

          <Link
            to="/estoque"
            className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-gray-100"
          >
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 mb-3">
              <Package size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Estoque</h3>
            <p className="text-gray-500 text-xs lg:text-sm">Gerenciar Produtos</p>
          </Link>

          <Link
            to="/gerenciar-catalogo"
            className="bg-[#f0ecd7] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#e5e0c8]"
          >
            <div className="w-16 h-16 border-2 border-dashed border-[#c9b485] rounded-xl flex items-center justify-center text-[#c9b485] mb-3">
              <Tags size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Catálogo</h3>
            <p className="text-gray-600 text-xs lg:text-sm">Categorias e Marcas</p>
          </Link>

          <Link
           to="/servicos"
           className="bg-[#f0ecd7] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#e5e0c8]">
            <div className="w-16 h-16 border-2 border-dashed border-[#c9b485] rounded-xl flex items-center justify-center text-[#c9b485] mb-3">
              <Wrench size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Serviços</h3>
            <p className="text-gray-600 text-xs lg:text-sm">Agendar Manutenções</p>
          </Link>

          <div className="bg-[#d5effd] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#bce3f9]">
            <div className="w-16 h-16 border-2 border-dashed border-[#71bdec] rounded-xl flex items-center justify-center text-[#71bdec] mb-3">
              <Bike size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Bicicletas</h3>
            <p className="text-gray-600 text-xs lg:text-sm">Inventário de Veículos</p>
          </div>

          <Link 
            to="/clientes"
            className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-gray-100"
          >
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 mb-3">
              <Users size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Clientes</h3>
            <p className="text-gray-500 text-xs lg:text-sm">Gerenciar Cadastros</p>
          </Link>

          <Link 
            to="/relatorios"
            className="bg-[#f0ecd7] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#e5e0c8]"
          >
            <div className="w-16 h-16 border-2 border-dashed border-[#c9b485] rounded-xl flex items-center justify-center text-[#c9b485] mb-3">
              <BarChart3 size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Relatórios</h3>
            <p className="text-gray-600 text-xs lg:text-sm">Verificar Pedidos</p>
          </Link>

        </div>
      </div>
    </div>
  );
}