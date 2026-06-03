import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, User, FileText, ChevronLeft, ChevronRight, Toolbox } from 'lucide-react';

// Importando os serviços reais
import { ordemServicoService } from '../services/ordemServicoService';
import { pedidoService } from '../services/pedidoService';
import { clienteService } from '../services/clienteService';
import { servicoService } from '../services/servicoService';
import type { OrdemServico, StatusOrdemServico } from '../services/types/OrdemServico';

interface TaskEnriched extends OrdemServico {
  clienteNome: string;
  servicoNome: string;
  startHour: number;
  durationHours: number;
}

const START_HOUR = 9;  // Oficina abre às 9h
const END_HOUR = 18;   // Oficina fecha às 18h
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function ControleServico() {
  const [tasks, setTasks] = useState<TaskEnriched[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredTask, setHoveredTask] = useState<TaskEnriched | null>(null);
  
  // Controle de Data
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getApiDateString = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzOffset);
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const dataStr = getApiDateString(currentDate);
        
        const dataInicioCompleta = `${dataStr}T00:00:00`;
        const dataFimCompleta = `${dataStr}T23:59:59`;

        const ordens = await ordemServicoService.listar({ 
          data_inicio: dataInicioCompleta, 
          data_fim: dataFimCompleta 
        });

        const enrichedTasks = await Promise.all(ordens.map(async (os) => {
          let clienteNome = "Cliente Avulso";
          let servicoNome = `Serviço #${os.servico_id}`;

          try {
            const servico = await servicoService.buscarPorId(os.servico_id);
            servicoNome = servico.descricao;

            const pedido = await pedidoService.buscarPorId(os.pedido_id);
            if (pedido.cliente_id) {
              const cliente = await clienteService.buscarPorId(pedido.cliente_id);
              clienteNome = cliente.nome;
            }
          } catch (e) {
            console.warn("Erro ao enriquecer OS:", os.id);
          }

          // Ajuste seguro de Datas independentemente de fuso horário
          const startDate = new Date(os.data_inicio_previsto);
          const endDate = new Date(os.data_termino_previsto);
          
          const startH = startDate.getHours() + (startDate.getMinutes() / 60);
          const endH = endDate.getHours() + (endDate.getMinutes() / 60);

          return {
            ...os,
            clienteNome,
            servicoNome,
            startHour: startH,
            durationHours: Math.max(0.5, endH - startH) 
          };
        }));

        setTasks(enrichedTasks);

      } catch (error) {
        console.error("Erro ao carregar ordens de serviço:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [currentDate]);

  // CORREÇÃO 1: Evita o pulo de 2 em 2 criando uma nova instância de data sem mutar o estado anterior
  const prevDay = () => setCurrentDate(prev => {
    const newDate = new Date(prev);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  });
  
  const nextDay = () => setCurrentDate(prev => {
    const newDate = new Date(prev);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  });

  // CORREÇÃO 2: Permite que o usuário digite a data manualmente no calendário
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-');
    if (year && month && day) {
      setCurrentDate(new Date(Number(year), Number(month) - 1, Number(day)));
    }
  };

  const getStatusColor = (status: StatusOrdemServico) => {
    switch(status) {
      case 'na_fila': return 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300';
      case 'em_manutencao': return 'bg-blue-100 border-blue-400 text-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:bg-blue-200';
      case 'aguardando_peca': return 'bg-orange-100 border-orange-400 text-orange-800 shadow-[0_0_10px_rgba(249,115,22,0.3)] hover:bg-orange-200';
      case 'pronto': return 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200';
      case 'entregue': return 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-60';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (status: StatusOrdemServico) => {
    switch(status) {
      case 'na_fila': return <Clock size={14} className="shrink-0" />;
      case 'em_manutencao': return <Toolbox size={14} className="shrink-0" />;
      case 'aguardando_peca': return <AlertTriangle size={14} className="shrink-0" />;
      case 'pronto': return <CheckCircle size={14} className="shrink-0" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-6 lg:p-10 font-sans relative flex flex-col">
      
      {/* HEADER E CONTROLES DE DATA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#143a64] uppercase tracking-wide flex items-center gap-2">
            <Toolbox className="text-blue-500" />
            Controle de Oficina
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Timeline de serviços agendados</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <button onClick={prevDay} className="p-2 text-gray-400 hover:text-[#143a64] hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          
          {/* Input de Data Nativo do HTML */}
          <input 
            type="date"
            value={getApiDateString(currentDate)}
            onChange={handleDateChange}
            className="px-2 py-1.5 text-sm font-bold uppercase tracking-wider text-[#143a64] bg-transparent hover:bg-blue-50 rounded-lg transition-colors outline-none cursor-pointer"
          />

          <button onClick={nextDay} className="p-2 text-gray-400 hover:text-[#143a64] hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
        
        {isLoading && (
           <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#143a64] border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}

        <div className="overflow-x-auto h-full flex flex-col custom-scrollbar">
          <div className="min-w-[900px] flex flex-col h-full">
            
            {/* EIXO X: HORAS */}
            <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
              <div className="w-32 shrink-0 border-r border-gray-200 p-3 flex items-center justify-center font-bold text-[11px] text-gray-400 uppercase tracking-wider">
                Ordens do Dia
              </div>
              <div className="flex-1 flex relative h-12">
                {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-gray-200/50 last:border-r-0 relative">
                    <span className="absolute -left-3 top-3 text-[11px] font-bold text-gray-400">
                      {START_HOUR + i}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* EIXO Y: TIMELINE */}
            <div className="flex-1 relative bg-white">
              
              {/* Grades verticais */}
              <div className="absolute inset-0 flex ml-32 pointer-events-none">
                {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-dashed border-gray-200/60 h-full"></div>
                ))}
              </div>

              {tasks.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 font-medium text-sm">
                  <CheckCircle size={32} className="mb-2 opacity-30" />
                  Nenhum serviço agendado para este dia.
                </div>
              ) : (
                <div className="py-4 space-y-4 relative z-10">
                  {tasks.map((task) => {
                    // Impede o gráfico de quebrar se o serviço começar antes das 9h ou ir até depois das 18h
                    const startH = Math.max(START_HOUR, task.startHour);
                    const leftPercent = ((startH - START_HOUR) / TOTAL_HOURS) * 100;
                    const widthPercent = Math.min(100 - leftPercent, (task.durationHours / TOTAL_HOURS) * 100);

                    return (
                      <div key={task.id} className="flex h-14 group">
                        
                        <div className="w-32 shrink-0 flex items-center justify-center border-r border-gray-200 pr-2">
                          <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                            OS #{task.id.toString().padStart(4, '0')}
                          </span>
                        </div>
                        
                        <div className="flex-1 relative">
                          <div 
                            onMouseEnter={() => setHoveredTask(task)}
                            onMouseLeave={() => setHoveredTask(null)}
                            style={{ left: `${Math.max(0, leftPercent)}%`, width: `${widthPercent}%` }}
                            className={`absolute top-1 bottom-1 rounded-lg border flex flex-col justify-center px-3 cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] hover:z-20 overflow-hidden ${getStatusColor(task.status)}`}
                          >
                            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider truncate">
                              {getStatusIcon(task.status)}
                              <span className="truncate">{task.servicoNome}</span>
                            </div>
                            <div className="text-[10px] font-medium opacity-80 truncate mt-0.5">
                              {new Date(task.data_inicio_previsto).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} - {new Date(task.data_termino_previsto).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY FLUTUANTE INFERIOR */}
      <div 
        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-[#143a64] text-white p-5 rounded-2xl shadow-2xl transition-all duration-300 transform w-80 z-50 pointer-events-none border border-blue-900/50
          ${hoveredTask ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        {hoveredTask && (
          <div className="flex flex-col gap-3 font-sans">
            <div className="flex items-center justify-between border-b border-blue-800/50 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Detalhes do Agendamento</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-white/10`}>
                {hoveredTask.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-start gap-3 mt-1">
              <User size={16} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Cliente</span>
                <span className="text-sm font-black tracking-wide leading-none">{hoveredTask.clienteNome}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText size={16} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Pedido Relacionado</span>
                <span className="text-sm font-black tracking-wide leading-none">#{hoveredTask.pedido_id.toString().padStart(4, '0')}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Toolbox size={16} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Serviço</span>
                <span className="text-sm font-black tracking-wide leading-none">{hoveredTask.servicoNome}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}