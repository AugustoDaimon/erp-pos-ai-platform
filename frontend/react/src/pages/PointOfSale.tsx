import '../index.css';
import ProductCard from '../components/ProductCard';
import CartTable from '../components/CartTable';
import CustomerData from '../components/CustomerData';
import OrderSummary from '../components/OrderSummary';

export default function PointOfSale() {
  const produtosEncontrados = 1;

  return (
    // Adicionado "relative" aqui para podermos ancorar o botão Sair
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#f4f6f9] p-10 gap-6 lg:gap-8 font-sans relative">      
      
      {/* NOVO: Botão Sair minúsculo no topo direito absoluto */}
      <button className="absolute top-3 right-4 text-[10px] font-bold text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors">
        Sair
      </button>

      {/* LEFT COLUMN */}
      <div className="flex flex-col w-full lg:w-1/2 gap-4 lg:h-full">
        
        {/* DIV 1: Search Bar & Links */}
        <div className="flex flex-col gap-2 shrink-0">
          <input 
            type="text" 
            placeholder="Pesquisar produto.." 
            className="w-full border-[2px] border-black rounded-sm h-12 px-4 text-lg outline-none placeholder-gray-400" 
          />
          <div className="flex justify-between items-center text-[#6b7280] text-sm font-medium px-1">
            <div className="flex items-center gap-2">
              <button className="hover:text-black transition-colors">Busca Avançada</button>
              <span className="text-gray-400 font-light">|</span>
              <button className="hover:text-black transition-colors">Adicionar Serviço</button>
            </div>
            <span className="text-gray-500">
              {produtosEncontrados} {produtosEncontrados === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </span>
          </div>
        </div>

        {/* DIV 2: Scrollable Product Container */}
        <div className="h-[40vh] lg:h-auto lg:flex-1 overflow-y-auto pr-2 lg:pr-4 custom-scrollbar flex flex-col gap-3 pb-4">
          <ProductCard 
            name="Pneu Maxxis Exo Tr" 
            stock={5} 
            location="Prateleira 1B" 
            price={250.00} 
          />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6 lg:h-full pb-6 lg:pb-0">
        
        {/* DIV 3: The Table */}
        {/* ALTERADO: Removido o lg:flex-1 e adicionado h-[40vh] lg:h-[45vh] para travar o tamanho menor */}
        <div className="h-[40vh] lg:h-[45vh] border-[2px] border-black bg-white flex flex-col overflow-hidden shrink-0">
          <CartTable/>
        </div>

        {/* DIV 4: Bottom Right Blue Area */}
        <div className="flex flex-col lg:flex-row gap-4 w-full shrink-0">
          <CustomerData />
          <OrderSummary />
        </div>        
      </div>

    </div>
  );
}