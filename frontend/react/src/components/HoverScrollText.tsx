import React, { useRef, useState } from 'react';

interface HoverScrollTextProps {
  text: string;
  className?: string; // Para você poder passar tamanhos de fonte, cores, etc.
}

export default function HoverScrollText({ text, className = "" }: HoverScrollTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Calcula quantos pixels o texto passou do limite da caixa
  const getScrollAmount = () => {
    if (!textRef.current || !containerRef.current) return 0;
    const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
    return diff > 0 ? diff : 0;
  };

  const scrollDiff = getScrollAmount();

  // Se o texto não estoura a caixa, a gente só renderiza ele normal com reticências (...)
  // Se ele estourar, a gente ativa a animação.
  const isOverflowing = scrollDiff > 0;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={text} // O Tooltip nativo salva vidas em PDVs!
    >
      <span
        ref={textRef}
        className={`inline-block transition-transform duration-2000 ease-linear ${isOverflowing && !isHovered ? 'truncate w-full' : ''}`}
        style={{
          // Se o mouse estiver em cima e o texto for grande, move X pixels para a esquerda
          transform: isHovered && isOverflowing ? `translateX(-${scrollDiff}px)` : 'translateX(0)',
        }}
      >
        {text}
      </span>
    </div>
  );
}