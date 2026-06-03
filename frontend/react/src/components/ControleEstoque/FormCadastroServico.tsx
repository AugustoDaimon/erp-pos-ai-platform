import { useState, useEffect } from 'react';
import { servicoService } from '../../services/servicoService';

// Tipagem baseada no seu DTO/Schema do Backend
interface Servico {
  id: number;
  descricao: string;
  preco: number;
  tempo_estimado: number;
}

export const FormCadastroServico = () => {
  // ==========================================
  // ESTADOS
  // ==========================================
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estados do Formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tempoEstimado, setTempoEstimado] = useState('');

  // ==========================================
  // ESTILOS PADRONIZADOS (Do seu tema)
  // ==========================================
  const inputStyle = 'bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full';
  const labelStyle = 'text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider block mb-1';

  // ==========================================
  // EFEITOS (Carregar dados iniciais)
  // ==========================================
  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const data = await servicoService.listar();
      setServicos(data);

    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  // ==========================================
  // FUNÇÕES DE AÇÃO (CRUD)
  // ==========================================
  const resetarFormulario = () => {
    setDescricao('');
    setValor('');
    setTempoEstimado('');
    setEditingId(null);
  };

  const handleSalvar = async () => {
    if (!descricao.trim()) return alert("A descrição é obrigatória.");
    
    const precoFloat = parseFloat(valor.replace(',', '.')) || 0;
    if (precoFloat <= 0) return alert("O valor deve ser maior que zero.");
    
    const tempoInt = parseInt(tempoEstimado, 10) || 0;
    if (tempoInt <= 0) return alert("O tempo estimado deve ser maior que zero.");

    const payload = {
      descricao,
      preco: precoFloat,
      tempo_estimado: tempoInt
    };

    try {
      setIsSubmitting(true);

      if (editingId) {
        await servicoService.atualizar(editingId, payload);
        alert("Serviço atualizado com sucesso!");
      } else {
        await servicoService.criar(payload);
        alert("Serviço cadastrado com sucesso!");
      }

      resetarFormulario();
      carregarServicos(); 

    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao salvar. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditar = (servico: Servico) => {
    setDescricao(servico.descricao);
    setValor(servico.preco.toString().replace('.', ',')); // Formata de volta pra vírgula
    setTempoEstimado(servico.tempo_estimado.toString());
    setEditingId(servico.id);
    
    // Rola a página para o topo suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este serviço?")) return;

    try {
      await servicoService.deletar(id);
      alert("Serviço deletado com sucesso!");
      carregarServicos(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar o serviço.");
    }
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  return (
    <div className="bg-[#e0e0e0] p-6 lg:p-8 rounded-2xl shadow-md border border-gray-300 w-[95%] max-w-[1800px] mx-auto flex-1 flex flex-col relative mt-6">
      
      {/* 1. SEÇÃO DO FORMULÁRIO (TOP) */}
      <div className="bg-white/40 p-6 rounded-xl border border-gray-300 mb-8">
        <h2 className="text-lg font-black text-gray-700 uppercase tracking-widest mb-4 border-b-2 border-gray-400 pb-2">
          {editingId ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Campo Descrição */}
          <div className="flex-1 md:flex-[2]">
            <label className={labelStyle}>Descrição do Serviço</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Revisão Geral Completa..."
              className={inputStyle}
            />
          </div>

          {/* Campo Valor */}
          <div className="flex-1">
            <label className={labelStyle}>Valor (R$)</label>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className={inputStyle}
            />
          </div>

          {/* Campo Tempo Estimado */}
          <div className="flex-1">
            <label className={labelStyle}>Tempo (Minutos)</label>
            <input
              type="number"
              value={tempoEstimado}
              onChange={(e) => setTempoEstimado(e.target.value)}
              placeholder="Ex: 120"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Botões do Formulário */}
        <div className="flex justify-end gap-4 mt-6">
          <button 
            onClick={resetarFormulario} 
            className="px-6 py-2 bg-red-100 text-red-600 font-bold rounded-xl border-2 border-red-200 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-xs"
          >
            Cancelar / Limpar
          </button>
          
          <button
            onClick={handleSalvar}
            disabled={isSubmitting}
            className="bg-[#00c950] text-black font-extrabold text-sm py-2 px-8 rounded-lg shadow-md hover:bg-green-500 transition-colors border-2 border-transparent hover:border-black disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'SALVANDO...' : (editingId ? 'ATUALIZAR SERVIÇO' : 'CADASTRAR SERVIÇO')}
          </button>
        </div>
      </div>

      {/* 2. SEÇÃO DA TABELA (BOTTOM) */}
      <h2 className="text-lg font-black text-gray-700 uppercase tracking-widest mb-4">
        Serviços Cadastrados
      </h2>
      
      <div className="overflow-x-auto bg-white rounded-xl border-2 border-black shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-black text-gray-700 uppercase text-xs font-bold tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Descrição do Serviço</th>
              <th className="p-4">Valor (R$)</th>
              <th className="p-4 text-center">Tempo Est. (Min)</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.length > 0 ? (
              servicos.map((servico) => (
                <tr key={servico.id} className="border-b border-gray-300 hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-bold text-gray-600">{servico.id}</td>
                  <td className="p-4 font-bold text-gray-800">{servico.descricao}</td>
                  <td className="p-4 font-bold text-green-700">R$ {servico.preco.toFixed(2).replace('.', ',')}</td>
                  <td className="p-4 font-bold text-gray-700 text-center">{servico.tempo_estimado} min</td>
                  
                  <td className="p-4 flex justify-center gap-3">
                    <button 
                      onClick={() => handleEditar(servico)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded border border-blue-300 font-bold hover:bg-blue-600 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeletar(servico.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded border border-red-300 font-bold hover:bg-red-600 hover:text-white transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                  Nenhum serviço cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};