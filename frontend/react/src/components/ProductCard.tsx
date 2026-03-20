
interface ProductCardProps {
  name?: string;
  stock?: number;
  location?: string;
  price?: number;
  imageUrl?: string;
}

export default function ProductCard({ 
  name = "Camâra Aro 29 Paco Descrição Linha 2", 
  stock = 0, 
  location = "Armário Gaveta 2A", 
  price = 20.00,
  imageUrl 
}: ProductCardProps) {
  
  // Lógica de Alta Performance: 
  // Se o texto tiver menos de 38 caracteres, consideramos curto. Você pode ajustar esse número.
  const isShortText = name.length < 28;

  return (
    <div className="flex w-full bg-[#4c5767] rounded-lg p-3 gap-4 cursor-pointer hover:bg-[#3f4957] transition-colors shadow-sm">
      
      {/* Quadrado da Imagem */}
      <div className="w-20 h-20 bg-[#faebd7] shrink-0 rounded-sm overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#4c5767] text-xs opacity-50 hidden"></span>
        )}
      </div>

      {/* Container de Conteúdo */}
      <div className="flex flex-col flex-1 justify-between min-w-0 py-0.5">
        
        {/* PARTE SUPERIOR: Descrição Dinâmica */}
        <h3 
          className={`text-white font-bold w-full pr-2 transition-all line-clamp-2 ${
            isShortText 
              // Texto Curto: Fonte bem maior (xl a 2xl) e altura de linha maior para preencher o espaço
              ? 'text-2xl sm:text-3xl leading-snug min-h-[40px] sm:min-h-[48px] flex items-center' 
              // Texto Longo: Fonte menor (sm a base) e linha junta para caber em 2 linhas
              : 'text-xl sm:text-xl leading-tight min-h-[40px] sm:min-h-[48px]'
          }`}
        >
          {name}
        </h3>
        
        {/* PARTE INFERIOR: Estoque, Local e Preço */}
        <div className="flex justify-between items-end w-full mt-2">
          
          <div className="flex gap-4 text-[11px] sm:text-xs text-gray-300 pb-0.5">
            <span className="shrink-0">Estoque: {stock.toString().padStart(2, '0')}</span>
            <span className="truncate">{location}</span>
          </div>

          <div className="text-white font-bold text-xl sm:text-2xl leading-none shrink-0 pl-2">
            R$ {price.toFixed(2)}
          </div>
          
        </div>
      </div>
    </div>
  );
}