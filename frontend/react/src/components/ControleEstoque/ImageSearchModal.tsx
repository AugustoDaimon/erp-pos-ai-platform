import React, { useState, useRef } from 'react';
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
  const [hasSearched, setHasSearched] = useState(false); // NOVO: Controla se a busca foi iniciada
  
  // Referência para o input oculto de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NOVO: Função chamada apenas quando o usuário clica em "Pesquisar na Web"
  const handlePesquisarWeb = async () => {
    if (!query || query.trim().length === 0) {
      return;
    }

    setHasSearched(true);
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

  // Função que lida com o upload do arquivo local
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Envia a imagem como uma string Base64 para o formulário pai
        if (typeof reader.result === 'string') {
          onSelectImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isQueryEmpty = !query || query.trim().length === 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        
        {/* Input de arquivo oculto para uso local */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-700">
            Busca de Imagem
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
          
          {!hasSearched ? (
            /* TELA 1: ESTADO INICIAL (ESCOLHER AÇÃO) */
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="bg-blue-50 p-6 rounded-full mb-6 border-4 border-blue-100">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h3 className="text-gray-800 font-black text-2xl mb-2">Como deseja adicionar a imagem?</h3>
              <p className="text-gray-500 max-w-md mb-8">
                Você pode enviar uma foto diretamente do seu computador ou deixar o sistema procurar sugestões na internet.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-4 bg-white text-blue-600 font-extrabold rounded-xl border-2 border-blue-300 hover:bg-blue-50 transition-all shadow-sm flex flex-col items-center gap-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>CARREGAR ARQUIVO</span>
                </button>

                <div className="relative flex-1">
                  <button 
                    onClick={handlePesquisarWeb}
                    disabled={isQueryEmpty}
                    className="w-full h-full py-4 bg-blue-600 text-white font-extrabold rounded-xl border-2 border-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 transition-all shadow-sm flex flex-col items-center justify-center gap-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <span>PESQUISAR NA WEB</span>
                  </button>
                  {isQueryEmpty && (
                    <span className="absolute -bottom-6 left-0 right-0 text-[10px] font-bold text-red-500 tracking-wider">
                      * DIGITE A DESCRIÇÃO NO FORMULÁRIO PRIMEIRO
                    </span>
                  )}
                </div>
              </div>
            </div>

          ) : loading ? (
            /* TELA 2: LOADING DA PESQUISA */
            <div className="flex flex-col justify-center items-center h-[400px]">
               <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600 mb-4"></div>
               <p className="text-blue-600 font-bold text-lg tracking-wide animate-pulse">Buscando na internet...</p>
               <p className="text-gray-500 text-sm mt-2">Buscando por: "{query}"</p>
            </div>
            
          ) : (
            /* TELA 3 e 4: RESULTADOS OU ERRO */
            <>
              {/* Mostra termo pesquisado no topo */}
              <div className="mb-4 text-gray-600 font-medium">
                Sugestões da web para: <span className="font-bold text-gray-800">"{query}"</span>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  
                  {/* Quadrado fixo para Upload Local na Galeria */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer border-2 border-dashed border-blue-400 rounded-xl overflow-hidden hover:bg-blue-50 transition-all shadow-sm flex flex-col items-center justify-center h-36 bg-blue-50/30"
                  >
                    <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </div>
                    <span className="text-xs font-bold text-blue-700 text-center leading-tight">
                      CARREGAR<br/>DO COMPUTADOR
                    </span>
                  </div>

                  {/* Lista de Imagens da API */}
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onSelectImage(img.url)}
                      className="group relative cursor-pointer border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-500 transition-all shadow-sm hover:shadow-md bg-gray-50"
                    >
                      <img 
                        src={img.url} 
                        alt={img.title || img.title || "Produto"} 
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
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  </div>
                  <h3 className="text-gray-700 font-bold text-xl mb-2">Nenhuma imagem encontrada na web.</h3>
                  <p className="text-sm mb-8">Tente usar palavras-chave mais simples ou faça o upload de uma imagem própria.</p>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-green-100 text-green-700 font-extrabold rounded-xl border-2 border-green-300 hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center gap-3 text-sm tracking-wider"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    CARREGAR IMAGEM LOCAL
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Rodapé do Modal (Só aparece se a pessoa pesquisou) */}
        {hasSearched && (
          <div className="p-3 bg-gray-50 border-t text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Powered by Linkup API</p>
          </div>
        )}

      </div>
    </div>
  );
};