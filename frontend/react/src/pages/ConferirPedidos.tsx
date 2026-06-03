import React, { useState, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, User, Receipt, PackageSearch, ArrowLeft, Bike, Phone } from 'lucide-react';
import { pedidoService } from '../services/pedidoService';
import { clienteService } from '../services/clienteService';
import { produtoService } from '../services/produtoService';
import { servicoService } from '../services/servicoService'; // <-- IMPORTANTE: Import do Serviço
import type { Pedido } from '../services/types/Pedido';
import type { Cliente } from '../services/types/Cliente';

export default function ConferirPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataFiltro, setDataFiltro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [buscaPesquisa, setBuscaPesquisa] = useState('');

  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  
  // ESTADOS AUXILIARES: Para armazenar os dados detalhados que vêm das outras APIs
  const [clienteDetalhado, setClienteDetalhado] = useState<Cliente | null>(null);
  const [nomesItens, setNomesItens] = useState<Record<number, string>>({});
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);

  // 1. Carregar Pedidos
  useEffect(() => {
    const fetchPedidos = async () => {
      setIsLoading(true);
      try {
        const data = await pedidoService.listar({ data_inicio: dataFiltro, data_fim: dataFiltro });
        setPedidos(data);
        setPedidoSelecionado(null); // Reseta a seleção ao mudar de data para não ficar preso
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [dataFiltro]);

  // 2. Buscar detalhes (Cliente e Nomes dos Itens) sempre que um pedido for selecionado
  useEffect(() => {
    const fetchDetalhes = async () => {
      if (!pedidoSelecionado) return;
      
      setIsLoadingDetalhes(true);
      setClienteDetalhado(null);
      
      try {
        // A. Buscar Dados Completos do Cliente
        if (pedidoSelecionado.cliente_id) {
          try {
            const cliente = await clienteService.buscarPorId(pedidoSelecionado.cliente_id);
            setClienteDetalhado(cliente);
          } catch (err) {
            console.error("Erro ao buscar cliente do pedido:", err);
          }
        }

        // B. Buscar Nomes Reais dos Itens (Produtos e Serviços)
        const novosNomes: Record<number, string> = { ...nomesItens };
        
        for (const item of pedidoSelecionado.itens) {
          if (!item.descricao_item && !novosNomes[item.item_id]) {
            try {
              // Tenta primeiro buscar na rota de Produtos
              const produto = await produtoService.buscarPorId(item.item_id);
              novosNomes[item.item_id] = produto.descricao;
            } catch (errProduto) {
              // Se deu erro (ex: 404), significa que provavelmente não é um Produto. 
              // Tenta buscar na rota de Serviços!
              try {
                const servico = await servicoService.buscarPorId(item.item_id);
                novosNomes[item.item_id] = servico.descricao;
              } catch (errServico) {
                // Se não achou em nenhum dos dois, usa o ID genérico.
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

    fetchDetalhes();
  }, [pedidoSelecionado]);


  // Funções de Filtro e Formatação
  const pedidosFiltrados = pedidos.filter(p => {
    if (!buscaPesquisa) return true;
    return p.id.toString().includes(buscaPesquisa);
  });

  const formatMoney = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const traduzirStatus = (status: string) => {
    const mapa: Record<string, string> = {
      'pendente': 'Pendente',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return mapa[status] || status.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    if (status === 'concluido') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'cancelado') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen w-full bg-[#f4f6f9] p-6 lg:p-10 gap-6 lg:gap-8 font-sans relative overflow-hidden">
      
      {/* Botão de Saída Simples */}
      <button className="absolute top-3 right-4 text-[10px] font-bold text-gray-400 hover:text-[#143a64] uppercase tracking-wider transition-colors flex items-center gap-1">
        <ArrowLeft size={12} />
        Voltar ao PDV
      </button>

      {/* ==========================================
          COLUNA ESQUERDA: LISTA DE PEDIDOS
          ========================================== */}
      <div className="flex flex-col w-full lg:w-[35%] bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden shrink-0">
        
        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <h2 className="font-black text-lg text-[#143a64] uppercase tracking-wide flex items-center gap-2 mb-4">
            <Receipt className="text-blue-500" size={22} />
            Conferir Pedidos
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-[#143a64] transition-colors">
              <CalendarIcon size={18} className="text-gray-400 mr-2" />
              <input 
                type="date" 
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                className="w-full text-sm font-medium text-gray-700 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-[#143a64] transition-colors">
              <Search size={18} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar por Número do Pedido..."
                value={buscaPesquisa}
                onChange={(e) => setBuscaPesquisa(e.target.value)}
                className="w-full text-sm font-medium text-gray-700 outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-gray-50/30">
          {isLoading ? (
            <div className="flex justify-center items-center h-32 text-blue-500">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => {
              const isSelected = pedidoSelecionado?.id === pedido.id;
              return (
                <div 
                  key={pedido.id}
                  onClick={() => setPedidoSelecionado(pedido)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                    ${isSelected 
                      ? 'border-[#143a64] bg-[#143a64] text-white shadow-md' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm text-gray-800'
                    }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className={`font-black text-lg leading-none ${isSelected ? 'text-white' : 'text-[#143a64]'}`}>
                      #{pedido.id.toString().padStart(4, '0')}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                      <CalendarIcon size={10} />
                      {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`mt-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase w-fit border ${isSelected ? 'bg-white/20 text-white border-white/30' : getStatusColor(pedido.status_pedido)}`}>
                      {traduzirStatus(pedido.status_pedido)}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className={`text-[11px] font-bold uppercase tracking-widest mb-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>Total</div>
                    <div className="font-black text-xl leading-none">
                      <span className={`text-sm mr-1 ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>R$</span>
                      {formatMoney(pedido.valor_total)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm font-medium text-center px-4">
              <PackageSearch size={40} className="mb-3 opacity-50" />
              Nenhum pedido encontrado para esta data ou filtro.
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          COLUNA DIREITA: DETALHES DO PEDIDO
          ========================================== */}
      <div className="flex flex-col w-full lg:w-[65%] h-full gap-6 relative">
        
        {/* Loading Overlay Suave */}
        {isLoadingDetalhes && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <div className="w-8 h-8 border-4 border-[#143a64] border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}

        {!pedidoSelecionado ? (
          <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <Receipt size={64} className="mb-4 text-gray-300" strokeWidth={1} />
            <h3 className="text-lg font-bold text-gray-500">Nenhum Pedido Selecionado</h3>
            <p className="text-sm">Selecione um pedido na lista ao lado para visualizar os detalhes.</p>
          </div>
        ) : (
          <>
            {/* HEADER DETALHES */}
            <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center shrink-0">
              <div>
                <h2 className="font-black text-xl text-[#143a64] uppercase tracking-wide">
                  Pedido #{pedidoSelecionado.id.toString().padStart(4, '0')}
                </h2>
                <span className="text-sm text-gray-500 font-medium mt-1 block">
                  Registrado em: {formatDate(pedidoSelecionado.criado_em)}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-lg border font-black uppercase text-sm tracking-wider ${getStatusColor(pedidoSelecionado.status_pedido)}`}>
                {traduzirStatus(pedidoSelecionado.status_pedido)}
              </div>
            </div>

            {/* CARRINHO (READ-ONLY) */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
              <div className="flex w-full px-5 py-3 border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 gap-8">
                <div className="flex-1">Produto / Serviço</div>
                <div className="w-20 text-center">Qtd.</div>
                <div className="w-28 text-right pr-2">Valor Unit.</div>
                <div className="w-32 text-right pr-2">Total</div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-2">
                {pedidoSelecionado.itens?.map((item) => {
                  const nomeItem = nomesItens[item.item_id] || item.descricao_item || `Item #${item.item_id}`;

                  return (
                    <div key={item.id} className="flex items-center w-full px-3 py-3 border-b border-gray-100 shrink-0 gap-8 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0 font-medium text-sm text-gray-800 uppercase truncate" title={nomeItem}>
                        {nomeItem}
                      </div>
                      <div className="w-20 text-center font-bold text-gray-700 text-sm">
                        {item.quantidade}
                      </div>
                      <div className="w-28 text-right pr-2 text-sm font-medium text-gray-700">
                        R$ {formatMoney(item.valor_unitario)}
                      </div>
                      <div className="w-32 text-right pr-2 text-sm font-black text-black">
                        R$ {formatMoney(item.valor_total)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DADOS DO CLIENTE & RESUMO */}
            <div className="flex flex-col lg:flex-row gap-6 shrink-0 h-auto">
              
              {/* CARD DADOS DO CLIENTE */}
              <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col gap-4">
                <h3 className="font-bold text-[1.1rem] uppercase border-b pb-2 text-gray-800">Dados do Cliente</h3>
                
                {pedidoSelecionado.cliente_id ? (
                  <div className="flex flex-col gap-3 mt-1">
                    {isLoadingDetalhes && !clienteDetalhado ? (
                       <div className="animate-pulse flex space-x-4">
                         <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                         <div className="flex-1 space-y-3 py-1">
                           <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                           <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                         </div>
                       </div>
                    ) : clienteDetalhado ? (
                      <>
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <User className="text-[#143a64] shrink-0" size={20} />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cliente ID #{clienteDetalhado.id}</div>
                            <div className="font-black text-gray-800 text-sm uppercase truncate">{clienteDetalhado.nome}</div>
                          </div>
                        </div>

                        {clienteDetalhado.celular && (
                          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <Phone className="text-green-600 shrink-0" size={18} />
                            <div className="font-medium text-sm text-gray-700">{clienteDetalhado.celular}</div>
                          </div>
                        )}

                        {clienteDetalhado.bike_info && (
                          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <Bike className="text-gray-400 shrink-0" size={20} />
                            <div className="font-medium text-sm text-gray-700 truncate" title={clienteDetalhado.bike_info}>
                              {clienteDetalhado.bike_info}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-red-500 font-medium">Erro ao carregar dados do cliente #{pedidoSelecionado.cliente_id}</div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-4">
                    <User size={32} className="mb-2 opacity-30" />
                    <span className="font-medium text-sm uppercase tracking-wider">Venda Avulsa (Sem Cliente)</span>
                  </div>
                )}
              </div>

              {/* CARD RESUMO DO PEDIDO */}
              <div className="w-full lg:w-[45%] bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col gap-2.5 text-[15px]">
                <h3 className="font-bold text-[1.1rem] uppercase border-b pb-2 mb-1 text-gray-800">Resumo</h3>
                
                <div className="flex items-center">
                  <span className="flex-1 text-gray-600">Subtotal:</span>
                  <span className="w-8 text-right pr-2 text-gray-500">R$</span>
                  <span className="w-24 text-right font-bold">{formatMoney(pedidoSelecionado.subtotal)}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="flex-1 text-gray-600">Taxas:</span>
                  <span className="w-8 text-right pr-2 text-gray-500">R$</span>
                  <span className="w-24 text-right font-bold text-orange-500">{formatMoney(pedidoSelecionado.taxas_cartao)}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="flex-1 text-gray-600">Desconto:</span>
                  <span className="w-8 text-right pr-2 text-gray-500">R$</span>
                  <span className="w-24 text-right font-bold text-red-500">- {formatMoney(pedidoSelecionado.desconto)}</span>
                </div>

                <div className="flex items-center mt-1">
                  <span className="flex-1 text-gray-600">Pagamento:</span>
                  <span className="font-bold text-[#143a64] uppercase text-sm tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {pedidoSelecionado.metodo_pagamento || 'N/A'}
                  </span>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 my-2"></div>

                <div className="flex items-center font-black text-[18px] text-[#143a64]">
                  <span className="flex-1 uppercase tracking-wider">Total Final:</span>
                  <span className="w-8 text-right pr-2">R$</span>
                  <span className="w-24 text-right tracking-wide">{formatMoney(pedidoSelecionado.valor_total)}</span>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

    </div>
  );
}