import React, { useState } from 'react';
import '../index.css';
import PesquisaProduto from '../components/PontoDeVenda/PesquisaProduto';
import CartTable, { type CartItem } from '../components/PontoDeVenda/CartTable'; // Importamos a interface do carrinho
import CustomerData from '../components/PontoDeVenda/CustomerData';
import OrderSummary from '../components/PontoDeVenda/OrderSummary';
import type { Produto } from '../services/types/Produto';

export default function PointOfSale() {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [bikeInfoPedido, setBikeInfoPedido] = useState('');

  // 1. Função para adicionar item (Vem do Card)
  const handleProdutoSelecionado = (produto: Produto, isInstalled: boolean) => {
    // Cria um ID único para saber se tem instalação ou não
    const uniqueId = `${produto.id}-${isInstalled}`;

    // Calcula o preço final (se tiver instalação, soma)
    const finalPrice = isInstalled
      ? produto.valor_venda + (produto.valor_instalacao || 0)
      : produto.valor_venda;

    setCartItems(prevItems => {
      // Verifica se ESSE item com ESSA condição (instalado ou não) já está no carrinho
      const existingItem = prevItems.find(item => item.id === uniqueId);

      if (existingItem) {
        // Se já existe, só aumenta a quantidade
        return prevItems.map(item =>
          item.id === uniqueId ? { ...item, qty: item.qty + 1 } : item
        );
      }

      // Se não existe, cria uma nova linha na tabela
      return [...prevItems, {
        id: uniqueId,
        productId: produto.id,
        // Adiciona a tag (C/ Instalação) no nome visualmente para o vendedor não se perder
        name: produto.descricao + (isInstalled ? ' (C/ Instalação)' : ''),
        qty: 1,
        unitPrice: finalPrice
      }];
    });
  };

  // 2. Função para Aumentar Qtd no Carrinho
  const handleIncreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  // 3. Função para Diminuir Qtd ou Remover do Carrinho
  const handleDecreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    }).filter(item => item.qty > 0)); // O filter apaga a linha se a qty chegar a zero!
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#f4f6f9] p-10 gap-6 lg:gap-8 font-sans relative">

      <button className="absolute top-3 right-4 text-[10px] font-bold text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors">
        Sair
      </button>

      {/* LEFT COLUMN */}
      <div className="flex flex-col w-full lg:w-1/2 gap-4 lg:h-full">
        <PesquisaProduto onAddToCart={handleProdutoSelecionado} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6 lg:h-full pb-6 lg:pb-0">

        {/* DIV 3: The Table */}
        <div className="h-[40vh] lg:h-[45vh] border-[2px] border-black bg-white flex flex-col overflow-hidden shrink-0">
          <CartTable
            items={cartItems}
            onIncrease={handleIncreaseQty}
            onDecrease={handleDecreaseQty}
          />
        </div>

        {/* DIV 4: Bottom Right Blue Area */}
        <div className="flex flex-col lg:flex-row gap-4 w-full shrink-0">
          <CustomerData
            onClienteChange={setClienteSelecionado}
            onBikeChange={setBikeInfoPedido}
          />
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}