import React from 'react';
import { useProdutoMetaData } from '../../hooks/useProdutoMetaData';
import { ListaMarcas } from '../GerenciarCatalogo/ListaMarcas';
import { ListaSubcategorias } from '../GerenciarCatalogo/ListaSubcategorias';
import { ListaCategorias } from '../GerenciarCatalogo/ListaCategorias';

// 1. Definimos as propriedades que controlam o Modal
interface GerenciarCatalogoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ModalGerenciarCatalogo({ isOpen, onClose }: GerenciarCatalogoModalProps) {
    // 2. Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    // Estilos padronizados (Mantivemos a sua identidade visual)
    const inputStyle =
        'w-full bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm';
    const cardStyle =
        'bg-[#e0e0e0] p-6 rounded-2xl shadow-md border border-gray-300 flex flex-col gap-4 h-full';
    const listContainerStyle =
        'bg-white border-2 border-black rounded-lg p-3 h-[250px] overflow-y-auto flex flex-col gap-2 custom-scrollbar';

    const { categorias, marcas, subcategorias, isLoading, invalidarCache } = useProdutoMetaData();

    // 3. Função para fechar clicando no fundo escuro (Overlay)
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        // OVERLAY: Fundo escuro semi-transparente que cobre a tela toda
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
            onClick={handleOverlayClick}
        >
            {/* JANELA DO MODAL: Container principal */}
            <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-[1600px] max-h-[95vh] flex flex-col overflow-hidden border-4 border-black animate-fade-in-up">
                
                {/* Cabeçalho do Modal (Fixo no topo) */}
                <div className="flex justify-between items-center p-6 bg-white border-b-2 border-black shrink-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
                        GERENCIAR CATÁLOGO RÁPIDO
                    </h1>
                    <button 
                        onClick={onClose}
                        className="bg-red-100 text-red-700 font-bold py-2 px-6 rounded-lg shadow hover:bg-red-200 transition border-2 border-red-700 hover:text-red-900"
                    >
                        FECHAR (X)
                    </button>
                </div>

                {/* Corpo do Modal (Rolável caso a tela seja pequena) */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    
                    {/* Grid Principal (3 Colunas) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <ListaCategorias
                            categorias={categorias}
                            isLoading={isLoading}
                            onUpdate={invalidarCache} 
                            cardStyle={cardStyle}
                            inputStyle={inputStyle}
                            listContainerStyle={listContainerStyle}
                        />

                        <ListaSubcategorias
                            subcategorias={subcategorias}
                            categorias={categorias} 
                            isLoading={isLoading}
                            onUpdate={invalidarCache} 
                            cardStyle={cardStyle}
                            inputStyle={inputStyle}
                            listContainerStyle={listContainerStyle}
                        />

                        <ListaMarcas
                            marcas={marcas}
                            categorias={categorias}
                            isLoading={isLoading}
                            onUpdate={invalidarCache}
                            cardStyle={cardStyle}
                            inputStyle={inputStyle}
                            listContainerStyle={listContainerStyle}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}