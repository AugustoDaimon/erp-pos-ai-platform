import React, { useState, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, User, Receipt, PackageSearch, ArrowLeft, Bike, Phone, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { pedidoService } from '../services/pedidoService';
import { clienteService } from '../services/clienteService';
import { produtoService } from '../services/produtoService';
import { servicoService } from '../services/servicoService';
import type { Pedido } from '../services/types/Pedido';
import type { Cliente } from '../services/types/Cliente';

export default function ControleCliente() {
  // Estados para Clientes (Coluna 1)
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);

  // Estados para Pedidos (Coluna 2)
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [buscaPedido, setBuscaPedido] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(false);

  // Estados para Detalhes (Coluna 3)
  const [nomesItens, setNomesItens] = useState<Record<number, string>>({});
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);

  // 1. Carregar Todos os Clientes na Montagem da Tela
  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoadingClientes(true);
      try {
        const data = await clienteService.listar();
        setClientes(data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setIsLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  // 2. Carregar Histórico de Pedidos quando um Cliente é selecionado
  useEffect(() => {
    const fetchPedidosCliente = async () => {
      if (!clienteSelecionado) {
        setPedidos([]);
        setPedidoSelecionado(null);
        return;
      }
      
      setIsLoadingPedidos(true);
      setPedidoSelecionado(null); // Reseta o pedido ao trocar de cliente
      
      try {
        // Busca todos os pedidos (Se a sua API suportar filtro por cliente, passe aqui: { cliente_id: clienteSelecionado.id })
        // Neste exemplo, buscamos todos e filtramos no frontend por segurança
        const todosPedidos = await pedidoService.listar();
        const historicoCliente = todosPedidos.filter(p => p.cliente_id === clienteSelecionado.id);
        
        // Ordena do mais recente para o mais antigo
        historicoCliente.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
        setPedidos(historicoCliente);
        
      } catch (error) {
        console.error("Erro ao carregar pedidos do cliente:", error);
      } finally {
        setIsLoadingPedidos(false);
      }
    };

    fetchPedidosCliente();
  }, [clienteSelecionado]);

  // 3. Buscar nomes reais dos itens quando um Pedido é selecionado
  useEffect(() => {
    const fetchDetalhesItens = async () => {
      if (!pedidoSelecionado) return;
      
      setIsLoadingDetalhes(true);
      try {
        const novosNomes: Record<number, string> = { ...nomesItens };
        
        for (const item of pedidoSelecionado.itens) {
          if (!item.descricao_item && !novosNomes[item.item_id]) {
            try {
              const produto = await produtoService.buscarPorId(item.item_id);
              novosNomes[item.item_id] = produto.descricao;
            } catch {
              try {
                const servico = await servicoService.buscarPorId(item.item_id);
                novosNomes[item.item_id] = servico.descricao;
              } catch {
                novosNomes[item.item_id] = `Item Catalogo #${item.item_id}`; 
              }
            }
          }
        }
        setNomesItens(novosNomes);
      } finally {
        setIsLoadingDetalhes(false);
      }
    };

    fetchDetalhesItens();
  }, [pedidoSelecionado]);


  // Filtros Locais
  const clientesFiltrados = clientes.filter(c => {
    if (!buscaCliente) return true;
    const termo = buscaCliente.toLowerCase();
    return c.nome.toLowerCase().includes(termo) || (c.celular && c.celular.includes(termo));
  });

  const pedidosFiltrados = pedidos.filter(p => {
    if (!buscaPedido) return true;
    return p.id.toString().includes(buscaPedido);
  });

  // Funções de Formatação
  const formatMoney = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  const traduzirStatus = (status: string) => {
    const mapa: Record<string, string> = { 'pendente': 'Pendente', 'concluido': 'Concluído', 'cancelado': 'Cancelado' };
    return mapa[status] || status.toUpperCase();
  };
  const getStatusColor = (status: string) => {
    if (status === 'concluido') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'cancelado') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen w-full bg-[#f4f6f9] p-4 lg:p-8 gap-4 lg:gap-6 font-sans relative overflow-hidden">
      
      <Link to="/" className="absolute top-3 right-4 text-[10px] font-bold text-gray-400 hover:text-[#143a64] uppercase tracking-wider transition-colors flex items-center gap-1 z-50">
        <ArrowLeft size={12} />
        Voltar ao Menu
      </Link>

      {/* ==========================================
          COLUNA 1: LISTA DE CLIENTES (25%)
          ========================================== */}
      <div className="flex flex-col w-full lg:w-[25%] bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="font-black text-base text-[#143a64] uppercase tracking-wide flex items-center gap-2 mb-3">
            <Users className="text-blue-500" size={20} />
            Buscar Cliente
          </h2>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-[#143a64] transition-colors">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Nome ou Celular..."
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              className="w-full text-xs font-medium text-gray-700 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5 bg-gray-50/30">
          {isLoadingClientes ? (
            <div className="flex justify-center items-center h-32 text-blue-500"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => {
              const isSelected = clienteSelecionado?.id === cliente.id;
              return (
                <div 
                  key={cliente.id}
                  onClick={() => setClienteSelecionado(cliente)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1 group
                    ${isSelected ? 'border-[#143a64] bg-[#143a64] text-white shadow-md' : 'border-transparent bg-white hover:border-blue-200 hover:shadow-sm text-gray-800'}`}
                >
                  <span className={`font-black text-sm uppercase truncate ${isSelected ? 'text-white' : 'text-[#143a64]'}`}>
                    {cliente.nome}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                      <Phone size={10} /> {cliente.celular || 'Sem celular'}
                    </span>
                    <span className={`text-[9px] font-bold uppercase opacity-60 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                      ID #{cliente.id}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-xs font-medium text-center px-4">
              <User size={24} className="mb-2 opacity-50" /> Nenhum cliente encontrado.
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          COLUNA 2: HISTÓRICO DE PEDIDOS (30%)
          ========================================== */}
      <div className="flex flex-col w-full lg:w-[30%] bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden shrink-0 relative">
        {!clienteSelecionado ? (
          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
             <Receipt size={48} className="mb-3 opacity-30" />
             <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Selecione um Cliente</span>
             <span className="text-xs mt-1">Para visualizar o histórico de pedidos dele.</span>
          </div>
        ) : null}

        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="font-black text-base text-[#143a64] uppercase tracking-wide flex items-center gap-2 mb-3">
            <Receipt className="text-blue-500" size={20} />
            Histórico de Compras
          </h2>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-[#143a64] transition-colors">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Nº do Pedido..."
              value={buscaPedido}
              onChange={(e) => setBuscaPedido(e.target.value)}
              className="w-full text-xs font-medium text-gray-700 outline-none bg-transparent"
              disabled={!clienteSelecionado}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5 bg-gray-50/30">
          {isLoadingPedidos ? (
            <div className="flex justify-center items-center h-32 text-blue-500"><div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => {
              const isSelected = pedidoSelecionado?.id === pedido.id;
              return (
                <div 
                  key={pedido.id}
                  onClick={() => setPedidoSelecionado(pedido)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                    ${isSelected ? 'border-[#143a64] bg-[#143a64] text-white shadow-md' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm text-gray-800'}`}
                >
                  <div className="flex flex-col gap-1">
                    <span className={`font-black text-base leading-none ${isSelected ? 'text-white' : 'text-[#143a64]'}`}>
                      #{pedido.id.toString().padStart(4, '0')}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                      <CalendarIcon size={10} /> {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`mt-0.5 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase w-fit border ${isSelected ? 'bg-white/20 text-white border-white/30' : getStatusColor(pedido.status_pedido)}`}>
                      {traduzirStatus(pedido.status_pedido)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>Total</div>
                    <div className="font-black text-lg leading-none">
                      <span className={`text-xs mr-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>R$</span>
                      {formatMoney(pedido.valor_total)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : clienteSelecionado && !isLoadingPedidos ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-xs font-medium text-center px-4">
              <PackageSearch size={24} className="mb-2 opacity-50" /> Este cliente não possui pedidos.
            </div>
          ) : null}
        </div>
      </div>

      {/* ==========================================
          COLUNA 3: DETALHES DO PEDIDO (45%)
          ========================================== */}
      <div className="flex flex-col w-full lg:w-[45%] h-full gap-4 relative">
        
        {isLoadingDetalhes && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <div className="w-8 h-8 border-4 border-[#143a64] border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}

        {!pedidoSelecionado ? (
          <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
            <PackageSearch size={64} className="mb-4 text-gray-300" strokeWidth={1} />
            <h3 className="text-lg font-bold text-gray-500">Nenhum Pedido Selecionado</h3>
            <p className="text-sm mt-1">Selecione um pedido na coluna ao lado para visualizar os itens e o comprovante.</p>
          </div>
        ) : (
          <>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center shrink-0">
              <div>
                <h2 className="font-black text-lg text-[#143a64] uppercase tracking-wide">
                  Pedido #{pedidoSelecionado.id.toString().padStart(4, '0')}
                </h2>
                <span className="text-xs text-gray-500 font-medium mt-0.5 block">
                  Registrado em: {formatDate(pedidoSelecionado.criado_em)}
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border font-black uppercase text-xs tracking-wider ${getStatusColor(pedidoSelecionado.status_pedido)}`}>
                {traduzirStatus(pedidoSelecionado.status_pedido)}
              </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
              <div className="flex w-full px-4 py-2 border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0 gap-4">
                <div className="flex-1">Produto / Serviço</div>
                <div className="w-12 text-center">Qtd.</div>
                <div className="w-20 text-right">Unit.</div>
                <div className="w-24 text-right pr-2">Total</div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-2">
                {pedidoSelecionado.itens?.map((item) => {
                  const nomeItem = nomesItens[item.item_id] || item.descricao_item || `Item #${item.item_id}`;
                  return (
                    <div key={item.id} className="flex items-center w-full px-2 py-3 border-b border-gray-100 shrink-0 gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0 font-bold text-xs text-gray-800 uppercase truncate" title={nomeItem}>
                        {nomeItem}
                      </div>
                      <div className="w-12 text-center font-black text-gray-700 text-xs">
                        {item.quantidade}
                      </div>
                      <div className="w-20 text-right text-xs font-medium text-gray-600">
                        R$ {formatMoney(item.valor_unitario)}
                      </div>
                      <div className="w-24 text-right pr-2 text-xs font-black text-[#143a64]">
                        R$ {formatMoney(item.valor_total)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-4 shrink-0 h-auto">
              {/* DADOS DA BIKE (Opcional se quiser manter um card aqui) */}
              <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col justify-center">
                 <h3 className="font-bold text-xs uppercase border-b pb-1.5 mb-3 text-gray-800">Veículo Vinculado</h3>
                 {clienteSelecionado?.bike_info ? (
                    <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Bike className="text-gray-400 shrink-0" size={18} />
                      <div className="font-medium text-xs text-gray-700 line-clamp-2" title={clienteSelecionado.bike_info}>
                        {clienteSelecionado.bike_info}
                      </div>
                    </div>
                 ) : (
                    <span className="text-xs text-gray-400 italic">Nenhuma bicicleta registrada no momento da venda.</span>
                 )}
              </div>

              {/* RESUMO DO PEDIDO */}
              <div className="w-full xl:w-[50%] bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col gap-2 text-sm">
                <h3 className="font-bold text-xs uppercase border-b pb-1.5 mb-1 text-gray-800">Resumo Financeiro</h3>
                
                <div className="flex items-center text-xs">
                  <span className="flex-1 text-gray-600">Subtotal:</span>
                  <span className="font-bold">R$ {formatMoney(pedidoSelecionado.subtotal)}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="flex-1 text-gray-600">Taxas:</span>
                  <span className="font-bold text-orange-500">R$ {formatMoney(pedidoSelecionado.taxas_cartao)}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="flex-1 text-gray-600">Desconto:</span>
                  <span className="font-bold text-red-500">- R$ {formatMoney(pedidoSelecionado.desconto)}</span>
                </div>
                <div className="flex items-center text-xs mt-0.5">
                  <span className="flex-1 text-gray-600">Pagamento:</span>
                  <span className="font-bold text-[#143a64] uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 text-[10px]">
                    {pedidoSelecionado.metodo_pagamento || 'N/A'}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 my-1"></div>

                <div className="flex items-center font-black text-base text-[#143a64]">
                  <span className="flex-1 uppercase tracking-wider text-sm">Total Final:</span>
                  <span>R$ {formatMoney(pedidoSelecionado.valor_total)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}