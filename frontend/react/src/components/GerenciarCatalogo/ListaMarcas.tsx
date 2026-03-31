import React, { useState } from 'react';
import { marcaService } from '../../services/marcaService'; // Ensure this path is correct
import type { Categoria } from '../../services/types/Categoria'; // Ensure this path is correct
import type { Marca } from '../../services/types/Marca'; // Ensure this path is correct

interface ListaMarcasProps {
    marcas: Marca[];
    categorias: Categoria[];
    isLoading: boolean;
    onUpdate: (tipo: string) => void;
    cardStyle: string; // Passed down to maintain styling consistency
    inputStyle: string;
    listContainerStyle: string;
}

export function ListaMarcas({
    marcas,
    categorias,
    isLoading,
    onUpdate,
    cardStyle,
    inputStyle,
    listContainerStyle
}: ListaMarcasProps) {

    // ==========================================
    // ESTADOS LOCAIS
    // ==========================================
    const [novaMarca, setNovaMarca] = useState('');
    const [marcaCategorias, setMarcaCategorias] = useState<number[]>([]);

    // ==========================================
    // HANDLERS
    // ==========================================
    const toggleMarcaCategoria = (catId: number) => {
        setMarcaCategorias(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleAddMarca = async () => {
        if (!novaMarca.trim()) return;
        try {
            await marcaService.criar({
                nome: novaMarca,
                categorias_vinculadas: marcaCategorias
            });

            onUpdate('marcas'); // Invalidates the cache in the parent component
            setNovaMarca('');
            setMarcaCategorias([]);
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

    const handleDeleteMarca = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta marca?");
        if (!confirmar) return;

        try {
            await marcaService.deletar(id);
            onUpdate('marcas');
        } catch (error: any) {
            console.error("Erro ao deletar marca:", error);
            const msgErro = error.response?.data?.erro || "Não foi possível excluir esta marca. Ela pode estar em uso.";
            alert(msgErro);
        }
    };

    const handleEditMarca = async (marcaAtual: Marca) => {
        const novoNome = window.prompt("Digite o novo nome para a marca:", marcaAtual.nome);

        if (!novoNome || novoNome.trim() === "" || novoNome === marcaAtual.nome) {
            return;
        }

        try {
            await marcaService.atualizar(marcaAtual.id, {
                nome: novoNome.trim()
            });

            onUpdate('marcas');
        } catch (error) {
            console.error("Erro ao atualizar marca:", error);
            alert("Falha ao atualizar o nome da marca. Tente novamente.");
        }
    };

    // ==========================================
    // RENDERIZAÇÃO
    // ==========================================
    return (
        <div className={cardStyle}>
            <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black shadow-sm text-center">
                3. MARCAS
            </h2>

            {/* Fórmulario de Adição */}
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

            {/* Listagem */}
            <div className="mt-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-700 mb-2">Marcas Cadastradas:</h3>
                <div className={listContainerStyle}>

                    {marcas.length === 0 && !isLoading && (
                        <p className="text-gray-400 text-center mt-10">Nenhuma marca encontrada.</p>
                    )}

                    {marcas.map(marca => (
                        <div key={marca.id} className="bg-[#fdf2e3] border border-black rounded px-3 py-2 flex justify-between items-start group hover:shadow-sm transition-shadow">

                            {/* Lado Esquerdo: Nome da Marca e Tags das Categorias */}
                            <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                                <span className="font-bold text-lg leading-none truncate" title={marca.nome}>
                                    {marca.nome}
                                </span>

                                <div className="flex flex-wrap gap-1 mt-1">
                                    {marca.categorias_vinculadas?.map(catId => {
                                        const cat = categorias.find(c => c.id === catId);
                                        return cat ? (
                                            <span 
                                                key={catId} 
                                                className="bg-blue-100 border border-blue-400 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                                            >
                                                {cat.nome}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Lado Direito: ID + Ações */}
                            <div className="flex items-center gap-4 ml-2 mt-0.5 flex-shrink-0">
                                <span className="text-xs text-gray-500 font-normal hidden sm:block">
                                    ID: {marca.id}
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEditMarca(marca)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                        title="Editar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteMarca(marca.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                        title="Deletar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}