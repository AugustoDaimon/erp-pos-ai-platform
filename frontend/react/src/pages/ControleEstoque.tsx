import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { HeaderEstoque } from '../components/ControleEstoque/HeaderEstoque';
import { FormCadastroProduto } from '../components/ControleEstoque/FormCadastroProduto';
import { FormCadastroServico } from '../components/ControleEstoque/FormCadastroServico';
import { FormPesquisaProduto } from '../components/ControleEstoque/FormPesquisaProduto';

export default function ControleEstoque() {
  const location = useLocation();
  const navigate = useNavigate(); 
  
  const [tipoAtivo, setTipoAtivo] = useState<'produto' | 'bicicleta' | 'servico'>('produto');
  const [acaoAtiva, setAcaoAtiva] = useState<'cadastrar' | 'pesquisar'>('cadastrar');
  
  const [produtoParaEdicao, setProdutoParaEdicao] = useState<any>(null);

  useEffect(() => {
    if (location.state?.produtoParaEdicao) {
      setProdutoParaEdicao(location.state.produtoParaEdicao);
      
      setTipoAtivo('produto');
      setAcaoAtiva('cadastrar');
      
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleMudarAcao = (novaAcao: 'cadastrar' | 'pesquisar') => {
    setAcaoAtiva(novaAcao);
    if (novaAcao === 'pesquisar') {
      setProdutoParaEdicao(null); 
    }
  };

  const handleMudarTipo = (novoTipo: 'produto' | 'bicicleta' | 'servico') => {
    setTipoAtivo(novoTipo);
    setProdutoParaEdicao(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      <HeaderEstoque 
        tipoAtivo={tipoAtivo}
        acaoAtiva={acaoAtiva}
        onMudarTipo={handleMudarTipo}
        onMudarAcao={handleMudarAcao} 
      />
      
      <div className="w-full flex justify-center mt-4">
        {acaoAtiva === 'cadastrar' ? (
          <>
            {tipoAtivo === 'produto' && <FormCadastroProduto produtoParaEdicao={produtoParaEdicao} />}
            {tipoAtivo === 'bicicleta' && <div className="p-10 font-bold text-xl text-gray-500">Formulário de Bicicleta em construção...</div>}
            {tipoAtivo === 'servico' && <FormCadastroServico />}
          </>
        ) : (
          <>
            {tipoAtivo === 'produto' && <FormPesquisaProduto />}
            {tipoAtivo === 'bicicleta' && <div className="p-10 font-bold text-xl text-gray-500">Tela de Pesquisa de Bicicleta em construção...</div>}
            {tipoAtivo === 'servico' && <div className="p-10 font-bold text-xl text-gray-500">Tela de Pesquisa de Serviço em construção...</div>}
          </>
        )}
      </div>
    </div>
  );
}