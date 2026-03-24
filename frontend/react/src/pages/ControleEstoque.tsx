import React from 'react';
import { HeaderEstoque } from '../components/ControleEstoque/HeaderEstoque';
import { FormCadastroProduto } from '../components/ControleEstoque/FormCadastroProduto';
export default function ControleEstoque() {
  
  const handleCadastrar = () => {
    console.log("Ação de cadastrar disparada pelo Header");
  };

  const handlePesquisar = () => {
    console.log("Ação de pesquisar disparada pelo Header");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 font-sans flex flex-col items-center">
      <HeaderEstoque 
        onCadastrar={handleCadastrar} 
        onPesquisar={handlePesquisar} 
      />
      
      <FormCadastroProduto />
    </div>
  );
}