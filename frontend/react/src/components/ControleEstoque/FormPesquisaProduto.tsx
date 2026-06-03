import { useState, useEffect } from 'react';
import { useProdutoMetaData } from '../../hooks/useProdutoMetaData';
import { produtoService } from '../../services/produtoService';
import type { Produto } from '../../services/types/Produto';
import { Image as Pencil, PencilIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FormPesquisaProduto = () => {
  const { categorias, subcategorias, marcas } = useProdutoMetaData();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroSubcategoria, setFiltroSubcategoria] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [apenasEstoqueBaixo, setApenasEstoqueBaixo] = useState(false);

  const inputStyle = 'bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full';
  const labelStyle = 'text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider block mb-1';

  const navigate = useNavigate();

  useEffect(() => {
    const carregarProdutos = async () => {
      setIsLoading(true);
      try {
        const data = await produtoService.listar();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((prod) => {
    const termo = busca.toLowerCase();
    const matchBusca = prod.descricao.toLowerCase().includes(termo) || (prod.sku && prod.sku.toLowerCase().includes(termo));

    const matchCategoria = filtroCategoria ? prod.categoria_id === Number(filtroCategoria) : true;
    const matchSubcategoria = filtroSubcategoria ? prod.subcategoria_id === Number(filtroSubcategoria) : true;
    const matchMarca = filtroMarca ? prod.marca_id === Number(filtroMarca) : true;

    const matchEstoque = apenasEstoqueBaixo ? prod.estoque_atual <= prod.estoque_minimo : true;

    return matchBusca && matchCategoria && matchSubcategoria && matchMarca && matchEstoque;
  });

  const handleEditar = (produtoSelecionado: Produto) => {
    navigate('/estoque', { state: { produtoParaEdicao: produtoSelecionado } });
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    
    try {
      await produtoService.deletar(id);
      
      setProdutos(prev => prev.filter(p => p.id !== id));
      
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir o produto. Ele pode estar vinculado a um pedido existente.");
    }
  };
  const limparFiltros = () => {
    setBusca('');
    setFiltroCategoria('');
    setFiltroSubcategoria('');
    setFiltroMarca('');
    setApenasEstoqueBaixo(false);
  };

  return (
    <div className="bg-[#e0e0e0] p-6 lg:p-8 rounded-2xl shadow-md border border-gray-300 w-[95%] max-w-[1800px] mx-auto flex-1 flex flex-col relative mt-6">

      <div className="bg-white/40 p-4 rounded-xl border border-gray-300 mb-6 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Pesquisar por Descrição ou SKU..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full h-12 bg-white rounded-lg px-4 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-gray-700"
            />
          </div>

          <button
            onClick={() => setApenasEstoqueBaixo(!apenasEstoqueBaixo)}
            className={`shrink-0 px-6 h-12 rounded-lg border-2 border-black font-bold uppercase text-xs tracking-wider transition-colors flex items-center gap-2 ${apenasEstoqueBaixo
              ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              : 'bg-[#fdf2e3] text-gray-700 hover:bg-red-100'
              }`}
          >
            <div className={`w-3 h-3 rounded-full border border-black ${apenasEstoqueBaixo ? 'bg-white' : 'bg-red-500'}`} />
            Estoque Abaixo do Mínimo
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className={labelStyle}>Categoria</label>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className={inputStyle}>
              <option value="">Todas as Categorias</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className={labelStyle}>Sub-Categoria</label>
            <select value={filtroSubcategoria} onChange={(e) => setFiltroSubcategoria(e.target.value)} className={inputStyle}>
              <option value="">Todas as Sub-Categorias</option>
              {subcategorias
                .filter(s => filtroCategoria ? s.categoria_id === Number(filtroCategoria) : true)
                .map(s => <option key={s.id} value={s.id}>{s.nome}</option>)
              }
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className={labelStyle}>Marca</label>
            <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className={inputStyle}>
              <option value="">Todas as Marcas</option>
              {marcas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>

          <button
            onClick={limparFiltros}
            className="shrink-0 h-[40px] px-4 bg-gray-200 text-gray-600 font-bold rounded-lg border-2 border-gray-400 hover:bg-gray-300 transition-colors uppercase text-[10px] tracking-wider"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border-2 border-black shadow-sm flex-1 flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="border-b-2 border-black text-gray-700 uppercase text-[11px] font-black tracking-wider">
              <th className="p-4 w-32">SKU</th>
              <th className="p-4">Descrição do Produto</th>
              <th className="p-4 w-32">Custo (R$)</th>
              <th className="p-4 w-32">Venda (R$)</th>
              <th className="p-4 w-24 text-center">Estoque</th>
              <th className="p-4 w-32 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-blue-600 font-bold animate-pulse">
                  Carregando produtos...
                </td>
              </tr>
            ) : produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((prod) => {
                const estoqueAlerta = prod.estoque_atual <= prod.estoque_minimo;

                return (
                  <tr key={prod.id} className={`border-b border-gray-300 hover:bg-blue-50 transition-colors ${estoqueAlerta ? 'bg-red-50/50' : ''}`}>

                    <td className="p-4 font-bold text-gray-500 text-xs">{prod.sku || 'N/A'}</td>

                    <td className="p-4 font-bold text-gray-800 text-sm">
                      <div
                        className="flex items-center gap-2 w-fit cursor-default"
                        onMouseEnter={() => prod.imagem_url ? setPreviewImage(prod.imagem_url) : null}
                        onMouseLeave={() => setPreviewImage(null)}
                      >
                        {prod.imagem_url && (
                          <span>{prod.descricao}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-red-700 text-sm">
                      {prod.custo_compra?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </td>

                    <td className="p-4 font-bold text-green-700 text-sm">
                      {prod.valor_venda?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`font-black text-sm px-3 py-1 rounded-full border ${estoqueAlerta
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-green-100 border-green-500 text-green-700'
                        }`}>
                        {prod.estoque_atual}
                      </span>
                    </td>

                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEditar(prod)}
                        className="bg-blue-100 text-blue-700 p-2 rounded border border-blue-300 hover:bg-blue-600 hover:text-white transition"
                        title="Editar"
                      >
                        <PencilIcon size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleExcluir(prod.id)}
                        className="bg-red-100 text-red-700 p-2 rounded border border-red-300 hover:bg-red-600 hover:text-white transition"
                        title="Excluir"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500 font-bold">
                  Nenhum produto encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <div className="fixed bottom-8 right-8 z-[9999] bg-white border-2 border-black rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-3 w-72 pointer-events-none transition-opacity animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#f8fafc] rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-56 object-contain"
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
              Visualização
            </span>
          </div>
        </div>
      )}

    </div>
  );
};