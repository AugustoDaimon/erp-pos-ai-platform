import React, { useState } from 'react';

interface ModalCadastroRapidoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nome: string) => Promise<void>;
  titulo: string;
  label: string;
}

export function ModalCadastroRapido({ isOpen, onClose, onSave, titulo, label }: ModalCadastroRapidoProps) {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!nome.trim()) return;
    
    setLoading(true);
    try {
      await onSave(nome);
      setNome(''); // Limpa o input após salvar
      onClose();   // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Falha ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{titulo}</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder={`Digite o nome...`}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !nome.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}