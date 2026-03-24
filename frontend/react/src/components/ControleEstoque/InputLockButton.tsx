interface InputLockButtonProps {
  locked: boolean;
  onClick: () => void;
}

export const InputLockButton: React.FC<InputLockButtonProps> = ({ locked, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={locked ? "Destravar campo" : "Travar campo (manter ao limpar)"}
      className={`p-1 rounded transition-colors ${
        locked ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 shadow-inner' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
      }`}
    >
      {locked ? (
        // Cadeado Fechado
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm3 11a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      ) : (
        // Cadeado Aberto
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      )}
    </button>
  );
};