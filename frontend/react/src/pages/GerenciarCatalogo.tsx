import { useProdutoMetaData } from '../hooks/useProdutoMetaData';
import { ListaMarcas } from '../components/GerenciarCatalogo/ListaMarcas';
import { ListaSubcategorias } from '../components/GerenciarCatalogo/ListaSubcategorias';
import { ListaCategorias } from '../components/GerenciarCatalogo/ListaCategorias';

export default function GerenciarCatalogo() {
    const inputStyle = 'w-full bg-[#fdf2e3] border-2 border-black rounded-lg px-3 py-2 font-bold text-gray-800 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm shrink-0';
    const cardStyle = 'bg-[#e0e0e0] p-6 rounded-2xl shadow-md border border-gray-300 flex flex-col gap-4 h-full';
    const listContainerStyle = 'bg-white border-2 border-black rounded-lg p-3 flex-1 overflow-y-auto flex flex-col gap-2 custom-scrollbar';

    const { categorias, marcas, subcategorias, isLoading, invalidarCache } = useProdutoMetaData();

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

                <ListaCategorias
                    categorias={categorias}
                    isLoading={isLoading}
                    onUpdate={invalidarCache} // Passado como referência da função (sem parênteses!)
                    cardStyle={cardStyle}
                    inputStyle={inputStyle}
                    listContainerStyle={listContainerStyle}
                />

                <ListaSubcategorias
                    subcategorias={subcategorias}
                    categorias={categorias} // Enviamos as categorias para montar o select e as pílulas
                    isLoading={isLoading}
                    onUpdate={invalidarCache} // Passado como referência da função (sem parênteses!)
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
    );
}