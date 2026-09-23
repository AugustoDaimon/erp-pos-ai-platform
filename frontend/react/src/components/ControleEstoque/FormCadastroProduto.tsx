import { useState } from 'react';
import { ImageSearchModal } from './ImageSearchModal';
import { SecaoEstoqueValores } from './SecaoEstoqueValores';
import { SecaoHistoricoCompras } from './SecaoHistoricoCompras';
import { InputLockButton } from './InputLockButton';
import { ModalGerenciarCatalogo } from './ModalGerenciarCatalogo';
import { Wand2, ImagePlus } from 'lucide-react';
import AutocompleteInput from '../AutoCompleteInput';
import { useProdutoForm } from '../../hooks/useProdutoForm';

export const FormCadastroProduto = ({ produtoParaEdicao }: { produtoParaEdicao?: any }) => {
  const [isModalCatalogoAberto, setIsModalCatalogoAberto] = useState(false);
  const [isModalImagemAberto, setIsModalImagemAberto] = useState(false);
  const [activeTab, setActiveTab] = useState<'estoque' | 'historico'>('estoque');

  // Consumindo o Hook
  const {
    formData, formKey, lockedFields, description, setDescription,
    selectedImage, setSelectedImage, isLoading, isGeneratingSKU, isSubmitting,
    categoriasOptions, subcategoriasOptions, marcasOptions,
    handleInputChange, toggleLock, handleBotaoLimpar, handleGenerateSKU, handleConfirmar
  } = useProdutoForm(produtoParaEdicao);

  // Estilos modernizados
  const inputStyle = 'bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full transition-all';
  const labelStyle = "text-xs font-semibold text-gray-600 uppercase ml-1 mb-1.5 tracking-wide block";

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-7xl mx-auto flex flex-col relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl transition-all">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-blue-600">Sincronizando catálogo...</p>
          </div>
        </div>
      )}

      {/* Título da Descrição */}
      <div className="mb-8 flex flex-col">
        <label className={labelStyle}>Descrição do Produto</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-14 bg-gray-50 rounded-xl px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm font-semibold text-lg text-gray-800 transition-all"
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-8 mb-8">
        {/* Grid de Inputs */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 xl:w-2/3">
          
          {/* Categoria */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase ml-1 tracking-wide">Categoria</label>
                <button
                  type="button"
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  onClick={() => setIsModalCatalogoAberto(true)}
                >
                  + Novo
                </button>
              </div>
              <InputLockButton locked={!!lockedFields.categoria} onClick={() => toggleLock('categoria')} />
            </div>
            <AutocompleteInput
              key={lockedFields.categoria ? 'locked-categoria' : `${formKey}-categoria`}
              options={categoriasOptions}
              onSelect={(val) => handleInputChange('categoria', val)}
            />
          </div>

          {/* Sub-Categoria */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1 tracking-wide">Sub-Categoria</label>
              <InputLockButton locked={!!lockedFields.subcategoria} onClick={() => toggleLock('subcategoria')} />
            </div>
            <AutocompleteInput
              key={lockedFields.subcategoria ? 'locked-subcat' : `${formKey}-subcategoria`}
              options={subcategoriasOptions}
              onSelect={(val) => handleInputChange('subcategoria', val)}
            />
          </div>

          {/* Marca */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1 tracking-wide">Marca</label>
              <InputLockButton locked={!!lockedFields.marca} onClick={() => toggleLock('marca')} />
            </div>
            <AutocompleteInput
              key={lockedFields.marca ? 'locked-marca' : `${formKey}-marca`}
              options={marcasOptions}
              onSelect={(val) => handleInputChange('marca', val)}
            />
          </div>

          {/* Especificações */}
          <div className="flex flex-col">
            <label className={labelStyle}>Especificação 1</label>
            <input value={formData.especificacao1} className={inputStyle} onChange={(e) => handleInputChange('especificacao1', e.target.value)} />
          </div>

          <div className="flex flex-col">
            <label className={labelStyle}>Especificação 2</label>
            <input value={formData.especificacao2} className={inputStyle} onChange={(e) => handleInputChange('especificacao2', e.target.value)} />
          </div>

          <div className="flex flex-col">
            <label className={labelStyle}>Especificação 3</label>
            <input value={formData.especificacao3} className={inputStyle} onChange={(e) => handleInputChange('especificacao3', e.target.value)} />
          </div>

          {/* SKU */}
          <div className="flex flex-col">
            <label className={labelStyle}>SKU / Código Interno</label>
            <div className="flex gap-2">
              <input
                value={formData.sku}
                className={`${inputStyle} flex-1 font-mono uppercase`}
                onChange={(e) => handleInputChange('sku', e.target.value)}
              />
              <button
                type="button"
                onClick={handleGenerateSKU}
                disabled={isGeneratingSKU}
                title="Gerar SKU"
                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg px-4 flex items-center justify-center transition-colors border border-blue-200 hover:border-transparent focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isGeneratingSKU ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Wand2 size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Observação */}
          <div className="flex flex-col md:col-span-2">
            <label className={labelStyle}>Observação / Local Guardado</label>
            <input value={formData.observacao} className={inputStyle} onChange={(e) => handleInputChange('observacao', e.target.value)} />
          </div>
        </div>

        {/* Upload/Busca de Imagem */}
        <div
          onClick={() => setIsModalImagemAberto(true)}
          className="xl:w-1/3 min-h-[220px] rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all group overflow-hidden relative"
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2 rounded-xl" />
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
              <ImagePlus size={48} className="mb-3 opacity-80" />
              <p className="font-semibold text-sm text-center">Clique para adicionar<br/>uma imagem</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('estoque')}
          className={`pb-3 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'estoque' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          ESTOQUE E VALORES
        </button>
        <button
          className={`pb-3 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'historico' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-500'}`}
        >
          HISTÓRICO DE COMPRAS (EM BREVE)
        </button>
      </div>

      {/* Conteúdo da Tab */}
      <div className="flex-1 min-h-[200px]">
        {activeTab === 'estoque' ? (
          <SecaoEstoqueValores
            inputStyle={inputStyle}
            dados={formData}
            onChange={handleInputChange}
            lockedFields={lockedFields}
            toggleLock={toggleLock}
          />
        ) : (
          <SecaoHistoricoCompras inputStyle={inputStyle} />
        )}
      </div>

      {/* Rodapé de Ações */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <button 
          onClick={handleBotaoLimpar} 
          className="px-6 py-3 bg-white text-red-500 font-semibold rounded-xl border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all text-sm uppercase tracking-wide"
        >
          Limpar Formulário
        </button>
        <button
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-bold text-sm py-3 px-10 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          {isSubmitting ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> SALVANDO...</>
          ) : (
            produtoParaEdicao ? "SALVAR ALTERAÇÕES" : "CADASTRAR PRODUTO"
          )}
        </button>
      </div>

      <ModalGerenciarCatalogo isOpen={isModalCatalogoAberto} onClose={() => setIsModalCatalogoAberto(false)} />
      {isModalImagemAberto && (
        <ImageSearchModal query={description} onClose={() => setIsModalImagemAberto(false)} onSelectImage={(url) => { setSelectedImage(url); setIsModalImagemAberto(false); }} />
      )}
    </div>
  );
};