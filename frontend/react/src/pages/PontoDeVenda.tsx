import React, { useState } from 'react';
import '../index.css';
import PesquisaProduto from '../components/PontoDeVenda/PesquisaProduto';
import CartTable, { type CartItem } from '../components/PontoDeVenda/CartTable';
import CustomerData from '../components/PontoDeVenda/CustomerData';
import OrderSummary from '../components/PontoDeVenda/OrderSummary';
import type { Produto } from '../services/types/Produto';
import { pedidoService } from '../services/pedidoService';
import { ordemServicoService } from '../services/ordemServicoService';

export default function PontoDeVenda() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [bikeInfoPedido, setBikeInfoPedido] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProdutoSelecionado = (produto: Produto, isInstalled: boolean) => {
    const uniqueId = `produto-${produto.id}-${isInstalled}`;
    const finalPrice = isInstalled
      ? produto.valor_venda + (produto.valor_instalacao || 0)
      : produto.valor_venda;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === uniqueId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === uniqueId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, {
        id: uniqueId,
        productId: produto.id,
        name: produto.descricao + (isInstalled ? ' (C/ Instalação)' : ''),
        qty: 1,
        unitPrice: finalPrice
      }];
    });
  };

  const handleServicoAdicionado = (servico: any, data: string, horario: string) => {
    const uniqueId = `servico-${servico.id}-${data}-${horario}`;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === uniqueId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === uniqueId ? { ...item, qty: item.qty + 1 } : item
        );
      }

      const precoServico = servico.preco || servico.valor_venda || 0;

      return [...prevItems, {
        id: uniqueId,
        serviceId: servico.id,
        name: `${servico.descricao}`,
        qty: 1,
        unitPrice: precoServico,
        agendamento: { data, horario }
      }];
    });
  };

  const handleIncreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const handleDecreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) return { ...item, qty: item.qty - 1 };
      return item;
    }).filter(item => item.qty > 0));
  };

  const calcularUltimaData = () => {
    let ultima = "";
    cartItems.forEach(item => {
      if (item.agendamento && item.agendamento.data) {
        if (item.agendamento.data > ultima) {
          ultima = item.agendamento.data;
        }
      }
    });
    return ultima || undefined;
  };

  const handleCancelarVenda = () => {
    setCartItems([]);
    setClienteSelecionado(null);
    setBikeInfoPedido('');
    setResetKey(prev => prev + 1);
  };

  const ultimaDataServico = calcularUltimaData();
  const subtotalProdutos = cartItems
    .filter(item => item.productId)
    .reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);

  const subtotalServicos = cartItems
    .filter(item => item.serviceId)
    .reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);

  const valorTotal = subtotalProdutos + subtotalServicos;

  const handleConfirmarVenda = async (dadosFinanceiros: any) => {
    if (cartItems.length === 0) {
      alert("O carrinho está vazio.");
      return;
    }

    try {
      setIsSubmitting(true);

      const itensEnvio = cartItems.map(item => ({
        item_id: item.productId || item.serviceId || 0,
        quantidade: item.qty,
        valor_unitario: item.unitPrice
      }));

      const payloadPedido = {
        cliente_id: clienteSelecionado?.id || null,
        taxas_cartao: dadosFinanceiros.taxaCartao,
        desconto: dadosFinanceiros.desconto,
        valor_pago: dadosFinanceiros.totalFinal, // Pagamento total à vista no caixa
        metodo_pagamento: dadosFinanceiros.metodoPagamento,
        data_prevista_retirada: dadosFinanceiros.dataEntrega || null,
        itens: itensEnvio
      };

      const pedidoCriado = await pedidoService.criar(payloadPedido);
      const servicosNoCarrinho = cartItems.filter(item => item.serviceId && item.agendamento);

      for (const servico of servicosNoCarrinho) {
        if (servico.agendamento) {
          const dataInicioString = `${servico.agendamento.data}T${servico.agendamento.horario}:00`;
          const dataInicio = new Date(dataInicioString);
          const dataTermino = new Date(dataInicio.getTime() + (60 * 60000));

          await ordemServicoService.criar({
            pedido_id: pedidoCriado.id,
            servico_id: servico.serviceId as number,
            data_inicio_previsto: dataInicio.toISOString(),
            data_termino_previsto: dataTermino.toISOString(),
            status: "na_fila"
          });
        }
      }

      alert(`Venda finalizada com sucesso! Pedido #${pedidoCriado.id} gerado.`);
      handleCancelarVenda();

    } catch (error: any) {
      console.error("Erro ao finalizar venda:", error);
      const msgErro = error.response?.data?.erro_estoque
        || error.response?.data?.erro_de_negocio
        || "Erro interno ao processar venda.";
      alert(`Falha na Venda: ${msgErro}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#f4f6f9] p-10 gap-6 lg:gap-8 font-sans relative">
      <button onClick={handleCancelarVenda} className="absolute top-3 right-4 text-[10px] font-bold text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors">
        Sair
      </button>

      <div className="flex flex-col w-full lg:w-1/2 gap-4 lg:h-full">
        <PesquisaProduto
          onAddToCart={handleProdutoSelecionado}
          onAddService={handleServicoAdicionado}
        />
      </div>

      <div className="flex flex-col w-full lg:w-1/2 gap-6 lg:h-full pb-6 lg:pb-0">
        <div className="h-[40vh] lg:h-[45vh] border-[2px] border-black bg-white flex flex-col overflow-hidden shrink-0">
          <CartTable items={cartItems} onIncrease={handleIncreaseQty} onDecrease={handleDecreaseQty} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full shrink-0">
          <CustomerData key={resetKey} onClienteChange={setClienteSelecionado} onBikeChange={setBikeInfoPedido} />

          <OrderSummary
            ultimaDataServico={ultimaDataServico}
            subtotalProdutos={subtotalProdutos}
            subtotalServicos={subtotalServicos}
            valorTotal={valorTotal}
            onCancelarVenda={handleCancelarVenda}
            onConfirmarVenda={handleConfirmarVenda} // <-- Conectado com o back!
            isSubmitting={isSubmitting} // <-- Impede duplo clique
          />
        </div>
      </div>
    </div>
  );
}