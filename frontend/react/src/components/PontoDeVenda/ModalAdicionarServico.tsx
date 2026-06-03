import React, { useState, useEffect } from 'react';
import { Search, Clock, DollarSign, X, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { servicoService } from '../../services/servicoService';
import type { Servico } from '../../services/types/Servico';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdicionar: (servico: Servico, data: string, horario: string) => void;
}

export const ModalAdicionarServico: React.FC<Props> = ({ isOpen, onClose, onAdicionar }) => {
  // Estados de Dados da API
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de Interface
  const [busca, setBusca] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  
  // Data inicial: hoje
  const hoje = new Date().toISOString().split('T')[0];
  const [dataSelecionada, setDataSelecionada] = useState<string>(hoje);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  // =======================================================================
  // TODOS OS HOOKS (USEEFFECT) DEVEM FICAR ANTES DOS RETURNS (REGRAS DO REACT)
  // =======================================================================
  
  // 1. CARREGAMENTO DA API
  useEffect(() => {
    const fetchServicos = async () => {
      setIsLoading(true);
      try {
        const data = await servicoService.listar();
        setServicos(data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchServicos();
    }
  }, [isOpen]);

  // 2. Limpa o horário se o usuário trocar de serviço
  useEffect(() => {
    setHorarioSelecionado(null);
  }, [servicoSelecionado]);

  // =======================================================================
  // AGORA SIM, O RETORNO CONDICIONAL
  // =======================================================================
  if (!isOpen) return null;

  // Lógica de filtro local
  const servicosFiltrados = servicos.filter(s => 
    s.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  // Arrays de tempo (Timeline)
  const horas = [9, 10, 11, 12, 14, 15, 16, 17, 18]; // Pula 13h
  const minutos = ['00', '15', '30', '45'];

  // 3. Converte "HH:MM" para minutos corridos...
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  // 3. Validação ao clicar em uma célula
  const handleCellClick = (timeString: string) => {
    if (!servicoSelecionado) {
      alert("Por favor, selecione um serviço na lista da esquerda primeiro!");
      return;
    }
    setHorarioSelecionado(timeString);
  };

  const handleConfirmar = () => {
    if (servicoSelecionado && dataSelecionada && horarioSelecionado) {
      onAdicionar(servicoSelecionado, dataSelecionada, horarioSelecionado);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      
      {/* Container Principal do Modal */}
      <div className="bg-[#f0f4f8] w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
        
        {/* Header do Modal */}
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
          <h2 className="font-black text-xl text-[#143a64] uppercase tracking-wide flex items-center gap-2">
            <Clock className="text-blue-500" size={24} strokeWidth={2.5} />
            Adicionar Serviço & Agendamento
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Corpo do Modal (2 Colunas) */}
        <div className="flex flex-1 overflow-hidden p-5 gap-5">
          
          {/* COLUNA ESQUERDA: Busca de Serviços */}
          <div className="w-[35%] flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar serviço..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-blue-500">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="font-bold text-sm">Carregando serviços...</span>
                </div>
              ) : servicosFiltrados.length > 0 ? (
                servicosFiltrados.map((servico) => {
                  const isSelected = servicoSelecionado?.id === servico.id;
                  
                  // Tratamento inteligente caso o backend envie snake_case
                  const valorServico = servico.preco || (servico as any).valor_venda || 0;
                  const tempoEstimado = servico.tempo_estimado || (servico as any).tempo_estimado || 0;

                  return (
                    <div 
                      key={servico.id}
                      onClick={() => setServicoSelecionado(servico)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-transparent bg-white shadow-sm hover:border-blue-200 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-sm ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                          {servico.descricao}
                        </h3>
                        {isSelected && <CheckCircle2 size={18} className="text-blue-500 shrink-0 ml-2" />}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-2 font-medium">
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                          <Clock size={14} />
                          <span>{tempoEstimado} min</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-green-700 font-bold bg-green-50 px-2 py-1 rounded-md">
                          <DollarSign size={14} />
                          <span className="text-sm">{valorServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 py-10 text-sm font-medium">
                  Nenhum serviço encontrado.
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA: Seletor de Data e Matriz Estilo "Row Chart" */}
          <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            
            {/* Topo Direita: Seletor de Data */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <CalendarIcon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Data do Serviço</h3>
                  <p className="text-xs text-gray-500">Selecione o dia desejado para a execução.</p>
                </div>
              </div>
              
              <input 
                type="date" 
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
              />
            </div>

            {/* Timeline / Row Chart de Agendamento */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              
              {/* Header dos Minutos (Eixo X) */}
              <div className="flex ml-[72px] mb-2">
                {minutos.map(m => (
                  <div key={m} className="flex-1 text-center text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                    :{m}
                  </div>
                ))}
              </div>

              {/* Linhas (Eixo Y) */}
              <div className="flex flex-col gap-3">
                {horas.map(hora => (
                  <div key={hora} className="flex items-stretch h-12 group">
                    
                    {/* Rotulo da Hora */}
                    <div className="w-[72px] flex items-center justify-end pr-4 font-black text-gray-400 text-lg">
                      {hora.toString().padStart(2, '0')}h
                    </div>

                    {/* Barra Cinza Principal (Linha do Gráfico) */}
                    <div className="flex-1 flex bg-gray-100 rounded-lg border border-gray-300 overflow-hidden shadow-inner">
                      
                      {/* Fragmentos de 15 minutos */}
                      {minutos.map((minuto, idx) => {
                        const timeString = `${hora.toString().padStart(2, '0')}:${minuto}`;
                        const isLast = idx === minutos.length - 1;
                        
                        // Lógica para descobrir se a célula atual deve ser pintada
                        let isSelectedCell = false;
                        let isFirstCell = false;

                        if (horarioSelecionado && servicoSelecionado) {
                          const tempoEstimado = servicoSelecionado.tempo_estimado || (servicoSelecionado as any).tempo_estimado || 0;
                          
                          const startMin = timeToMinutes(horarioSelecionado);
                          const endMin = startMin + tempoEstimado;
                          const currentCellMin = timeToMinutes(timeString);

                          // Se a célula atual estiver dentro do intervalo de tempo (>= Início e < Fim)
                          if (currentCellMin >= startMin && currentCellMin < endMin) {
                            isSelectedCell = true;
                          }
                          // Identifica a primeira célula para poder colocar o texto nela
                          if (currentCellMin === startMin) {
                            isFirstCell = true;
                          }
                        }

                        return (
                          <div
                            key={timeString}
                            onClick={() => handleCellClick(timeString)}
                            className={`flex-1 relative cursor-pointer transition-all border-gray-400/50 hover:bg-gray-200
                              ${!isLast ? 'border-r-2' : ''} 
                              ${isSelectedCell ? 'bg-blue-500 hover:bg-blue-600' : ''}
                            `}
                          >
                            {/* Mostra o horário inicial apenas no primeiro bloco preenchido para ficar limpo */}
                            {isFirstCell && (
                              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs pointer-events-none">
                                {timeString}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-white p-4 border-t border-gray-200 flex justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-100 border-2 border-transparent transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirmar}
            disabled={!servicoSelecionado || !horarioSelecionado}
            className="px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider text-white bg-[#00c950] border-2 border-transparent hover:border-green-800 hover:bg-green-500 shadow-md transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Clock size={16} strokeWidth={3} />
            Agendar Serviço
          </button>
        </div>

      </div>
    </div>
  );
};