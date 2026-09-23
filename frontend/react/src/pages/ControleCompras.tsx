import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Plus, 
  Search, 
  Bell, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Package
} from 'lucide-react';

// --- MOCK DATA ---
const mockOrders = [
  { id: 'PED-001', supplier: 'Shimano Brasil', date: '03 Ago 2026', total: 'R$ 4.500,00', status: 'Entregue', items: 12 },
  { id: 'PED-002', supplier: 'Maxxis Pneus', date: '01 Ago 2026', total: 'R$ 1.850,00', status: 'Em Trânsito', items: 50 },
  { id: 'PED-003', supplier: 'KMC Correntes', date: '28 Jul 2026', total: 'R$ 920,00', status: 'Processando', items: 30 },
];

const mockSuppliers = [
  { id: 1, name: 'Shimano Brasil', category: 'Transmissão e Freios', contact: 'contato@shimano.com.br', status: 'Ativo' },
  { id: 2, name: 'Maxxis Pneus', category: 'Pneus e Câmaras', contact: 'vendas@maxxis.com', status: 'Ativo' },
  { id: 3, name: 'Oggi Bikes', category: 'Bicicletas Completas', contact: 'revenda@oggibikes.com.br', status: 'Inativo' },
];

const mockPayments = [
  { id: 'PAG-101', supplier: 'Shimano Brasil', amount: 'R$ 1.500,00', dueDate: '05 Ago 2026', status: 'Pendente' },
  { id: 'PAG-102', supplier: 'Maxxis Pneus', amount: 'R$ 1.850,00', dueDate: '10 Ago 2026', status: 'Pendente' },
  { id: 'PAG-103', supplier: 'KMC Correntes', amount: 'R$ 920,00', dueDate: '01 Ago 2026', status: 'Pago' },
];

type TabType = 'overview' | 'orders' | 'suppliers' | 'payments';

export default function DashboardCompras() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const navigate = useNavigate();
  
  const Badge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      'Entregue': 'bg-green-100 text-green-700',
      'Pago': 'bg-green-100 text-green-700',
      'Em Trânsito': 'bg-blue-100 text-blue-700',
      'Processando': 'bg-amber-100 text-amber-700',
      'Pendente': 'bg-red-100 text-red-700',
      'Ativo': 'bg-emerald-100 text-emerald-700',
      'Inativo': 'bg-gray-100 text-gray-600'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-[#f4f7f9] text-gray-800 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3 text-blue-600">
            <Package size={28} strokeWidth={2.5} />
            <span className="text-lg font-extrabold tracking-tight uppercase">Suprimentos</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral' },
            { id: 'orders', icon: ShoppingCart, label: 'Pedidos de Compra' },
            { id: 'suppliers', icon: Users, label: 'Fornecedores' },
            { id: 'payments', icon: CreditCard, label: 'Contas a Pagar' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab === 'overview' ? 'Visão Geral' : 
             activeTab === 'orders' ? 'Gerenciar Pedidos' : 
             activeTab === 'suppliers' ? 'Seus Fornecedores' : 'Contas a Pagar'}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar pedidos, notas..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Compras do Mês</p>
                    <p className="text-3xl font-bold text-gray-800">R$ 12.450</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingCart size={24} />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">A Pagar (7 dias)</p>
                    <p className="text-3xl font-bold text-gray-800">R$ 3.350</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <Clock size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Entregas Pendentes</p>
                    <p className="text-3xl font-bold text-gray-800">4</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Package size={24} />
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-lg">Pedidos Recentes</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-blue-600 font-semibold hover:underline">Ver todos</button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer bg-gray-50/50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                              {order.supplier.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{order.supplier}</p>
                              <p className="text-xs text-gray-500 font-medium">{order.id} • {order.items} itens</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">{order.total}</p>
                            <Badge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 text-lg mb-6">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <button onClick={() => navigate('/compras/novo')} className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                        <Plus size={20} /> Novo Pedido de Compra
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                      <Users size={20} className="text-gray-400" /> Cadastrar Fornecedor
                    </button>
                    <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                      <ArrowUpRight size={20} className="text-gray-400" /> Registrar Pagamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-700">Histórico de Pedidos</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                  <Plus size={18} /> Novo Pedido
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                      <th className="p-5">ID do Pedido</th>
                      <th className="p-5">Fornecedor</th>
                      <th className="p-5">Data</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Total</th>
                      <th className="p-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-5 font-bold text-gray-900">{order.id}</td>
                        <td className="p-5">{order.supplier}</td>
                        <td className="p-5 text-gray-500">{order.date}</td>
                        <td className="p-5"><Badge status={order.status} /></td>
                        <td className="p-5 font-bold">{order.total}</td>
                        <td className="p-5 text-right">
                          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUPPLIERS TAB */}
          {activeTab === 'suppliers' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-700">Catálogo de Fornecedores</h2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                  <Plus size={18} /> Adicionar Fornecedor
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSuppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-extrabold text-lg">
                        {supplier.name.substring(0, 2).toUpperCase()}
                      </div>
                      <Badge status={supplier.status} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{supplier.name}</h3>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">{supplier.category}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 font-medium">{supplier.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h2 className="font-bold text-gray-800 text-lg">Próximos Vencimentos</h2>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                      <th className="p-5">Fatura / Pedido</th>
                      <th className="p-5">Fornecedor</th>
                      <th className="p-5">Vencimento</th>
                      <th className="p-5">Valor</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-center">Dar Baixa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                    {mockPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">{payment.id}</td>
                        <td className="p-5">{payment.supplier}</td>
                        <td className="p-5 text-gray-500 flex items-center gap-2">
                          <Clock size={14} className={payment.status === 'Pendente' ? 'text-amber-500' : 'text-gray-400'} />
                          {payment.dueDate}
                        </td>
                        <td className="p-5 font-bold">{payment.amount}</td>
                        <td className="p-5"><Badge status={payment.status} /></td>
                        <td className="p-5 text-center">
                          <button 
                            disabled={payment.status === 'Pago'}
                            className={`p-2 rounded-lg transition-colors ${
                              payment.status === 'Pago' 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-green-600 bg-green-50 hover:bg-green-100 hover:shadow-sm'
                            }`}
                          >
                            <CheckCircle2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}