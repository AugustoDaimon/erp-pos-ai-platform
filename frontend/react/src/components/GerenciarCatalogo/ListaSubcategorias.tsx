import React, { useState } from 'react';
// Ajuste os caminhos de importação conforme o seu projeto
import { subcategoriaService } from '../../services/subcategoriaService'; 
import type { Categoria } from '../../services/types/Categoria'; 
import type { Subcategoria } from '../../services/types/Subcategoria'; 

interface ListaSubcategoriasProps {
    subcategorias: Subcategoria[];
    categorias: Categoria[]; 
    isLoading: boolean;
    onUpdate: (tipo: string) => void; 
    cardStyle: string;
    inputStyle: string;
    listContainerStyle: string;
}

export function ListaSubcategorias({
    subcategorias,
    categorias,
    isLoading,
    onUpdate,
    cardStyle,
    inputStyle,
    listContainerStyle
}: ListaSubcategoriasProps) {

    // ==========================================
    // ESTADOS LOCAIS
    // ==========================================
    const [novaSubcategoria, setNovaSubcategoria] = useState('');
    const [subcatCategoriaId, setSubcatCategoriaId] = useState('');

    // ==========================================
    // LÓGICA DE FILTRAGEM E ORDENAÇÃO
    // ==========================================
    const subcategoriasFiltradasEOrdenadas = subcategorias
        // 1. Filtra pela categoria selecionada (se não houver nada selecionado, mostra todas)
        .filter(sub => subcatCategoriaId ? sub.categoria_id === Number(subcatCategoriaId) : true)
        // 2. Ordena em ordem alfabética
        .sort((a, b) => a.nome.localeCompare(b.nome));

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleAddSubcategoria = async () => {
        // Alerta amigável caso ele tente adicionar sem selecionar a categoria pai
        if (!subcatCategoriaId) {
            alert("Por favor, selecione uma categoria no dropdown para vincular a nova sub-categoria.");
            return;
        }

        if (!novaSubcategoria.trim()) return;
        
        try {
            await subcategoriaService.criar({
                categoria_id: Number(subcatCategoriaId), 
                nome: novaSubcategoria
            });

            onUpdate('subcategorias'); 
            setNovaSubcategoria('');
            // Opcional: Não vamos limpar o setSubcatCategoriaId('') para que 
            // o usuário continue vendo a lista filtrada que ele acabou de adicionar!
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert("Erro: Já existe uma subcategoria com este nome DENTRO desta categoria.");
            } else {
                alert("Erro ao salvar subcategoria.");
            }
        }
    };

    const handleDeleteSubcategoria = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta subcategoria?");
        if (!confirmar) return;

        try {
            await subcategoriaService.deletar(id);
            onUpdate('subcategorias');
        } catch (error: any) {
            console.error("Erro ao deletar subcategoria:", error);
            const msgErro = error.response?.data?.erro || "Não foi possível excluir esta subcategoria. Ela pode estar em uso.";
            alert(msgErro);
        }
    };

    const handleEditSubcategoria = async (subcategoriaAtual: Subcategoria) => {
        const novoNome = window.prompt("Digite o novo nome para a subcategoria:", subcategoriaAtual.nome);

        if (!novoNome || novoNome.trim() === "" || novoNome === subcategoriaAtual.nome) {
            return;
        }

        try {
            await subcategoriaService.atualizar(subcategoriaAtual.id, {
                nome: novoNome.trim()
            });

            onUpdate('subcategorias');
        } catch (error) {
            console.error("Erro ao atualizar subcategoria:", error);
            alert("Falha ao atualizar o nome da subcategoria. Tente novamente.");
        }
    };

    // ==========================================
    // RENDERIZAÇÃO
    // ==========================================
    return (
        <div className={cardStyle}>
            <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black shadow-sm text-center shrink-0">
                SUB-CATEGORIAS
            </h2>

            {/* Formulário de Adição */}
            <div className="flex flex-col gap-2 mt-2 h-[260px] shrink-0">
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                    <select
                        className={inputStyle}
                        value={subcatCategoriaId}
                        onChange={(e) => setSubcatCategoriaId(e.target.value)}
                    >
                        {/* Removido o disabled para permitir resetar o filtro */}
                        <option value="">-- Mostrar Todas Categorias --</option>
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
                </div>
                <button
                    onClick={handleAddSubcategoria}
                    className="mt-auto shrink-0 bg-[#00c950] text-black font-bold py-2 rounded-lg shadow hover:bg-green-500 transition border-2 border-transparent hover:border-black"
                >
                    + ADICIONAR SUB-CATEGORIA
                </button>
            </div>

            {/* Listagem */}
            <div className="mt-4 flex-1 flex flex-col overflow-hidden">
                <h3 className="font-bold text-gray-700 mb-2 shrink-0">Sub-Categorias Cadastradas:</h3>
                <div className={listContainerStyle}>

                    {/* Mudança: verificando o array filtrado */}
                    {subcategoriasFiltradasEOrdenadas.length === 0 && !isLoading && (
                        <p className="text-gray-400 text-center mt-10">Nenhuma subcategoria encontrada.</p>
                    )}

                    {/* Mudança: mapeando o array filtrado */}
                    {subcategoriasFiltradasEOrdenadas.map(sub => {
                        const catPai = categorias.find(c => c.id === sub.categoria_id);

                        return (
                            <div key={sub.id} className="bg-[#fdf2e3] border border-black rounded px-3 py-2 flex justify-between items-center group hover:shadow-sm transition-shadow">

                                {/* Lado Esquerdo: Nome da Subcategoria + Categoria Pai */}
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="font-bold truncate" title={sub.nome}>{sub.nome}</span>
                                    <span className="text-xs text-blue-600 font-bold truncate">
                                        📂 {catPai?.nome || 'Categoria Desconhecida'}
                                    </span>
                                </div>

                                {/* Lado Direito: ID + Ações */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <span className="text-xs text-gray-500 font-normal hidden sm:block">
                                        ID: {sub.id}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditSubcategoria(sub)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                            title="Editar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubcategoria(sub.id)}
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
}