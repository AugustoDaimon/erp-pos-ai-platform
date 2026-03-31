import React, { useState } from 'react';
// Ajuste os caminhos de importação conforme o seu projeto
import { subcategoriaService } from '../../services/subcategoriaService'; 
import type { Categoria } from '../../services/types/Categoria'; 
import type { Subcategoria } from '../../services/types/Subcategoria'; 

interface ListaSubcategoriasProps {
    subcategorias: Subcategoria[];
    categorias: Categoria[]; // Necessário para o Select de vínculo e para exibir o nome na lista
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
    // HANDLERS
    // ==========================================
    const handleAddSubcategoria = async () => {
        if (!novaSubcategoria.trim() || !subcatCategoriaId) return;
        
        try {
            await subcategoriaService.criar({
                categoria_id: Number(subcatCategoriaId), // Converte a string do select para número
                nome: novaSubcategoria
            });

            onUpdate('subcategorias'); // Avisa o Pai para recarregar o cache
            setNovaSubcategoria('');
            setSubcatCategoriaId(''); // Limpa o dropdown
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
            // Enviando a atualização para a API
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
            <h2 className="text-xl font-extrabold text-black bg-white py-2 px-4 rounded-lg border-2 border-black shadow-sm text-center">
                2. SUB-CATEGORIAS
            </h2>

            {/* Formulário de Adição */}
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

            {/* Listagem */}
            <div className="mt-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-700 mb-2">Sub-Categorias Cadastradas:</h3>
                <div className={listContainerStyle}>

                    {subcategorias.length === 0 && !isLoading && (
                        <p className="text-gray-400 text-center mt-10">Nenhuma subcategoria encontrada.</p>
                    )}

                    {subcategorias.map(sub => {
                        // Busca o nome da categoria pai para exibir na pílula
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
                                        {/* Botão de Editar (Lápis) */}
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

                                        {/* Botão de Deletar (X) */}
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