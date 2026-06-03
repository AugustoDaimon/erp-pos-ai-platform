import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import ProductCard from './ProductCard';
import { produtoService } from '../../services/produtoService';
import type { Produto } from '../../services/types/Produto';

// IMPORT DO MODAL DE SERVIÇO
import { ModalAdicionarServico } from './ModalAdicionarServico';

interface CatalogoPesquisaProps {
  onAddToCart: (produto: Produto, isInstalled: boolean) => void;
  onAddService: (servico: any, data: string, horario: string) => void;
}

export default function PesquisaProduto({ onAddToCart, onAddService }: CatalogoPesquisaProps) {
  const [query, setQuery] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // NOVO: Estado para controlar a abertura do modal de serviço
  const [isModalServicoOpen, setIsModalServicoOpen] = useState(false);

  // 1. Carrega o catálogo do banco ao abrir a tela
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const data = await produtoService.listar();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  // 2. Inteligência da Busca (Fuse.js)
  const fuse = useMemo(() => {
    return new Fuse(produtos, {
      keys: ['descricao', 'sku', 'especificacao_1'],
      threshold: 0.3,
      ignoreLocation: true
    });
  }, [produtos]);

  // 3. Resultados em tempo real
  const resultados = useMemo(() => {
    if (!query) return produtos; // Se a barra estiver vazia, mostra todos os produtos!
    return fuse.search(query).map(result => result.item);
  }, [query, fuse, produtos]);

  // NOVO: Função que será chamada quando o usuário confirmar o agendamento no modal
  const handleAdicionarServico = (servico: any, data: string, horario: string) => {
    console.log("Serviço Agendado:", servico, "Data:", data, "Horário:", horario);
    // Aqui no futuro você pode enviar esse serviço para o carrinho/resumo do pedido!
    alert(`Serviço "${servico.descricao}" adicionado para ${data} às ${horario}!`);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">

      {/* DIV 1: Search Bar & Links */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isLoading ? "Carregando estoque..." : "Pesquisar produto ou código..."}
            disabled={isLoading}
            className="w-full border-[2px] border-black rounded-sm h-12 px-4 text-lg outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-200"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="flex justify-between items-center text-[#6b7280] text-sm font-medium px-1">
          <div className="flex items-center gap-2">
            <button className="hover:text-black transition-colors">Busca Avançada</button>
            <span className="text-gray-400 font-light">|</span>
            {/* ATUALIZADO: Evento onClick chama o modal */}
            <button
              onClick={() => setIsModalServicoOpen(true)}
              className="hover:text-black transition-colors"
            >
              Adicionar Serviço
            </button>
          </div>
          <span className="text-gray-500">
            {resultados.length} {resultados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </span>
        </div>
      </div>

      {/* DIV 2: Scrollable Product Container (A Lista de Cards) */}
      <div className="h-[40vh] lg:h-auto lg:flex-1 overflow-y-auto pr-2 lg:pr-4 custom-scrollbar flex flex-col gap-3 pb-4">
        {resultados.length > 0 ? (
          resultados.map((produto) => (
            <ProductCard
              key={produto.id}
              name={produto.descricao}
              price={produto.valor_venda}
              valor_instalacao={produto.valor_instalacao || 0}
              imageUrl={produto.imagem_url || undefined}
              onAddToCart={(isInstalled) => onAddToCart(produto, isInstalled)}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 opacity-60 mt-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p className="mt-4 font-bold text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {/* NOVO: Instância do Modal de Serviços */}
      <ModalAdicionarServico
        isOpen={isModalServicoOpen}
        onClose={() => setIsModalServicoOpen(false)}
        onAdicionar={onAddService} // AQUI: Removemos o alerta falso e conectamos com a prop
      />

    </div>
  );
}