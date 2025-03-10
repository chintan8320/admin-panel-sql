import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard } from "@prisma/client";

export interface CreditCardFilters {
  expiryAfter?: string; 
  expiryBefore?: string;
}

export const fetchCreditCards = async (filters?: CreditCardFilters): Promise<CreditCard[]> => {
  let url = '/api/credit-cards';
  
  if (filters) {
    const queryParams = new URLSearchParams();
    
    if (filters.expiryAfter) {
      queryParams.append('createdAfter', filters.expiryAfter);
    }
    
    if (filters.expiryBefore) {
      queryParams.append('createdBefore', filters.expiryBefore);
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch credit cards');
  }
  
  return response.json();
};

export const fetchCreditCardById = async (id: string): Promise<CreditCard> => {
  const response = await fetch(`/api/credit-cards/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch credit card');
  }
  
  return response.json();
};

export const createCreditCard = async (creditCardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditCard> => {
  const response = await fetch('/api/credit-cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creditCardData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create credit card');
  }
  
  return response.json();
};

export const updateCreditCard = async (id: string, creditCardData: Partial<CreditCard>): Promise<CreditCard> => {
  const response = await fetch(`/api/credit-cards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creditCardData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update credit card');
  }
  
  return response.json();
};

export const deleteCreditCard = async (id: string): Promise<void> => {
  const response = await fetch(`/api/credit-cards/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete credit card');
  }
};

export const useCreditCards = (filters?: CreditCardFilters) => {
  return useQuery({
    queryKey: ['creditCards', filters],
    queryFn: () => fetchCreditCards(filters),
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: true,
  });
};

export const useCreditCard = (id: string) => {
  return useQuery({
    queryKey: ['creditCard', id],
    queryFn: () => fetchCreditCardById(id),
    enabled: !!id, 
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCreditCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => 
      createCreditCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
    },
  });
};

export const useUpdateCreditCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreditCard> }) => 
      updateCreditCard(id, data),
    onSuccess: (data: { id: any; }) => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
      queryClient.invalidateQueries({ queryKey: ['creditCard', data.id] });
    },
  });
};

export const useDeleteCreditCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCreditCard(id),
    onSuccess: (_: any, id: string) => {
      queryClient.setQueryData(['creditCards'], (oldData: CreditCard[] | undefined) => {
        return oldData ? oldData.filter((card) => card.id !== id) : [];
      });
      queryClient.removeQueries({ queryKey: ['creditCard', id] });
    },
  });
};