// services/creditCardService.ts

import { CreditCard } from "@prisma/client";

// Fetch all credit cards
export const fetchCreditCards = async (): Promise<CreditCard[]> => {
  const response = await fetch('/api/credit-cards');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch credit cards');
  }
  
  return response.json();
};

// Fetch a single credit card by ID
export const fetchCreditCardById = async (id: string): Promise<CreditCard> => {
  const response = await fetch(`/api/credit-cards/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch credit card');
  }
  
  return response.json();
};

// Create a new credit card
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

// Update a credit card
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

// Delete a credit card
export const deleteCreditCard = async (id: string): Promise<void> => {
  const response = await fetch(`/api/credit-cards/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete credit card');
  }
};