import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { clienteService } from '../../services/clienteService';
import type { Cliente } from '../../services/types/Cliente';

interface CustomerDataProps {
  onClienteChange: (cliente: Cliente | null) => void;
  onBikeChange: (bikeInfo: string) => void;
}

export default function CustomerData({ onClienteChange, onBikeChange }: CustomerDataProps) {
  // Estados do Formulário
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [celular, setCelular] = useState('');
  const [nome, setNome] = useState('');
  const [bikeInfo, setBikeInfo] = useState('');
  const [semWhatsapp, setSemWhatsapp] = useState(false);
  
  // Estados da Lista e API
  const [clientesDb, setClientesDb] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Carrega os clientes ao abrir o componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await clienteService.listar();
        setClientesDb(data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  // 2. Filtra a lista automaticamente com base no que está sendo digitado
  const clientesFiltrados = clientesDb.filter(c => {
    const termoNome = nome.toLowerCase();
    const termoCelular = celular.replace(/\D/g, ''); // Limpa a máscara para buscar
    
    const matchNome = c.nome.toLowerCase().includes(termoNome);
    const matchCelular = c.celular ? c.celular.replace(/\D/g, '').includes(termoCelular) : false;

    // Se o usuário digitou celular, filtra pelo celular. Se digitou nome, filtra pelo nome.
    if (celular.length > 2) return matchCelular;
    if (nome.length > 1) return matchNome;
    
    return true; // Se os campos estiverem vazios, mostra todos
  });

  // 3. Função para selecionar um cliente da lista
  const handleSelecionarCliente = (cliente: Cliente) => {
    setClienteId(cliente.id);
    setNome(cliente.nome);
    setCelular(cliente.celular || '');
    setBikeInfo(cliente.bike_info || '');
    setSemWhatsapp(cliente.sem_whatsapp || false);
    
    // Passa os dados para o componente Pai (PointOfSale)
    onClienteChange(cliente);
    onBikeChange(cliente.bike_info || '');
  };

  // 4. Função para criar um NOVO cliente no banco
  const handleAdicionarCliente = async () => {
    if (!nome) {
      alert("O nome do cliente é obrigatório para um novo cadastro.");
      return;
    }

    try {
      setIsLoading(true);
      const novoCliente = await clienteService.criar({
        nome,
        celular,
        bike_info: bikeInfo,
        sem_whatsapp: semWhatsapp
      });

      // Adiciona o novo cliente no topo da lista local e já seleciona ele!
      setClientesDb([novoCliente, ...clientesDb]);
      handleSelecionarCliente(novoCliente);
      
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      alert("Erro ao cadastrar o cliente. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Função para desmarcar o cliente e permitir novo cadastro
  const limparSelecao = () => {
    setClienteId(null);
    setNome('');
    setCelular('');
    setBikeInfo('');
    setSemWhatsapp(false);
    onClienteChange(null);
    onBikeChange('');
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm w-full lg:w-1/2 flex flex-col font-sans text-gray-800 border border-gray-200">
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-[1.1rem] uppercase">Dados do Cliente</h2>
        {clienteId && (
          <button onClick={limparSelecao} className="text-[10px] text-red-500 hover:underline font-bold uppercase">
            Limpar Seleção
          </button>
        )}
      </div>

      {/* FORMULÁRIO SUPERIOR */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <label className="w-16 text-right text-[15px] font-medium text-gray-600">Celular:</label>
          <input 
            type="text" 
            value={celular}
            onChange={(e) => {
              setCelular(e.target.value);
              if (clienteId) limparSelecao(); // Se digitar algo novo, desmarca o atual
            }}
            placeholder="(11) 99999-9999" 
            className="w-36 border border-gray-300 rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#143a64] transition-all" 
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer ml-1 text-gray-600 font-medium">
            <input 
              type="checkbox" 
              checked={semWhatsapp}
              onChange={(e) => setSemWhatsapp(e.target.checked)}
              className="rounded border-gray-300 w-4 h-4 accent-[#143a64]" 
            />
            Sem Whatsapp
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="w-16 text-right text-[15px] font-medium text-gray-600">Nome:</label>
          <input 
            type="text" 
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (clienteId) limparSelecao();
            }}
            placeholder="Nome completo" 
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#143a64] transition-all" 
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-16 text-right text-[15px] font-medium text-gray-600">Bike:</label>
          <input 
            type="text" 
            value={bikeInfo}
            onChange={(e) => setBikeInfo(e.target.value)}
            placeholder='Ex: Quadro Absolute Preto Aro 29'
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 outline-none text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#143a64] transition-all" 
          />
        </div>
      </div>

      {/* LINHA DE BOTÃO E NF */}
      <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-200 pl-1">
        <label className="flex items-center gap-2 cursor-pointer relative">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#c9b485] transition-colors"></div>
          <div className="absolute left-[3px] top-[3px] bg-white w-[18px] h-[18px] rounded-full transition-transform peer-checked:translate-x-5 shadow-sm border border-gray-200"></div>
          <span className="text-[15px] font-medium text-gray-700">Emitir NF</span>
        </label>

        {/* O BOTÃO SÓ APARECE SE NÃO TIVER NENHUM CLIENTE SELECIONADO */}
        {!clienteId ? (
          <button 
            onClick={handleAdicionarCliente}
            disabled={isLoading || !nome}
            className="bg-[#143a64] hover:bg-[#0f2d4e] transition-colors text-white rounded-lg px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
               <UserPlus size={16} strokeWidth={2.5} />
            )}
            Adicionar Cliente
          </button>
        ) : (
          <div className="bg-green-100 text-green-700 border border-green-300 rounded-lg px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-sm">
            <CheckCircle2 size={16} strokeWidth={3} />
            Cliente Selecionado
          </div>
        )}
      </div>

      {/* LISTA DE CLIENTES ABAIXO (SCROLLÁVEL) */}
      <div className="flex-1 overflow-y-auto max-h-[220px] custom-scrollbar mt-3 pr-2 flex flex-col gap-2">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => {
            const isSelected = clienteId === cliente.id;
            
            return (
              <div 
                key={cliente.id}
                onClick={() => handleSelecionarCliente(cliente)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                    : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  {/* NOME BIG */}
                  <div className={`font-black text-lg uppercase tracking-wide leading-tight ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                    {cliente.nome}
                  </div>
                  {isSelected && <CheckCircle2 size={20} className="text-blue-500 shrink-0 ml-2" />}
                </div>
                
                {/* SUBTÍTULOS (CELULAR E BIKE) */}
                <div className="text-[12px] font-bold text-gray-500 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    {cliente.celular || 'S/ Número'}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="truncate flex items-center gap-1">
                    {cliente.bike_info || 'S/ Bike Registrada'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 text-sm font-medium py-6">
            Nenhum cliente encontrado com esse nome/número.<br/>
            Preencha os dados e clique em "Adicionar Cliente".
          </div>
        )}
      </div>

    </div>
  );
}