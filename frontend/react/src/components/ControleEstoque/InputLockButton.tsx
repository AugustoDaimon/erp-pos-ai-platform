import React from 'react';
import { Lock, LockOpen } from 'lucide-react';

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
      className={`
        p-1.5 rounded-md transition-all duration-200 flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${locked 
          ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm hover:bg-blue-100 focus:ring-blue-500' 
          : 'bg-transparent text-gray-400 border border-transparent hover:bg-gray-100 hover:text-gray-600 focus:ring-gray-400'
        }
      `}
    >
      {locked ? (
        <Lock size={14} strokeWidth={2.5} />
      ) : (
        <LockOpen size={14} strokeWidth={2.5} />
      )}
    </button>
  );
};