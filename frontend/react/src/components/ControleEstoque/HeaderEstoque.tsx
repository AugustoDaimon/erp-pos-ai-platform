interface HeaderProps {
  tipoAtivo: string;
  acaoAtiva: string;
  onMudarTipo: (tipo: 'produto' | 'bicicleta' | 'servico') => void;
  onMudarAcao: (acao: 'cadastrar' | 'pesquisar') => void;
}

export const HeaderEstoque = ({ tipoAtivo, acaoAtiva, onMudarTipo, onMudarAcao }: HeaderProps) => {
  return (
    <header className="flex justify-between w-full max-w-[1800px] mb-4">
      {/* Lado Esquerdo: Tipos */}
      <div className="flex gap-2">
        <button 
          onClick={() => onMudarTipo('produto')}
          className={`px-6 py-2 rounded font-bold ${tipoAtivo === 'produto' ? 'bg-blue-600 text-white' : 'bg-blue-300'}`}
        >
          PRODUTO
        </button>
        <button 
          onClick={() => onMudarTipo('bicicleta')}
          className={`px-6 py-2 rounded font-bold ${tipoAtivo === 'bicicleta' ? 'bg-blue-600 text-white' : 'bg-blue-300'}`}
        >
          BICICLETA
        </button>
        <button 
          onClick={() => onMudarTipo('servico')}
          className={`px-6 py-2 rounded font-bold ${tipoAtivo === 'servico' ? 'bg-blue-600 text-white' : 'bg-blue-300'}`}
        >
          SERVIÇO
        </button>
      </div>

      {/* Lado Direito: Ações (SÓ APARECE SE NÃO FOR SERVIÇO) */}
      {tipoAtivo !== 'servico' && (
        <div className="flex gap-2">
          <button 
            onClick={() => onMudarAcao('cadastrar')}
            className={`px-6 py-2 rounded font-bold ${acaoAtiva === 'cadastrar' ? 'bg-green-600 text-white' : 'bg-green-400'}`}
          >
            CADASTRAR
          </button>
          <button 
            onClick={() => onMudarAcao('pesquisar')}
            className={`px-6 py-2 rounded font-bold ${acaoAtiva === 'pesquisar' ? 'bg-blue-400 text-white' : 'bg-blue-200'}`}
          >
            PESQUISAR
          </button>
        </div>
      )}
    </header>
  );
}