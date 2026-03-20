import React from 'react';
import AutocompleteInput from '../components/AutoCompleteInput';

export default function CadastroProduto() {
  // Estilo padronizado atualizado
  const inputStyle =
    'bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm';

  const categoriasDB = ['Bicicletas', 'Peças', 'Acessórios', 'Ferramentas', 'Vestuário'];
  const subCategoriasDB = ['Mountain Bike', 'Speed', 'Pneus', 'Capacetes', 'Freios', 'Transmissão'];
  const marcasDB = ['Shimano', 'SRAM', 'Oggi', 'Sense', 'Maxxis', 'Pirelli', 'Absolute', 'Caloi'];

  // Tabela com tamanhos ajustados
  const renderTableRows = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex gap-2 w-full">
        <input placeholder="Fornecedor" className={`${inputStyle} w-full min-w-[120px]`} />
        <input placeholder="Qtd" className={`${inputStyle} w-16 text-center px-1`} />
        <input placeholder="R$ (Unit)" className={`${inputStyle} w-24 text-center px-1`} />
        <input placeholder="Data" className={`${inputStyle} w-28 text-center px-1`} />
      </div>
    ));
  };

  return (
    // min-h-screen e flex flex-col garantem que a página ocupe 100% da altura da janela
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      {/* Cabeçalho: Botões de Navegação e Ação */}
      <div className="flex justify-between items-center mb-4 w-[95%] max-w-[1800px] shrink-0">
        <div className="flex gap-2">
          <button className="bg-[#0d6efd] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-600 transition">
            PRODUTO
          </button>
          <button className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition">
            BICICLETA
          </button>
          <button className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition relative">
            SERVIÇO
          </button>
        </div>

        <div className="flex gap-4">
          <button className="bg-[#00c950] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-green-500 transition">
            CADASTRAR
          </button>
          <button className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition">
            PESQUISAR
          </button>
        </div>
      </div>

      {/* Container Principal (Área Cinza) */}
      {/* flex-1: Faz o container esticar para ocupar o restante da tela */}
      {/* flex flex-col: Permite organizar os itens internos verticalmente */}
      <div className="bg-[#e0e0e0] p-6 lg:p-8 rounded-2xl shadow-md border border-gray-300 w-[95%] max-w-[1800px] flex-1 flex flex-col">
        
        {/* Barra Branca Superior (Descrição) */}
        <div className="mb-6">
          <input
            type="text"
            className="w-full h-14 bg-white rounded-lg px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Seção Central: Campos de Especificação + Imagem */}
        <div className="flex flex-col xl:flex-row gap-6 mb-6">
          {/* Lado Esquerdo: Grid de Inputs */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 xl:w-2/3">
          
            <AutocompleteInput placeholder="Categoria" options={categoriasDB} />
            <AutocompleteInput placeholder="Sub-Categoria" options={subCategoriasDB} />
            <AutocompleteInput placeholder="Marca" options={marcasDB} />

            <input placeholder="Especificação 1" className={`${inputStyle} w-full`} />
            <input placeholder="Especificação 2" className={`${inputStyle} w-full`} />
            <input placeholder="Especificação 3" className={`${inputStyle} w-full`} />

            <input
              placeholder="Observação/Local Guardado"
              className={`${inputStyle} md:col-span-2 w-full`}
            />
            <input placeholder="SKU/Código Interno" className={`${inputStyle} w-full`} />
          </div>

          {/* Lado Direito: Upload de Imagem */}
          <div className="xl:w-1/3 min-h-[200px] bg-[#b1e1fb] rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-200 transition">
            <div className="bg-[#e2e8f0] p-4 rounded border-4 border-gray-600 mb-4 shadow-sm relative">
              <svg
                width="80"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-gray-600 font-bold text-center leading-tight">
              CLIQUE AQUI <br /> PARA BUSCAR IMAGEM
            </p>
          </div>
        </div>

        {/* Seção Inferior: Valores + Tabela de Fornecedores */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Lado Esquerdo: Grid de Valores Financeiros e Estoque */}
          <div className="xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
            <input placeholder="Valor Venda" className={`${inputStyle} w-full`} />
            <input placeholder="Valor Instalação" className={`${inputStyle} w-full`} />
            
            <input placeholder="Custo Compra Médio" className={`${inputStyle} w-full`} />
            <input placeholder="Estoque Atual" className={`${inputStyle} w-full`} />
            
            <input placeholder="Lucro % / R$" className={`${inputStyle} w-full`} />
            <input placeholder="Estoque Minimo" className={`${inputStyle} w-full`} />
          </div>

          {/* Lado Direito: Tabela */}
          <div className="xl:w-1/2">
            <div className="h-[200px] overflow-y-auto pr-2 flex flex-col gap-3 rounded-lg custom-scrollbar">
              {renderTableRows()}
            </div>
          </div>
        </div>

        {/* Botão Confirmar no Rodapé do Formulário */}
        {/* mt-auto: Empurra esta div para o final absoluto do container cinza */}
        <div className="mt-auto pt-8 flex justify-end">
          <button className="bg-[#00c950] text-black font-extrabold text-lg py-3 px-12 rounded-lg shadow-md hover:bg-green-500 transition-colors border-2 border-transparent hover:border-black">
            CONFIRMAR
          </button>
        </div>

      </div>
    </div>
  );
}