import { InputLockButton } from "./InputLockButton";
import { DollarSign, TrendingUp, Package, Calculator, Wrench, AlertTriangle } from 'lucide-react';

interface SecaoEstoqueValoresProps {
    dados: any;
    onChange: (field: string, value: string) => void;
    inputStyle: string;
    lockedFields: Record<string, boolean>;
    toggleLock: (field: string) => void;
}

export const SecaoEstoqueValores = ({ dados, onChange, inputStyle, lockedFields, toggleLock }: SecaoEstoqueValoresProps) => {
    
    const labelStyle = "text-xs font-semibold text-gray-600 uppercase ml-1 mb-1.5 tracking-wide";
    
    // Classes do Tailwind para esconder as setas (spinners) dos inputs type="number"
    const hideArrows = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

    // Função que recalcula e formata os campos apenas quando o usuário sai do input (onBlur)
    const recalcular = (campoAlterado: 'venda' | 'custo' | 'lucroR' | 'lucroP') => {
        let v = parseFloat(dados.venda) || 0;
        let c = parseFloat(dados.custo) || 0;
        let lR = parseFloat(dados.lucroR) || 0;
        let lP = parseFloat(dados.lucroP) || 0;

        // 1. Se alterou VENDA ou CUSTO -> Recalcula Lucro
        if (campoAlterado === 'venda' || campoAlterado === 'custo') {
            lR = v - c;
            lP = v > 0 ? (lR / v) * 100 : 0;
        }
        // 2. Se alterou LUCRO R$ -> Recalcula Venda e %
        else if (campoAlterado === 'lucroR') {
            v = c + lR;
            lP = v > 0 ? (lR / v) * 100 : 0;
        }
        // 3. Se alterou LUCRO % -> Recalcula Venda e R$
        else if (campoAlterado === 'lucroP') {
            v = (1 - lP / 100) !== 0 ? c / (1 - lP / 100) : c;
            lR = v - c;
        }

        // Atualiza e formata todos com ponto
        onChange('venda', v.toFixed(2));
        onChange('lucroR', lR.toFixed(2));
        onChange('lucroP', lP.toFixed(1));

        if (campoAlterado === 'custo') {
            onChange('custo', c.toFixed(2));
        }
    };

    const formatarInstalacao = () => {
        const inst = parseFloat(dados.instalacao) || 0;
        onChange('instalacao', inst.toFixed(2));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">

            {/* CARD 1: PRECIFICAÇÃO FINAL */}
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-200">
                    <DollarSign size={18} className="text-blue-600" />
                    <h3 className="font-bold text-gray-800">Precificação</h3>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                        <label className={labelStyle}>Valor de Venda</label>
                        <InputLockButton locked={!!lockedFields.venda} onClick={() => toggleLock('venda')} />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                        <input 
                            type="number" 
                            step="any"
                            value={dados.venda} 
                            onChange={(e) => onChange('venda', e.target.value)} 
                            onBlur={() => recalcular('venda')}
                            placeholder="0.00" 
                            className={`${inputStyle} ${hideArrows} pl-11 text-right text-lg font-bold text-gray-900`} 
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                        <label className={`${labelStyle} flex items-center gap-1.5`}><Wrench size={12}/> Valor Instalação</label>
                        <InputLockButton locked={!!lockedFields.instalacao} onClick={() => toggleLock('instalacao')} />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                        <input 
                            type="number" 
                            step="any"
                            value={dados.instalacao} 
                            onChange={(e) => onChange('instalacao', e.target.value)} 
                            onBlur={formatarInstalacao}
                            placeholder="0.00" 
                            className={`${inputStyle} ${hideArrows} pl-11 text-right`} 
                        />
                    </div>
                </div>
            </div>

            {/* CARD 2: CUSTOS E MARGEM */}
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-200">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <h3 className="font-bold text-gray-800">Custos e Margem</h3>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                        <label className={labelStyle}>Custo de Compra</label>
                        <InputLockButton locked={!!lockedFields.custo} onClick={() => toggleLock('custo')} />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                        <input 
                            type="number" 
                            step="any"
                            value={dados.custo} 
                            onChange={(e) => onChange('custo', e.target.value)} 
                            onBlur={() => recalcular('custo')}
                            placeholder="0.00" 
                            className={`${inputStyle} ${hideArrows} pl-11 text-right`} 
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                        <label className={`${labelStyle} flex items-center gap-1.5`}><Calculator size={12}/> Lucro (R$ e %)</label>
                        <InputLockButton locked={!!lockedFields.lucroR} onClick={() => { toggleLock('lucroR'); toggleLock('lucroP'); }} />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
                            <input 
                                type="number" 
                                step="any"
                                value={dados.lucroR} 
                                onChange={(e) => onChange('lucroR', e.target.value)} 
                                onBlur={() => recalcular('lucroR')}
                                placeholder="0.00" 
                                className={`${inputStyle} ${hideArrows} pl-8 text-right font-bold text-emerald-600 bg-emerald-50/30 focus:ring-emerald-500 focus:border-emerald-500`} 
                            />
                        </div>
                        <div className="relative w-24">
                            <input 
                                type="number" 
                                step="any"
                                value={dados.lucroP} 
                                onChange={(e) => onChange('lucroP', e.target.value)} 
                                onBlur={() => recalcular('lucroP')}
                                placeholder="0" 
                                className={`${inputStyle} ${hideArrows} text-center font-bold text-emerald-600 bg-emerald-50/30 pr-6 focus:ring-emerald-500 focus:border-emerald-500`} 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xs font-bold">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 3: CONTROLE DE ESTOQUE */}
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-5 shadow-sm xl:col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-200">
                    <Package size={18} className="text-amber-500" />
                    <h3 className="font-bold text-gray-800">Controle de Estoque</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelStyle}>Estoque Atual</label>
                            <InputLockButton locked={!!lockedFields.estoqueAtual} onClick={() => toggleLock('estoqueAtual')} />
                        </div>
                        <input 
                            type="number" 
                            value={dados.estoqueAtual} 
                            onChange={(e) => onChange('estoqueAtual', e.target.value)} 
                            placeholder="0" 
                            className={`${inputStyle} ${hideArrows} text-center text-lg font-bold`} 
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={`${labelStyle} flex items-center gap-1.5`}><AlertTriangle size={12} className="text-orange-500"/> Estoque Mín.</label>
                            <InputLockButton locked={!!lockedFields.estoqueMinimo} onClick={() => toggleLock('estoqueMinimo')} />
                        </div>
                        <input 
                            type="number" 
                            value={dados.estoqueMinimo} 
                            onChange={(e) => onChange('estoqueMinimo', e.target.value)} 
                            placeholder="0" 
                            className={`${inputStyle} ${hideArrows} text-center font-bold text-orange-600 bg-orange-50/30 focus:ring-orange-500 focus:border-orange-500`} 
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};