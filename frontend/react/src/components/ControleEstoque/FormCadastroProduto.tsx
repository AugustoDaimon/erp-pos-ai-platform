import { useEffect, useState } from 'react';
import AutocompleteInput from '../AutoCompleteInput';
import { ImageSearchModal } from './ImageSearchModal';
import { SecaoEstoqueValores } from './SecaoEstoqueValores';
import { SecaoHistoricoCompras } from './SecaoHistoricoCompras';
import { useProdutoMetaData } from '../../hooks/useProdutoMetaData';
import { produtoService } from '../../services/produtoService';
import { InputLockButton } from './InputLockButton';
import { ModalGerenciarCatalogo } from './ModalGerenciarCatalogo';
import { Wand2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom';

const initialFormData = {
  categoria: '',
  subcategoria: '',
  marca: '',
  especificacao1: '',
  especificacao2: '',
  especificacao3: '',
  observacao: '',
  sku: '',
  venda: '',
  instalacao: '',
  custo: '',
  lucroR: '',
  lucroP: '',
  estoqueAtual: '',
  estoqueMinimo: ''
};

export const FormCadastroProduto = ({ produtoParaEdicao }: { produtoParaEdicao?: any }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalCatalogoAberto, setIsModalCatalogoAberto] = useState(false);
  const [activeTab, setActiveTab] = useState<'estoque' | 'historico'>('estoque');
  const [formData, setFormData] = useState(initialFormData);
  const [formKey, setFormKey] = useState(0);
  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({});

  const { categorias, marcas, subcategorias, isLoading } = useProdutoMetaData();

  const categoriaSelecionadaObj = categorias.find(c => c.nome.toLowerCase() === formData.categoria.toLowerCase());
  const categoriaSelecionadaId = categoriaSelecionadaObj?.id;

  const subcategoriasFiltradas = categoriaSelecionadaId
    ? subcategorias.filter(s => s.categoria_id === categoriaSelecionadaId)
    : subcategorias;

  const marcasFiltradas = categoriaSelecionadaId
    ? marcas.filter(m => m.categorias_vinculadas?.includes(categoriaSelecionadaId))
    : marcas;

  const categoriasOptions = categorias.map(c => c.nome);
  const subcategoriasOptions = subcategoriasFiltradas.map(s => s.nome);
  const marcasOptions = marcasFiltradas.map(m => m.nome);

  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);

  const toggleLock = (field: string) => {
    setLockedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const resetarFormulario = () => {
    setFormData(prev => {
      const newState = { ...initialFormData };
      (Object.keys(newState) as Array<keyof typeof initialFormData>).forEach(key => {
        if (lockedFields[key]) {
          newState[key] = prev[key] as any;
        }
      });
      return newState;
    });

    setFormKey(prev => prev + 1);
    setDescription('');
    setSelectedImage(null);
  };

  const handleBotaoLimpar = () => {
    if (window.confirm("Deseja realmente limpar todo o formulário?")) {
      resetarFormulario();
    }
  };

  useEffect(() => {
    if (produtoParaEdicao && categorias.length && subcategorias.length && marcas.length) {
      setFormData({
        categoria: categorias.find(c => c.id === produtoParaEdicao.categoria_id)?.nome || '',
        subcategoria: subcategorias.find(s => s.id === produtoParaEdicao.subcategoria_id)?.nome || '',
        marca: marcas.find(m => m.id === produtoParaEdicao.marca_id)?.nome || '',
        especificacao1: produtoParaEdicao.especificacao_1 || '',
        especificacao2: produtoParaEdicao.especificacao_2 || '',
        especificacao3: produtoParaEdicao.especificacao_3 || '',
        observacao: produtoParaEdicao.observacao || '',
        sku: produtoParaEdicao.sku || '',
        venda: produtoParaEdicao.valor_venda?.toString() || '',
        instalacao: produtoParaEdicao.valor_instalacao?.toString() || '',
        custo: produtoParaEdicao.custo_compra?.toString() || '',
        lucroR: '',
        lucroP: '',
        estoqueAtual: produtoParaEdicao.estoque_atual?.toString() || '',
        estoqueMinimo: produtoParaEdicao.estoque_minimo?.toString() || ''
      });
      setDescription(produtoParaEdicao.descricao);
      setSelectedImage(produtoParaEdicao.imagem_url || null);
    }
  }, [produtoParaEdicao, categorias, subcategorias, marcas]);

  useEffect(() => {
    if (produtoParaEdicao) return;

    const { categoria, subcategoria, marca, especificacao1, especificacao2, especificacao3 } = formData;
    const partes = [categoria, subcategoria, marca, especificacao1, especificacao2, especificacao3]
      .filter(texto => texto && texto.trim() !== "");

    const novaSugestao = partes.join(' ');

    if (novaSugestao) {
      setDescription(novaSugestao);
    }
  }, [formData, produtoParaEdicao]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field as keyof typeof initialFormData]: value }));
  };

  const handleGenerateSKU = async () => {
    const catId = categorias.find(c => c.nome === formData.categoria)?.id;
    const subId = subcategorias.find(s => s.nome === formData.subcategoria)?.id;
    const marcaId = marcas.find(m => m.nome === formData.marca)?.id;

    if (!catId || !subId || !marcaId) {
      alert("Por favor, preencha Categoria, Sub-Categoria e Marca primeiro para gerar o SKU.");
      return;
    }

    try {
      setIsGeneratingSKU(true);

      const produtosExistentes = await produtoService.listar({
        categoria_id: catId,
        marca_id: marcaId
      });

      const count = produtosExistentes.filter(p => p.subcategoria_id === subId).length;
      const nextNumber = count + 1;

      const pad = (num: number) => String(num).padStart(2, '0');

      const novoSKU = `${pad(catId)}${pad(subId)}${pad(marcaId)}${pad(nextNumber)}`;

      handleInputChange('sku', novoSKU);

    } catch (error) {
      console.error("Erro ao gerar SKU:", error);
      alert("Falha ao consultar produtos para gerar o SKU.");
    } finally {
      setIsGeneratingSKU(false);
    }
  };

  const inputStyle = 'bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full';
  const labelStyle = "text-[11px] font-bold text-gray-500 uppercase ml-1 mb-1 tracking-wider block";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmar = async () => {
    if (!description.trim()) {
      alert("A descrição do produto é obrigatória.");
      return;
    }

    const valorVenda = parseFloat(formData.venda.replace(',', '.')) || 0;
    if (valorVenda <= 0) {
      alert("O Valor de Venda é obrigatório e deve ser maior que zero.");
      return;
    }

    const payloadCategoriaId = categorias.find(c => c.nome === formData.categoria)?.id || null;
    const payloadSubcategoriaId = subcategorias.find(s => s.nome === formData.subcategoria)?.id || null;
    const payloadMarcaId = marcas.find(m => m.nome === formData.marca)?.id || null;

    const payload = {
      descricao: description,
      valor_venda: valorVenda,
      categoria_id: payloadCategoriaId,
      subcategoria_id: payloadSubcategoriaId,
      marca_id: payloadMarcaId,
      observacao: formData.observacao || null,
      sku: formData.sku || null,
      valor_instalacao: parseFloat(formData.instalacao.replace(',', '.')) || 0,
      custo_compra: parseFloat(formData.custo.replace(',', '.')) || 0,
      estoque_atual: parseInt(formData.estoqueAtual, 10) || 0,
      estoque_minimo: parseInt(formData.estoqueMinimo, 10) || 0,
      especificacao_1: formData.especificacao1 || null,
      especificacao_2: formData.especificacao2 || null,
      especificacao_3: formData.especificacao3 || null,
      imagem_url: selectedImage || null,
    };

    try {
      setIsSubmitting(true);

      if (produtoParaEdicao) {
        await produtoService.atualizar(produtoParaEdicao.id, payload);
        alert("Sucesso! Produto atualizado com sucesso.");
        navigate(location.pathname, { replace: true, state: {} });
      } else {
        await produtoService.criar(payload);
        alert("Sucesso! Produto cadastrado no estoque.");
      }

      resetarFormulario();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar. Verifique os dados ou a conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#e0e0e0] p-6 lg:p-8 rounded-2xl shadow-md border border-gray-300 w-[95%] max-w-[1800px] flex-1 flex flex-col relative">

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-2xl">
          <p className="font-bold text-blue-600 animate-pulse">Sincronizando catálogo...</p>
        </div>
      )}

      <div className="mb-6 flex flex-col">
        <label className={labelStyle}>Descrição do Produto</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-14 bg-white rounded-lg px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-lg"
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 xl:w-2/3">

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Categoria</label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none font-medium transition-colors"
                  onClick={() => setIsModalCatalogoAberto(true)}
                >
                  + Adicionar Novo
                </button>
                <ModalGerenciarCatalogo isOpen={isModalCatalogoAberto} onClose={() => setIsModalCatalogoAberto(false)} />
              </div>
              <InputLockButton locked={!!lockedFields.categoria} onClick={() => toggleLock('categoria')} />
            </div>
            <AutocompleteInput
              key={lockedFields.categoria ? 'locked-categoria' : `${formKey}-categoria`}
              placeholder=""
              options={categoriasOptions}
              onSelect={(val) => handleInputChange('categoria', val)}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Sub-Categoria</label>
              <InputLockButton locked={!!lockedFields.subcategoria} onClick={() => toggleLock('subcategoria')} />
            </div>
            <AutocompleteInput
              key={lockedFields.subcategoria ? 'locked-subcat' : `${formKey}-subcategoria`}
              placeholder=""
              options={subcategoriasOptions}
              onSelect={(val) => handleInputChange('subcategoria', val)}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Marca</label>
              <InputLockButton locked={!!lockedFields.marca} onClick={() => toggleLock('marca')} />
            </div>
            <AutocompleteInput
              key={lockedFields.marca ? 'locked-marca' : `${formKey}-marca`}
              placeholder=""
              options={marcasOptions}
              onSelect={(val) => handleInputChange('marca', val)}
            />
          </div>

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

          <div className="flex flex-col">
            <label className={labelStyle}>SKU / Código Interno</label>
            <div className="flex gap-2">
              <input
                value={formData.sku}
                className={`${inputStyle} flex-1`}
                onChange={(e) => handleInputChange('sku', e.target.value)}
              />
              <button
                type="button"
                onClick={handleGenerateSKU}
                disabled={isGeneratingSKU}
                title="Gerar SKU Automaticamente"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 flex items-center justify-center transition-colors border-2 border-transparent focus:border-black disabled:bg-blue-300"
              >
                {isGeneratingSKU ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Wand2 />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className={labelStyle}>Observação / Local Guardado</label>
            <input value={formData.observacao} className={inputStyle} onChange={(e) => handleInputChange('observacao', e.target.value)} />
          </div>
        </div>

        <div
          onClick={() => setIsModalOpen(true)}
          className="xl:w-1/3 min-h-[200px] bg-[#b1e1fb] rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-200 transition border-2 border-transparent hover:border-blue-400"
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="w-full h-full max-h-[180px] object-contain rounded-lg shadow-md" />
          ) : (
            <>
              <div className="bg-[#e2e8f0] p-4 rounded border-4 border-gray-600 mb-4 shadow-sm">
                <svg width="60" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-gray-600 font-bold text-center leading-tight uppercase">Clique aqui para buscar imagem</p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-4 border-b-2 border-gray-400">
        <button
          onClick={() => setActiveTab('estoque')}
          className={`pb-2 px-4 font-bold transition-all ${activeTab === 'estoque' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ESTOQUE E VALORES
        </button>
        <button
          title='EM MANUTENÇÃO!'
          className={`pb-2 px-4 font-bold transition-all ${activeTab === 'historico' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          HISTÓRICO DE COMPRAS
        </button>
      </div>

      <div className="flex-1">
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

      <div className="flex justify-end gap-4 mt-8 border-t pt-6">
        <button onClick={handleBotaoLimpar} className="px-6 py-3 bg-red-100 text-red-600 font-bold rounded-xl border-2 border-red-200 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-xs">
          Limpar Formulário
        </button>
        <button
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className="bg-[#00c950] text-black font-extrabold text-lg py-3 px-12 rounded-lg shadow-md hover:bg-green-500 transition-colors border-2 border-transparent hover:border-black disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />SALVANDO...</>
          ) : (
            produtoParaEdicao ? "SALVAR ALTERAÇÕES" : "CONFIRMAR"
          )}
        </button>
      </div>

      {isModalOpen && (
        <ImageSearchModal query={description} onClose={() => setIsModalOpen(false)} onSelectImage={(url) => { setSelectedImage(url); setIsModalOpen(false); }} />
      )}
    </div>
  );
};