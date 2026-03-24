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
                            <input type="text" value={dados.venda} onChange={(e) => onChange('venda', e.target.value)} placeholder="0.00" className={`${inputStyle} w-full pl-9 text-right`} />
                        </div>
                    </div>

                    <div className={colWidth}>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={labelStyle}>Valor Instalação</label>
                            <InputLockButton locked={!!lockedFields.instalacao} onClick={() => toggleLock('instalacao')} />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">R$</span>
                            <input type="text" value={dados.instalacao} onChange={(e) => onChange('instalacao', e.target.value)} placeholder="0.00" className={`${inputStyle} w-full pl-9 text-right`} />
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
                            <input type="text" value={dados.custo} onChange={(e) => onChange('custo', e.target.value)} placeholder="0.00" className={`${inputStyle} w-full pl-9 text-right`} />
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
                                <input type="text" value={dados.lucroR} onChange={(e) => onChange('lucroR', e.target.value)} placeholder="0.00" className={`${inputStyle} w-full pl-6 text-right text-green-700`} />
                            </div>
                            <div className="relative w-16">
                                <input type="text" value={dados.lucroP} onChange={(e) => onChange('lucroP', e.target.value)} placeholder="0" className={`${inputStyle} w-full text-center text-green-700`} />
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
                            <input type="number" value={dados.estoqueAtual} onChange={(e) => onChange('estoqueAtual', e.target.value)} placeholder="0" className={`${inputStyle} w-full text-center`} />
                        </div>
                        <div className={smallColWidth}>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={labelStyle}>Estq. Mín.</label>
                                <InputLockButton locked={!!lockedFields.estoqueMinimo} onClick={() => toggleLock('estoqueMinimo')} />
                            </div>
                            <input type="number" value={dados.estoqueMinimo} onChange={(e) => onChange('estoqueMinimo', e.target.value)} placeholder="0" className={`${inputStyle} w-full text-center text-orange-600`} />
                        </div>
                    </div>
                </div>
                {/* Div invisível para manter o alinhamento do grid com as outras colunas */}
                <div className={`${colWidth} h-[54px] opacity-0`} />
            </div>

        </div>
    );
};