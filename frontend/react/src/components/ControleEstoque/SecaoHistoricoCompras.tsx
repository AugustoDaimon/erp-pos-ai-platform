export const SecaoHistoricoCompras = ({ inputStyle }: { inputStyle: string }) => {
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
       <div className="bg-white/50 p-4 rounded-xl border border-gray-300">
         <p className="font-bold text-gray-700 mb-4">Registrar Nova Compra / Entrada</p>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input placeholder="Fornecedor" className={inputStyle} />
            <input placeholder="NF / Pedido" className={inputStyle} />
            <input placeholder="Qtd" className={inputStyle} />
            <input placeholder="Valor Unit." className={inputStyle} />
         </div>
       </div>
       
       {/* Tabela de histórico */}
       <div className="border-2 border-black rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
             <thead className="bg-gray-800 text-white">
                <tr>
                   <th className="p-2 border border-black">Data</th>
                   <th className="p-2 border border-black">Fornecedor</th>
                   <th className="p-2 border border-black">Qtd</th>
                   <th className="p-2 border border-black">Custo</th>
                </tr>
             </thead>
             <tbody>
                <tr className="hover:bg-gray-100">
                   <td className="p-2 border border-gray-300">20/03/2026</td>
                   <td className="p-2 border border-gray-300">Shimano Brasil</td>
                   <td className="p-2 border border-gray-300">10</td>
                   <td className="p-2 border border-gray-300">R$ 150,00</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
};