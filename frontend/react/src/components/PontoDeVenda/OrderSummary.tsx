import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface OrderSummaryProps {
  ultimaDataServico?: string;
  subtotalProdutos: number;
  subtotalServicos: number;
  valorTotal: number;
  onCancelarVenda: () => void;
  // NOVAS PROPS AQUI:
  onConfirmarVenda: (dadosFinanceiros: any) => void;
  isSubmitting?: boolean;
}

export default function OrderSummary({
  ultimaDataServico, subtotalProdutos, subtotalServicos, valorTotal,
  onCancelarVenda, onConfirmarVenda, isSubmitting
}: OrderSummaryProps) {

  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [desconto, setDesconto] = useState(0);
  const taxaCartao = metodoPagamento === 'Crédito' ? 5.00 : 0;
  const totalFinal = Math.max(0, valorTotal + taxaCartao - desconto);
  const mostrarAvisoData = ultimaDataServico && dataEntrega && dataEntrega < ultimaDataServico;
  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleConfirmarClick = () => {
    if (!metodoPagamento) {
      alert("Por favor, selecione um método de pagamento.");
      return;
    }

    onConfirmarVenda({
      metodoPagamento,
      dataEntrega: dataEntrega || null,
      desconto,
      taxaCartao,
      totalFinal
    });
  };

  const handleAdicionarDesconto = () => {
    const inputStr = window.prompt("Digite o valor do desconto:");

    if (inputStr === null || inputStr.trim() === "") return;

    const valorNumerico = parseFloat(inputStr.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico < 0) {
      alert("Por favor, insira um valor numérico válido e positivo.");
      return;
    }

    if (valorNumerico > valorTotal + taxaCartao) {
      alert("O desconto não pode ser maior que o valor total do pedido!");
      return;
    }
    setDesconto(valorNumerico);
  };

  const handleRemoverDesconto = () => {
    setDesconto(0);
  };

  const handleCancelarClick = () => {
    if (window.confirm("Tem certeza que deseja cancelar e limpar toda a venda?")) {
      setMetodoPagamento('');
      setDataEntrega('');
      setDesconto(0);
      onCancelarVenda();
    }
  };

  const rowStyle = "flex items-center text-[15px]";
  const currencySymbolStyle = "w-8 text-right pr-2 text-gray-500";
  const valueStyle = "w-24 text-right font-bold tracking-wide";

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm w-full lg:w-1/2 flex flex-col gap-2.5 font-sans text-gray-800 border border-gray-200">
      <h2 className="font-bold text-[1.1rem] uppercase mb-1 border-b pb-2">Resumo do Pedido</h2>

      <div className={rowStyle}>
        <span className="flex-1 text-gray-600">Subtotal Produtos:</span>
        <span className={currencySymbolStyle}>R$</span>
        <span className={valueStyle}>{formatMoney(subtotalProdutos)}</span>
      </div>

      <div className={rowStyle}>
        <span className="flex-1 text-gray-600">Subtotal Serviços:</span>
        <span className={currencySymbolStyle}>R$</span>
        <span className={valueStyle}>{formatMoney(subtotalServicos)}</span>
      </div>

      <div className={rowStyle}>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-gray-600">Desconto:</span>

          {desconto > 0 ? (
            <button
              onClick={handleRemoverDesconto}
              title="Remover Desconto"
              className="bg-red-500 hover:bg-red-600 transition-colors text-white w-5 h-5 rounded flex items-center justify-center font-bold text-sm leading-none shadow-sm"
            >
              -
            </button>
          ) : (
            <button
              onClick={handleAdicionarDesconto}
              title="Adicionar Desconto"
              className="bg-[#2970b5] hover:bg-[#205b95] transition-colors text-white w-5 h-5 rounded flex items-center justify-center font-bold text-lg leading-none shadow-sm pb-0.5"
            >
              +
            </button>
          )}
        </div>
        <span className={currencySymbolStyle}>R$</span>
        <span className={`${valueStyle} text-red-500`}>- {formatMoney(desconto)}</span>
      </div>

      <div className="flex items-center justify-between text-[15px] mt-1">
        <span className="text-gray-600 font-medium">Método de Pagamento:</span>
        <div className="relative">
          <select
            value={metodoPagamento}
            onChange={(e) => setMetodoPagamento(e.target.value)}
            className="bg-[#143a64] hover:bg-[#0f2d4e] transition-colors text-white pl-3 pr-8 py-1.5 rounded-md text-sm outline-none appearance-none cursor-pointer shadow-sm min-w-[120px]"
          >
            <option value="">Selecione...</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
            <option value="PIX">PIX</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {metodoPagamento === 'Crédito' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col gap-2 mt-1 animate-fadeIn">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-600">Parcelas:</span>
            <select className="bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-sm outline-none focus:border-[#143a64] cursor-pointer">
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}x</option>
              ))}
            </select>
          </div>
          <div className="flex items-center text-[14px]">
            <span className="flex-1 text-gray-600">Taxas Cartão:</span>
            <span className="w-8 text-right pr-2 text-gray-500">R$</span>
            <span className="w-24 text-right font-bold text-orange-600 tracking-wide">{formatMoney(taxaCartao)}</span>
          </div>
        </div>
      )}

      <div className="border-t-2 border-dashed border-gray-200 my-2"></div>

      <div className="flex items-center font-black text-[18px] text-[#143a64]">
        <span className="flex-1 uppercase tracking-wider">Valor Total:</span>
        <span className="w-8 text-right pr-2">R$</span>
        <span className="w-24 text-right tracking-wide">{formatMoney(totalFinal)}</span>
      </div>

      <div className="flex items-center text-[15px] mt-1 relative group">
        <span className="flex-1 font-bold text-gray-700 flex items-center gap-2">
          Data de Entrega:
          {mostrarAvisoData && (
            <div className="flex items-center text-red-500 cursor-help" title={`Existe um serviço agendado para terminar após essa data! (Último serviço: ${ultimaDataServico?.split('-').reverse().join('/')})`}>
              <AlertTriangle size={18} strokeWidth={2.5} className="animate-pulse" />
            </div>
          )}
        </span>

        <input
          type="date"
          value={dataEntrega}
          onChange={(e) => setDataEntrega(e.target.value)}
          className={`border rounded-md px-2 py-1.5 text-sm outline-none cursor-pointer font-medium transition-colors ${mostrarAvisoData
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-600 bg-red-50'
            : 'border-gray-300 focus:border-[#143a64] focus:ring-1 focus:ring-[#143a64] text-gray-700 bg-white'
            }`}
        />
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleCancelarClick}
          disabled={isSubmitting}
          className="flex-1 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600 font-bold py-2.5 rounded-lg transition-all uppercase text-xs tracking-wider disabled:opacity-50"
        >
          Cancelar Venda
        </button>
        <button
          onClick={handleConfirmarClick}
          disabled={isSubmitting || (valorTotal === 0 && subtotalServicos === 0)}
          className="flex-1 bg-[#00c950] border-2 border-transparent hover:border-green-800 text-white font-black py-2.5 rounded-lg transition-all shadow-md hover:bg-green-500 uppercase text-xs tracking-wider disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : null}
          {isSubmitting ? 'Finalizando...' : 'Confirmar Venda'}
        </button>
      </div>

    </div>
  );
}