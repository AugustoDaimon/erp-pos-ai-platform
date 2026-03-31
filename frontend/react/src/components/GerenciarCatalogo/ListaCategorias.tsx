import React, { useState } from 'react';
// Ajuste os caminhos de importação conforme o seu projeto
import { categoriaService } from '../../services/categoriaService'; 
import type { Categoria } from '../../services/types/Categoria'; 

interface ListaCategoriasProps {
    categorias: Categoria[];
    isLoading: boolean;
    onUpdate: (tipo: string) => void;
    cardStyle: string;
    inputStyle: string;
    listContainerStyle: string;
}

export function ListaCategorias({
    categorias,
    isLoading,
    onUpdate,
    cardStyle,
    inputStyle,
    listContainerStyle
}: ListaCategoriasProps) {

    // ==========================================
    // ESTADOS LOCAIS
    // ==========================================
    const [novaCategoria, setNovaCategoria] = useState('');

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleAddCategoria = async () => {
        if (!novaCategoria.trim()) return;
        try {
            await categoriaService.criar({ nome: novaCategoria });

            // Forçar atualização após create avisando o componente Pai
            onUpdate('categorias');

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

    const handleDeleteCategoria = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta categoria?");
        if (!confirmar) return;

        try {
            // 1. Deleta no banco de dados (Flask)
            await categoriaService.deletar(id);

            // 2. A Mágica: Força o seu hook a refazer o GET e atualizar a tela sozinho!
            onUpdate('categorias');

        } catch (error: any) {
            console.error("Erro ao deletar categoria:", error);
            const msgErro = error.response?.data?.erro || "Não foi possível excluir esta categoria. Ela pode estar em uso.";
            alert(msgErro);
        }
    };

    const handleEditCategoria = async (categoriaAtual: Categoria) => {
        const novoNome = window.prompt("Digite o novo nome para a categoria:", categoriaAtual.nome);

        if (!novoNome || novoNome.trim() === "" || novoNome === categoriaAtual.nome) {
            return;
        }

        try {
            // 1. Atualiza no banco de dados (Flask)
            await categoriaService.atualizar(categoriaAtual.id, {
                nome: novoNome.trim()
            });

            // 2. Avisa o hook para buscar a lista atualizada com o novo nome
            onUpdate('categorias');

        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            alert("Falha ao atualizar o nome da categoria. Tente novamente.");
        }
    };

    // ==========================================
    // RENDERIZAÇÃO
    // ==========================================
    return (
        <div className={cardStyle}>
            <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black text-center">
                1. CATEGORIAS
            </h2>

            {/* Fórmulario de Adição */}
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

            {/* Listagem */}
            <div className="mt-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-700 mb-2">Categorias Cadastradas:</h3>

                <div className={listContainerStyle}>
                    {categorias.length === 0 && !isLoading && (
                        <p className="text-gray-400 text-center mt-10">Nenhuma categoria encontrada.</p>
                    )}

                    {categorias.map(cat => (
                        <div key={cat.id} className="bg-[#fdf2e3] border border-black rounded px-3 py-2 font-bold flex justify-between items-center group">
                            
                            {/* Lado Esquerdo: Nome da Categoria */}
                            <span className="truncate">{cat.nome}</span>

                            {/* Lado Direito: ID + Ações */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <span className="text-xs text-gray-500 font-normal hidden sm:block">
                                    ID: {cat.id}
                                </span>

                                <div className="flex items-center gap-2">
                                    {/* Botão de Editar (Lápis) */}
                                    <button
                                        type="button"
                                        onClick={() => handleEditCategoria(cat)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                        title="Editar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                    </button>

                                    {/* Botão de Deletar (X ou Lixeira) */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategoria(cat.id)}
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