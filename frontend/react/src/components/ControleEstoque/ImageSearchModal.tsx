import React, { useEffect, useState } from 'react';
import { imageService } from '../../services/imageService';
import { type ProductImage } from '../../services/types/Image';

interface Props {
  query: string;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export const ImageSearchModal: React.FC<Props> = ({ query, onClose, onSelectImage }) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      // Se a descrição estiver vazia ou for apenas espaços, limpa os resultados e não busca
      if (!query || query.trim().length === 0) {
        setImages([]);
        return;
      }

      setLoading(true);
      try {
        const data = await imageService.buscarImagens({ description: query });
        setImages(data);
      } catch (err) {
        console.error("Erro ao buscar imagens:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [query]);

  // Constante para verificar se a query é válida
  const isQueryEmpty = !query || query.trim().length === 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-700">
            {isQueryEmpty ? "Busca de Imagem" : `Sugestões para: "${query}"`}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition-colors font-bold text-xl px-2"
          >
            ×
          </button>
        </div>

        {/* Área de Conteúdo */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          
          {isQueryEmpty ? (
            /* Mensagem para quando não há descrição */
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-gray-800 font-bold text-lg">Descrição ausente!</h3>
              <p className="text-gray-500 max-w-xs">
                Por favor, digite o nome ou descrição do produto no formulário antes de buscar imagens.
              </p>
            </div>
          ) : loading ? (
            /* Loading State */
            <div className="flex flex-col justify-center items-center h-60">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
               <p className="text-blue-500 font-medium">Pesquisando na web...</p>
            </div>
          ) : (
            /* Galeria de Resultados */
            <>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onSelectImage(img.url)}
                      className="group relative cursor-pointer border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-500 transition-all shadow-sm hover:shadow-md bg-gray-50"
                    >
                      <img 
                        src={img.url} 
                        alt={img.title} 
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="bg-white text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                          Selecionar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Caso a busca não retorne nada */
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">Ops! Não encontramos imagens para este termo.</p>
                  <p className="text-sm">Tente usar palavras-chave mais simples.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Rodapé do Modal */}
        <div className="p-3 bg-gray-50 border-t text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Powered by Linkup API</p>
        </div>
      </div>
    </div>
  );
};