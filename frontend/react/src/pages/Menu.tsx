import React from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <div className="min-h-screen w-full bg-[#f4f6f9] p-6 lg:p-10 font-sans">

      {/* 1. Container Principal do Banner (Resumo Rápido e Atualizações) */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-[#1b2b4d] via-[#3a6b94] to-[#aedcf4] p-3 flex flex-col lg:flex-row gap-4 shadow-sm">

        {/* PARTE ESQUERDA: Resumo Rápido */}
        <div className="flex-[2] flex flex-col">
          <h2 className="text-white font-bold text-sm tracking-wide uppercase pl-2 mb-2">
            Resumo Rápido
          </h2>

          <div className="bg-[#f0ecd7] rounded-xl flex flex-col sm:flex-row p-4 shadow-inner min-h-[120px]">
            {/* Últimas Vendas */}
            <div className="flex-1 sm:border-r border-gray-300 pr-0 sm:pr-4 mb-4 sm:mb-0 flex flex-col">
              <span className="text-gray-700 text-sm mb-2">Últimas Vendas</span>
              <div className="relative flex-1 flex items-end w-full h-16 mt-auto border-l border-b border-gray-300">
                <div className="absolute -left-4 top-0 h-full flex flex-col justify-between text-[8px] text-gray-400 py-1">
                  <span>40</span><span>30</span><span>20</span><span>10</span><span>0</span>
                </div>
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,35 Q20,30 40,10 T80,25 T100,5" fill="none" stroke="#2563eb" strokeWidth="2" />
                  <path d="M0,35 Q20,30 40,10 T80,25 T100,5 L100,40 L0,40 Z" fill="#93c5fd" opacity="0.4" />
                </svg>
                <div className="absolute -bottom-4 left-0 w-full flex justify-between text-[8px] text-gray-400 px-1">
                  <span>11</span><span>20</span><span>31</span><span>31</span><span>25</span>
                </div>
              </div>
            </div>

            {/* Avisos de Estoque Baixo */}
            <div className="flex-1 sm:border-r border-gray-300 px-0 sm:px-4 mb-4 sm:mb-0 flex flex-col items-center">
              <span className="text-gray-700 text-sm">Avisos de Estoque Baixo</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-5xl font-bold text-black tracking-tighter">1</span>
              </div>
            </div>

            {/* Últimos Pedidos */}
            <div className="flex-1 pl-0 sm:pl-4 flex flex-col">
              <span className="text-gray-700 text-sm mb-3">Últimos Pedidos</span>
              <div className="flex flex-col gap-2 mt-1">
                <div className="h-1.5 w-full bg-[#d5d1c0] rounded-full"></div>
                <div className="h-1.5 w-3/4 bg-[#d5d1c0] rounded-full"></div>
                <div className="h-1.5 w-5/6 bg-[#d5d1c0] rounded-full"></div>
                <div className="h-1.5 w-2/3 bg-[#d5d1c0] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* PARTE DIREITA: Atualizações */}
        <div className="flex-1 bg-[#d5effd] rounded-xl p-4 shadow-sm flex flex-col min-h-[140px] lg:mt-7 border border-[#bce3f9]">
          <h2 className="text-black font-bold text-sm tracking-wide uppercase mb-3">
            Atualizações
          </h2>
          <p className="text-gray-600 text-sm">Atualizações</p>
        </div>
      </div>

      {/* 2. GRID DE BOTÕES DO MENU (NOVO) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-8">

        {/* PONTO DE VENDA (Link para /ponto-de-venda) */}
        <Link
          to="/ponto-de-venda"
          className="col-span-2 md:col-span-1 row-span-2 bg-[#0d74ff] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#0b66e6]"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 border-2 border-dashed border-white/40 rounded-xl flex items-center justify-center text-white/60 mb-4 md:mb-6">
            🛒
          </div>
          <h3 className="text-white font-extrabold text-2xl md:text-3xl mb-1 tracking-tight">PONTO DE<br />VENDA</h3>
          <p className="text-blue-100 text-sm font-medium mt-1">Realizar Novas Vendas</p>
        </Link>

        {/* ESTOQUE (Link para /estoque) */}
        <Link
          to="/estoque"
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-gray-100"
        >
          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 mb-3">
            📦
          </div>
          <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Estoque</h3>
          <p className="text-gray-500 text-xs lg:text-sm">Gerenciar Produtos</p>
        </Link>

        {/* COMPRAS / CATÁLOGO (Link para /gerenciar-catalogo) */}
        {/* Dica: Você pode usar o botão de Compras ou Relatórios para levar ao catálogo se preferir */}
        <Link
          to="/gerenciar-catalogo"
          className="bg-[#f0ecd7] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#e5e0c8]"
        >
          <div className="w-16 h-16 border-2 border-dashed border-[#c9b485] rounded-xl flex items-center justify-center text-[#c9b485] mb-3">
            🏷️
          </div>
          <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Catálogo</h3>
          <p className="text-gray-600 text-xs lg:text-sm">Categorias e Marcas</p>
        </Link>

        <div className="bg-[#f0ecd7] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#e5e0c8]">
          <div className="w-16 h-16 border-2 border-dashed border-[#c9b485] rounded-xl flex items-center justify-center text-[#c9b485] mb-3">
            🛠️
          </div>
          <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Serviços</h3>
          <p className="text-gray-600 text-xs lg:text-sm">Agendar Manutenções</p>
        </div>

        {/* BICICLETAS */}
        <div className="bg-[#d5effd] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#bce3f9]">
          <div className="w-16 h-16 border-2 border-dashed border-[#71bdec] rounded-xl flex items-center justify-center text-[#71bdec] mb-3">
            Ícone
          </div>
          <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Bicicletas</h3>
          <p className="text-gray-600 text-xs lg:text-sm">Inventário de Veículos</p>
        </div>

        {/* RELATÓRIOS (Ocupa 2 colunas para preencher o espaço do Estoque que foi removido) */}
        <div className="col-span-2 md:col-span-1 lg:col-span-2 bg-[#f0ecd7] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all border border-[#e5e0c8]">
          <div className="w-16 h-16 border-2 border-dashed border-[#c9b485] rounded-xl flex items-center justify-center text-[#c9b485] mb-3">
            Ícone
          </div>
          <h3 className="text-black font-bold text-lg lg:text-xl mb-1 uppercase tracking-wide">Relatórios</h3>
          <p className="text-gray-600 text-xs lg:text-sm">Análise de Desempenho</p>
        </div>

      </div>

    </div>
  );
}