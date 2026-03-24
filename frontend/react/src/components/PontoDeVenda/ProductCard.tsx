import React, { useState } from 'react';

// Atualizada a interface das Props
interface ProductCardProps {
  name?: string;
  price?: number;
  valor_instalacao?: number; // Nova prop
  imageUrl?: string;
  // Callback opcional para quando o card for clicado (integração futura)
  onAddToCart?: (wantsInstallation: boolean) => void; 
}

export default function ProductCard({ 
  name = "Camâra Aro 29 Paco Descrição Linha 2", 
  price = 20.00,
  valor_instalacao = 15.00, // Valor padrão de exemplo
  imageUrl,
  onAddToCart
}: ProductCardProps) {
  
  // Estado local para gerenciar o checkbox
  const [isInstalled, setIsInstalled] = useState(false);

  // Mantida a lógica de Alta Performance
  const isShortText = name.length < 28;

  // Lógica para lidar com o clique no card inteiro
  const handleCardClick = (e: React.MouseEvent) => {
    // Verificamos se o clique NÃO foi no checkbox ou na label dele
    // para não disparar o callback duas vezes ao tentar apenas marcar a caixa.
    const target = e.target as HTMLElement;
    if (target.closest('.installation-control')) return;

    if (onAddToCart) {
      onAddToCart(isInstalled);
    }
  };

  return (
    // Adicionado o handler de clique no container principal
    <div 
      onClick={handleCardClick}
      className="flex w-full bg-[#4c5767] rounded-lg p-3 gap-4 cursor-pointer hover:bg-[#3f4957] transition-colors shadow-sm relative group"
    >
      
      {/* Quadrado da Imagem - Mantido identico */}
      <div className="w-20 h-20 bg-[#faebd7] shrink-0 rounded-sm overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#4c5767] text-xs opacity-50 hidden"></span>
        )}
      </div>

      {/* Container de Conteúdo - Mantido identico */}
      <div className="flex flex-col flex-1 justify-between min-w-0 py-0.5">
        
        {/* PARTE SUPERIOR: Descrição Dinâmica - Mantido identico */}
        <h3 
          className={`text-white font-bold w-full pr-2 transition-all line-clamp-2 ${
            isShortText 
              ? 'text-2xl sm:text-3xl leading-snug min-h-[40px] sm:min-h-[48px] flex items-center' 
              : 'text-xl sm:text-xl leading-tight min-h-[40px] sm:min-h-[48px]'
          }`}
        >
          {name}
        </h3>
        
        {/* PARTE INFERIOR: Modificada apenas a parte esquerda */}
        <div className="flex justify-between items-end w-full mt-2 gap-2">
          
          {/* NOVA PARTE ESQUERDA: Controle de Instalação */}
          {/* Mantido flex, gap, fontes (text-[11px] sm:text-xs), cor (text-gray-300) e padding (pb-0.5) */}
          <label 
            className="installation-control flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-300 pb-0.5 cursor-pointer group-hover:text-white transition-colors leading-none"
            onClick={(e) => e.stopPropagation()} // Impede que clicar na label adicione ao carrinho
          >
            <input
              type="checkbox"
              checked={isInstalled}
              onChange={(e) => setIsInstalled(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-500 bg-gray-600 accent-blue-500 focus:ring-blue-500 focus:ring-offset-[#4c5767]"
            />
            <span className="shrink-0">Instalação: R$ {valor_instalacao.toFixed(2)}</span>
          </label>

          {/* PARTE DIREITA: Preço - Mantido identico */}
          <div className="text-white font-bold text-xl sm:text-2xl leading-none shrink-0 pl-2">
            R$ {price.toFixed(2)}
          </div>
          
        </div>
      </div>
    </div>
  );
}