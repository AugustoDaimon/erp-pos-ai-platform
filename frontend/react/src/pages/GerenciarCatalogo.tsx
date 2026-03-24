import React, { useState, useEffect } from 'react';
import { useProdutoMetaData } from '../hooks/useProdutoMetaData';
import { categoriaService } from '../services/categoriaService'; // Ajuste o caminho
import { subcategoriaService } from '../services/subcategoriaService';
import { marcaService } from '../services/marcaService'; // NOVO

export default function GerenciarCatalogo() {
    // Estilos padronizados
    const inputStyle =
        'w-full bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm';
    const cardStyle =
        'bg-[#e0e0e0] p-6 rounded-2xl shadow-md border border-gray-300 flex flex-col gap-4 h-full';
    const listContainerStyle =
        'bg-white border-2 border-black rounded-lg p-3 h-[250px] overflow-y-auto flex flex-col gap-2 custom-scrollbar';

    // ==========================================================================
    // ESTADOS
    // ==========================================================================
    const { categorias, marcas, subcategorias, isLoading, invalidarCache } = useProdutoMetaData();

    // ==========================================================================
    // ESTADOS DOS FORMULÁRIOS
    // ==========================================================================
    const [novaCategoria, setNovaCategoria] = useState('');
    const [novaSubcategoria, setNovaSubcategoria] = useState('');
    const [subcatCategoriaId, setSubcatCategoriaId] = useState('');
    const [novaMarca, setNovaMarca] = useState('');
    const [marcaCategorias, setMarcaCategorias] = useState<number[]>([]);

    // ==========================================================================
    // FUNÇÕES DE AÇÃO (Onde você fará os POSTs para sua API no futuro)
    // ==========================================================================
    const handleAddCategoria = async () => {
        if (!novaCategoria.trim()) return;
        try {
            await categoriaService.criar({ nome: novaCategoria });
            
            // Forçar atualização após create
            invalidarCache('categorias');

            setNovaCategoria('');
            alert("Categoria adicionada com sucesso!");
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert("Erro: Já existe uma categoria com este nome.");
            } else {
                alert("Erro ao salvar categoria.");
            }
        }
    };

    const handleAddSubcategoria = async () => {
        if (!novaSubcategoria.trim() || !subcatCategoriaId) return;
        try {
            await subcategoriaService.criar({
                categoria_id: Number(subcatCategoriaId), // Converte a string do select para número
                nome: novaSubcategoria
            });

            invalidarCache('subcategorias');
            setNovaSubcategoria('');
            setSubcatCategoriaId(''); // Limpa dropdown
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert("Erro: Já existe uma subcategoria com este nome DENTRO desta categoria.");
            } else {
                alert("Erro ao salvar subcategoria.");
            }
        }
    };

    const toggleMarcaCategoria = (catId: number) => {
        setMarcaCategorias(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleAddMarca = async () => {
        if (!novaMarca.trim()) return;
        try {
            // Envia o nome e o array de IDs que foram selecionados
            await marcaService.criar({
                nome: novaMarca,
                categorias_vinculadas: marcaCategorias
            });

            invalidarCache('marcas')
            setNovaMarca('');
            setMarcaCategorias([]); // Limpa as pílulas selecionadas
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert("Erro: Esta marca já está cadastrada.");
            } else if (err.response?.status === 422) {
                alert("Erro: Alguma das categorias selecionadas é inválida.");
            } else {
                alert("Erro ao salvar a marca.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8 font-sans flex flex-col items-center">

            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6 w-[95%] max-w-[1800px] shrink-0">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    GERENCIAR CATÁLOGO
                </h1>
                <button className="bg-[#9ad0f5] text-black font-bold py-2 px-8 rounded-lg shadow hover:bg-blue-300 transition border-2 border-transparent hover:border-black">
                    VOLTAR
                </button>
            </div>

            {/* Grid Principal (3 Colunas) */}
            <div className="w-[95%] max-w-[1800px] grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

                {/* ======================= COLUNA 1: CATEGORIAS ======================= */}
                <div className={cardStyle}>
                    <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black text-center">
                        1. CATEGORIAS
                    </h2>

                    <div className="flex flex-col gap-2 mt-2">
                        <input
                            placeholder="Nome da nova categoria"
                            className={inputStyle}
                            value={novaCategoria}
                            onChange={(e) => setNovaCategoria(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleAddCategoria}
                            disabled={isLoading}
                            className="bg-[#00c950] text-black font-bold py-2 rounded-lg shadow hover:bg-green-500 transition border-2 border-transparent hover:border-black disabled:opacity-50"
                        >
                            {isLoading ? 'SALVANDO...' : '+ ADICIONAR CATEGORIA'}
                        </button>
                    </div>

                    <div className="mt-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-700 mb-2">Categorias Cadastradas:</h3>

                        <div className={listContainerStyle}>
                            {categorias.length === 0 && !isLoading && (
                                <p className="text-gray-400 text-center mt-10">Nenhuma categoria encontrada.</p>
                            )}

                            {categorias.map(cat => (
                                <div key={cat.id} className="bg-[#fdf2e3] border border-black rounded px-3 py-2 font-bold flex justify-between items-center">
                                    <span>{cat.nome}</span>
                                    <span className="text-xs text-gray-500 font-normal">ID: {cat.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ======================= COLUNA 2: SUB-CATEGORIAS ======================= */}
                <div className={cardStyle}>
                    <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black shadow-sm text-center">
                        2. SUB-CATEGORIAS
                    </h2>

                    <div className="flex flex-col gap-2 mt-2">
                        {/* Relacionamento 1:N (Dropdown) */}
                        <select
                            className={inputStyle}
                            value={subcatCategoriaId}
                            onChange={(e) => setSubcatCategoriaId(e.target.value)}
                        >
                            <option value="" disabled>Selecione a Categoria...</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>

                        <input
                            placeholder="Nome da sub-categoria"
                            className={inputStyle}
                            value={novaSubcategoria}
                            onChange={(e) => setNovaSubcategoria(e.target.value)}
                        />
                        <button
                            onClick={handleAddSubcategoria}
                            className="bg-[#00c950] text-black font-bold py-2 rounded-lg shadow hover:bg-green-500 transition border-2 border-transparent hover:border-black"
                        >
                            + ADICIONAR SUB-CATEGORIA
                        </button>
                    </div>

                    <div className="mt-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-700 mb-2">Sub-Categorias Cadastradas:</h3>
                        <div className={listContainerStyle}>
                            {subcategorias.map(sub => {
                                // Busca o nome da categoria pai para exibir na pílula
                                const catPai = categorias.find(c => c.id === sub.categoria_id);

                                return (
                                    <div key={sub.id} className="bg-[#fdf2e3] border border-black rounded px-3 py-2 flex flex-col">
                                        <span className="font-bold">{sub.nome}</span>
                                        <span className="text-xs text-blue-600 font-bold">
                                            📂 {catPai?.nome || 'Categoria Desconhecida'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ======================= COLUNA 3: MARCAS ======================= */}
                <div className={cardStyle}>
                    <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black shadow-sm text-center">
                        3. MARCAS
                    </h2>

                    <div className="flex flex-col gap-2 mt-2">
                        <input
                            placeholder="Nome da marca (Ex: Shimano)"
                            className={inputStyle}
                            value={novaMarca}
                            onChange={(e) => setNovaMarca(e.target.value)}
                        />

                        {/* Relacionamento N:N (Pílulas Multi-select) */}
                        <div className="bg-white border-2 border-black rounded-lg p-3">
                            <span className="text-sm font-bold text-gray-700 block mb-2">Vincular às Categorias:</span>
                            <div className="flex flex-wrap gap-2">
                                {categorias.map(cat => {
                                    const isSelected = marcaCategorias.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleMarcaCategoria(cat.id)}
                                            className={`text-sm font-bold px-3 py-1 rounded-full border-2 border-black transition-colors ${isSelected ? 'bg-blue-500 text-white' : 'bg-[#fdf2e3] text-gray-700 hover:bg-blue-200'
                                                }`}
                                        >
                                            {isSelected ? '✓ ' : '+ '}{cat.nome}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={handleAddMarca}
                            className="bg-[#00c950] text-black font-bold py-2 rounded-lg shadow hover:bg-green-500 transition border-2 border-transparent hover:border-black"
                        >
                            + ADICIONAR MARCA
                        </button>
                    </div>

                    <div className="mt-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-700 mb-2">Marcas Cadastradas:</h3>
                        <div className={listContainerStyle}>

                            {/* 1. O LOOP PRINCIPAL (Aqui nasce a variável "marca") */}
                            {marcas.map(marca => (
                                <div key={marca.id} className="bg-[#fdf2e3] border border-black rounded px-3 py-2 flex flex-col gap-1">
                                    <span className="font-bold text-lg leading-none">{marca.nome}</span>

                                    {/* 2. O LOOP SECUNDÁRIO (Aqui nasce a variável "catId") */}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {/* Note o _vinculadas com underline aqui! */}
                                        {marca.categorias_vinculadas.map(catId => {
                                            const cat = categorias.find(c => c.id === catId);
                                            return cat ? (
                                                <span key={catId} className="bg-blue-100 border border-blue-400 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {cat.nome}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}