import React, { useState } from 'react';
import { clienteService } from '../../services/clienteService'; // Importando o serviço que criamos
import type { Cliente } from '../../services/types/Cliente';

export default function CustomerData() {
  // Estados do Formulário
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [celular, setCelular] = useState('');
  const [nome, setNome] = useState('');
  const [bikeInfo, setBikeInfo] = useState('');
  const [semWhatsapp, setSemWhatsapp] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);

  // Função disparada ao clicar em "Pesquisar Cliente" ou dar Enter no Celular
  const handlePesquisar = async () => {
    // Remove espaços, parênteses e traços para buscar limpo
    const numeroLimpo = celular.replace(/\D/g, ''); 
    if (numeroLimpo.length < 8) {
      alert("Digite um número de celular válido para buscar.");
      return;
    }

    try {
      setIsSearching(true);
      // Chama a API usando o serviço tipado
      const resultados = await clienteService.listar({ busca: numeroLimpo });
      
      if (resultados.length > 0) {
        // Cliente encontrado! Autopreencher os dados
        const clienteEncontrado = resultados[0];
        setClienteId(clienteEncontrado.id);
        setNome(clienteEncontrado.nome);
        setBikeInfo(clienteEncontrado.bike_info || '');
        setSemWhatsapp(clienteEncontrado.sem_whatsapp || false);
        // Opcional: Tocar um som de sucesso ou mostrar um toastzinho verde
      } else {
        // Cliente não encontrado, libera para cadastro
        setClienteId(null);
        setNome('');
        setBikeInfo('');
        setSemWhatsapp(false);
        alert("Cliente não encontrado. Preencha o nome para um novo cadastro.");
      }
    } catch (error) {
      console.error("Erro na busca de cliente:", error);
      alert("Erro ao buscar cliente. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full lg:w-1/2 flex flex-col gap-3 font-sans text-gray-800 border border-gray-100 relative">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-[1.1rem]">Dados do Cliente</h2>
        {/* Badge para mostrar se é cliente novo ou antigo */}
        {clienteId ? (
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">Cliente Registrado</span>
        ) : (
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold uppercase">Novo Cadastro</span>
        )}
      </div>

      {/* Linha 1: Celular e Whatsapp (Movido para cima pois é a chave de busca) */}
      <div className="flex items-center gap-2">
        <label className="w-16 text-right text-[15px]">Celular:</label>
        <input 
          type="text" 
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePesquisar()} // Permite buscar com a tecla Enter
          placeholder="(11) 99999-9999" 
          className="w-36 bg-[#f4f3eb] rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#143a64]" 
        />
        <label className="flex items-center gap-2 text-sm cursor-pointer ml-1">
          <input 
            type="checkbox" 
            checked={semWhatsapp}
            onChange={(e) => setSemWhatsapp(e.target.checked)}
            className="rounded border-gray-300 w-4 h-4 accent-[#143a64]" 
          />
          Sem Whatsapp
        </label>
      </div>

      {/* Linha 2: Nome */}
      <div className="flex items-center gap-2">
        <label className="w-16 text-right text-[15px]">Nome:</label>
        <input 
          type="text" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo" 
          className="flex-1 bg-[#f4f3eb] rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#143a64]" 
        />
      </div>

      {/* Linha 3: Bike (Esta informação vai para o PEDIDO, não só para o cliente) */}
      <div className="flex items-center gap-2">
        <label className="w-16 text-right text-[15px]">Bike:</label>
        <input 
          type="text" 
          value={bikeInfo}
          onChange={(e) => setBikeInfo(e.target.value)}
          placeholder='Ex: Quadro Absolute Preto Aro 29'
          className="flex-1 bg-[#f4f3eb] rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#143a64]" 
        />
      </div>

      {/* Linha 4: Toggle e Botão de Pesquisa */}
      <div className="flex items-center justify-between mt-2 pl-1">
        <label className="flex items-center gap-2 cursor-pointer relative">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#c9b485] transition-colors"></div>
          <div className="absolute left-[3px] top-[3px] bg-white w-[18px] h-[18px] rounded-full transition-transform peer-checked:translate-x-5 shadow-sm border border-gray-200"></div>
          <span className="text-[15px]">Emitir Nota Fiscal</span>
        </label>

        <button 
          onClick={handlePesquisar}
          disabled={isSearching}
          className="bg-[#143a64] hover:bg-[#0f2d4e] transition-colors text-white rounded-md px-3 py-1.5 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
             </svg>
          )}
          {isSearching ? 'Buscando...' : 'Pesquisar Cliente'}
        </button>
      </div>
    </div>
  );
}