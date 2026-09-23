import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProdutoMetaData } from './useProdutoMetaData';
import { produtoService } from '../services/produtoService';
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

export const useProdutoForm = (produtoParaEdicao?: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categorias, marcas, subcategorias, isLoading } = useProdutoMetaData();

  const [formData, setFormData] = useState(initialFormData);
  const [formKey, setFormKey] = useState(0);
  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({});
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derivando opções filtradas baseadas na categoria selecionada
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

  // Efeito: Preencher dados no modo de edição
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

  // Efeito: Gerar descrição automaticamente
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
      const produtosExistentes = await produtoService.listar({ categoria_id: catId, marca_id: marcaId });
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

    const payload = {
      descricao: description,
      valor_venda: valorVenda,
      categoria_id: categorias.find(c => c.nome === formData.categoria)?.id || null,
      subcategoria_id: subcategorias.find(s => s.nome === formData.subcategoria)?.id || null,
      marca_id: marcas.find(m => m.nome === formData.marca)?.id || null,
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

  return {
    formData, formKey, lockedFields, description, setDescription,
    selectedImage, setSelectedImage, isLoading, isGeneratingSKU, isSubmitting,
    categoriasOptions, subcategoriasOptions, marcasOptions,
    handleInputChange, toggleLock, handleBotaoLimpar, handleGenerateSKU, handleConfirmar
  };
};