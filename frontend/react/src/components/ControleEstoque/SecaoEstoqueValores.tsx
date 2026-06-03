import { InputLockButton } from "./InputLockButton";

interface SecaoEstoqueValoresProps {
    dados: any;
    onChange: (field: string, value: string) => void;
    inputStyle: string;
    lockedFields: Record<string, boolean>;
    toggleLock: (field: string) => void;
}

export const SecaoEstoqueValores = ({ dados, onChange, inputStyle, lockedFields, toggleLock }: SecaoEstoqueValoresProps) => {
    const colWidth = "w-[220px]";
    const smallColWidth = "w-[106px]";
    const labelStyle = "text-[11px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-wider";
    
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

        // Formata o custo também se ele for o campo que perdeu o foco
        if (campoAlterado === 'custo') {
            onChange('custo', c.toFixed(2));
        }
    };

    // Formata o valor de instalação no onBlur
    const formatarInstalacao = () => {
        const inst = parseFloat(dados.instalacao) || 0;
        onChange('instalacao', inst.toFixed(2));
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn p-2">

            <div className="flex flex-wrap gap-8">

                {/* COLUNA 1: VENDAS */}
                <div className="flex flex-col gap-5">
                    <div className={colWidth}>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelStyle}>Valor de Venda</label>
                            <InputLockButton locked={!!lockedFields.venda} onClick={() => toggleLock('venda')} />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</span>
                            <input 
                                type="number" 
                                step="any"
                                value={dados.venda} 
                                onChange={(e) => onChange('venda', e.target.value)} 
                                onBlur={() => recalcular('venda')}
                                placeholder="0.00" 
                                className={`${inputStyle} ${hideArrows} w-full pl-9 text-right`} 
                            />
                        </div>
                    </div>

                    <div className={colWidth}>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelStyle}>Valor Instalação</label>
                            <InputLockButton locked={!!lockedFields.instalacao} onClick={() => toggleLock('instalacao')} />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</span>
                            <input 
                                type="number" 
                                step="any"
                                value={dados.instalacao} 
                                onChange={(e) => onChange('instalacao', e.target.value)} 
                                onBlur={formatarInstalacao}
                                placeholder="0.00" 
                                className={`${inputStyle} ${hideArrows} w-full pl-9 text-right`} 
                            />
                        </div>
                    </div>
                </div>

                {/* COLUNA 2: CUSTOS E MARGEM */}
                <div className="flex flex-col gap-5">
                    <div className={colWidth}>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelStyle}>Custo de Compra</label>
                            <InputLockButton locked={!!lockedFields.custo} onClick={() => toggleLock('custo')} />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</span>
                            <input 
                                type="number" 
                                step="any"
                                value={dados.custo} 
                                onChange={(e) => onChange('custo', e.target.value)} 
                                onBlur={() => recalcular('custo')}
                                placeholder="0.00" 
                                className={`${inputStyle} ${hideArrows} w-full pl-9 text-right`} 
                            />
                        </div>
                    </div>

                    <div className={colWidth}>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelStyle}>Lucro (R$ e %)</label>
                            <InputLockButton locked={!!lockedFields.lucroR} onClick={() => { toggleLock('lucroR'); toggleLock('lucroP'); }} />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[9px] font-bold">R$</span>
                                <input 
                                    type="number" 
                                    step="any"
                                    value={dados.lucroR} 
                                    onChange={(e) => onChange('lucroR', e.target.value)} 
                                    onBlur={() => recalcular('lucroR')}
                                    placeholder="0.00" 
                                    className={`${inputStyle} ${hideArrows} w-full pl-6 text-right text-green-700`} 
                                />
                            </div>
                            <div className="relative w-16">
                                <input 
                                    type="number" 
                                    step="any"
                                    value={dados.lucroP} 
                                    onChange={(e) => onChange('lucroP', e.target.value)} 
                                    onBlur={() => recalcular('lucroP')}
                                    placeholder="0" 
                                    className={`${inputStyle} ${hideArrows} w-full text-center text-green-700 pr-4`} 
                                />
                                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUNA 3: ESTOQUE */}
                <div className="flex flex-col gap-5">
                    <div className="flex gap-2">
                        <div className={smallColWidth}>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={labelStyle}>Estq. Atual</label>
                                <InputLockButton locked={!!lockedFields.estoqueAtual} onClick={() => toggleLock('estoqueAtual')} />
                            </div>
                            <input 
                                type="number" 
                                value={dados.estoqueAtual} 
                                onChange={(e) => onChange('estoqueAtual', e.target.value)} 
                                placeholder="0" 
                                className={`${inputStyle} ${hideArrows} w-full text-center`} 
                            />
                        </div>
                        <div className={smallColWidth}>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={labelStyle}>Estq. Mín.</label>
                                <InputLockButton locked={!!lockedFields.estoqueMinimo} onClick={() => toggleLock('estoqueMinimo')} />
                            </div>
                            <input 
                                type="number" 
                                value={dados.estoqueMinimo} 
                                onChange={(e) => onChange('estoqueMinimo', e.target.value)} 
                                placeholder="0" 
                                className={`${inputStyle} ${hideArrows} w-full text-center text-orange-600`} 
                            />
                        </div>
                    </div>
                </div>
                {/* Div invisível para manter o alinhamento do grid com as outras colunas */}
                <div className={`${colWidth} h-[54px] opacity-0`} />
            </div>

        </div>
    );
};