import { useEffect, useState } from 'react';
import AutocompleteInput from '../AutoCompleteInput';
import { ImageSearchModal } from './ImageSearchModal';
import { SecaoEstoqueValores } from './SecaoEstoqueValores';
import { SecaoHistoricoCompras } from './SecaoHistoricoCompras';
import { useProdutoMetaData } from '../../hooks/useProdutoMetaData';
import { produtoService } from '../../services/produtoService';
import { InputLockButton } from './InputLockButton';
import { ModalGerenciarCatalogo } from './ModalGerenciarCatalogo';

// 1. Estado Inicial Único (Fonte da Verdade)
const initialFormData = {
  // Informações Básicas
  categoria: '',
  subcategoria: '',
  marca: '',
  especificacao1: '',
  especificacao2: '',
  especificacao3: '',
  observacao: '',
  sku: '',

  // Financeiro e Estoque
  venda: '',
  instalacao: '',
  custo: '',
  lucroR: '',
  lucroP: '',
  estoqueAtual: '',
  estoqueMinimo: ''
};

export const FormCadastroProduto = () => {
  const [activeTab, setActiveTab] = useState<'estoque' | 'historico'>('estoque');
  const [isModalCatalogoAberto, setIsModalCatalogoAberto] = useState(false);

  const { categorias, marcas, subcategorias, isLoading } = useProdutoMetaData();
  const categoriasOptions = categorias.map(c => c.nome);
  const marcasOptions = marcas.map(m => m.nome);
  const subcategoriasOptions = subcategorias.map(s => s.nome);

  // Estados Isolados para UI
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ESTADO UNIFICADO DOS DADOS DO FORMULÁRIO
  const [formData, setFormData] = useState(initialFormData);
  const [formKey, setFormKey] = useState(0);

  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({});

  const toggleLock = (field: string) => {
    setLockedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // ATUALIZADO: Função que limpa os dados
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

  // Montagem Automática da Descrição
  useEffect(() => {
    const { categoria, subcategoria, marca, especificacao1, especificacao2, especificacao3 } = formData;
    const partes = [categoria, subcategoria, marca, especificacao1, especificacao2, especificacao3]
      .filter(texto => texto && texto.trim() !== "");

    const novaSugestao = partes.join(' ');

    if (novaSugestao) {
      setDescription(novaSugestao);
    }
  }, [formData]);

  // Função auxiliar para atualizar o estado unificado
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field as keyof typeof initialFormData]: value }));
  };

  const inputStyle = 'bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm';
  const labelStyle = "text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider";

  // Estado para evitar cliques duplos enquanto salva
  const [isSubmitting, setIsSubmitting] = useState(false);

  // IMPORTANTE: Importe o produtoService no topo do arquivo!
  // import { produtoService } from '../../services/produtoService';

  const handleConfirmar = async () => {
    // 1. Validação Básica
    if (!description.trim()) {
      alert("A descrição do produto é obrigatória.");
      return;
    }

    // Tratamento de conversão de moeda (troca vírgula por ponto para o JavaScript entender)
    const valorVenda = parseFloat(formData.venda.replace(',', '.')) || 0;

    if (valorVenda <= 0) {
      alert("O Valor de Venda é obrigatório e deve ser maior que zero.");
      return;
    }

    // 2. "Pescar" os IDs correspondentes aos nomes digitados
    const categoriaId = categorias.find(c => c.nome === formData.categoria)?.id || null;
    const subcategoriaId = subcategorias.find(s => s.nome === formData.subcategoria)?.id || null;
    const marcaId = marcas.find(m => m.nome === formData.marca)?.id || null;

    // 3. Montar o Objeto exato que sua API (CreateProdutoRequest) espera
    const payload = {
      descricao: description, // Usamos a variável description pois o usuário pode ter editado na mão
      valor_venda: valorVenda,
      categoria_id: categoriaId,
      subcategoria_id: subcategoriaId,
      marca_id: marcaId,
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

    // 4. Enviar para o Backend
    try {
      setIsSubmitting(true);
      await produtoService.criar(payload);

      alert("Sucesso! Produto cadastrado no estoque.");

      // Limpa o formulário automaticamente para o próximo cadastro
      resetarFormulario();

    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao salvar. Verifique os dados ou a conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#e0e0e0] p-6 lg:p-8 rounded-2xl shadow-md border border-gray-300 w-[95%] max-w-[1800px] flex-1 flex flex-col relative">

      {/** Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-2xl">
          <p className="font-bold text-blue-600 animate-pulse">Sincronizando catálogo...</p>
        </div>
      )}

      {/* Input de Descrição */}
      <div className="mb-6">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do Produto..."
          className="w-full h-14 bg-white rounded-lg px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-lg"
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 xl:w-2/3">
          {/* CATEGORIA */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              {/* Agrupamos a Label e o botão de Adicionar */}
              <div className="flex items-center gap-2">
                <label className={labelStyle}>Categoria</label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none font-medium transition-colors"
                  onClick={() => setIsModalCatalogoAberto(true)}
                >
                  + Adicionar Novo (Categoria/Marca)
                </button>
                <ModalGerenciarCatalogo
                  isOpen={isModalCatalogoAberto}
                  onClose={() => setIsModalCatalogoAberto(false)}
                />
              </div>

              {/* O cadeado continua isolado na direita pelo justify-between */}
              <InputLockButton
                locked={!!lockedFields.categoria}
                onClick={() => toggleLock('categoria')}
              />
            </div>

            <AutocompleteInput
              key={lockedFields.categoria ? 'locked-categoria' : `${formKey}-categoria`}
              placeholder=""
              options={categoriasOptions}
              onSelect={(val) => handleInputChange('categoria', val)}
            />
          </div>

          {/* SUB-CATEGORIA */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className={labelStyle}>Sub-Categoria</label>
              <InputLockButton locked={!!lockedFields.subcategoria} onClick={() => toggleLock('subcategoria')} />
            </div>
            <AutocompleteInput
              key={lockedFields.subcategoria ? 'locked-subcat' : `${formKey}-subcategoria`}
              placeholder=""
              options={subcategoriasOptions}
              onSelect={(val) => handleInputChange('subcategoria', val)}
            />
          </div>

          {/* MARCA */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className={labelStyle}>Marca</label>
              <InputLockButton locked={!!lockedFields.marca} onClick={() => toggleLock('marca')} />
            </div>
            <AutocompleteInput
              key={lockedFields.marca ? 'locked-marca' : `${formKey}-marca`}
              placeholder=""
              options={marcasOptions}
              onSelect={(val) => handleInputChange('marca', val)}
            />
          </div>

          <input placeholder="Especificação 1" value={formData.especificacao1} className={inputStyle} onChange={(e) => handleInputChange('especificacao1', e.target.value)} />
          <input placeholder="Especificação 2" value={formData.especificacao2} className={inputStyle} onChange={(e) => handleInputChange('especificacao2', e.target.value)} />
          <input placeholder="Especificação 3" value={formData.especificacao3} className={inputStyle} onChange={(e) => handleInputChange('especificacao3', e.target.value)} />

          {/* CORRIGIDO: Adicionado onChange no SKU e Observação */}
          <input placeholder="SKU/Código Interno" value={formData.sku} className={inputStyle} onChange={(e) => handleInputChange('sku', e.target.value)} />
          <input placeholder="Observação/Local Guardado" value={formData.observacao} className={`${inputStyle} md:col-span-2`} onChange={(e) => handleInputChange('observacao', e.target.value)} />
        </div>

        {/* Botão de Busca de Imagem */}
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

      {/* Seção Inferior: Navegação de Abas */}
      <div className="flex gap-4 mb-4 border-b-2 border-gray-400">
        <button
          onClick={() => setActiveTab('estoque')}
          className={`pb-2 px-4 font-bold transition-all ${activeTab === 'estoque'
            ? 'border-b-4 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          ESTOQUE E VALORES
        </button>
        <button
          title='EM MANUTENÇÃO!'
          className={`pb-2 px-4 font-bold transition-all ${activeTab === 'historico'
            ? 'border-b-4 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          HISTÓRICO DE COMPRAS
        </button>
      </div>

      {/* Conteúdo Dinâmico das Abas */}
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

      {/* Botões do Rodapé */}
      <div className="flex justify-end gap-4 mt-8 border-t pt-6">
        <button onClick={handleBotaoLimpar} className="px-6 py-3 bg-red-100 text-red-600 font-bold rounded-xl border-2 border-red-200 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-xs">
          Limpar Formulário
        </button>
        <button
          onClick={handleConfirmar}
          disabled={isSubmitting} // Para não duplicar envio
          className="bg-[#00c950] text-black font-extrabold text-lg py-3 px-12 rounded-lg shadow-md hover:bg-green-500 transition-colors border-2 border-transparent hover:border-black disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              SALVANDO...
            </>
          ) : (
            "CONFIRMAR"
          )}
        </button>
      </div>

      {/* Modal de Busca */}
      {isModalOpen && (
        <ImageSearchModal
          query={description}
          onClose={() => setIsModalOpen(false)}
          onSelectImage={(url) => { setSelectedImage(url); setIsModalOpen(false); }}
        />
      )}
    </div>
  );
};