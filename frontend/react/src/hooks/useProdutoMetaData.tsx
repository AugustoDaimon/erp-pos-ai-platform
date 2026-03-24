import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';
import { marcaService } from '../services/marcaService'; // Supondo que você criou este
import { subcategoriaService } from '../services/subcategoriaService';

export const useProdutoMetaData = () => {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriaService.listar,
    staleTime: 1000 * 60 * 30, // 30 minutos sem precisar ir no servidor novamente
  });

  const marcasQuery = useQuery({
    queryKey: ['marcas'],
    queryFn: marcaService.listar,
    staleTime: 1000 * 60 * 30,
  });

  const subCategoriasQuery = useQuery({
    queryKey: ['subcategorias'],
    queryFn: subcategoriaService.listar,
    staleTime: 1000 * 60 * 30,
  });

  // Para Operações dce escrita
  const invalidarCache = (chave: string) => {
    queryClient.invalidateQueries({ queryKey: [chave] });
  };

  return {
    categorias: categoriasQuery.data || [],
    marcas: marcasQuery.data || [],
    subcategorias: subCategoriasQuery.data || [],
    isLoading: categoriasQuery.isLoading || marcasQuery.isLoading || subCategoriasQuery.isLoading,
    invalidarCache
  };
};