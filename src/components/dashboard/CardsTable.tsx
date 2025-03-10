import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, CreditCard as CreditCardIcon, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { $Enums, CardType, CreditCard } from "@prisma/client";
import AddCreditCardModal from './AddTransactionModal';
import { 
  useCreditCards, 
  useDeleteCreditCard, 
  CreditCardFilters 
} from "@/services/creditCardService";

interface LocalCreditCardFilters {
  createdAfter?: string;
  createdBefore?: string;
}

const CreditCardTable: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  const getApiFilters = (): CreditCardFilters | undefined => {
    if (!isFiltering) return undefined;
    
    const filters: CreditCardFilters = {};
    if (createdAfter) filters.expiryAfter = createdAfter;
    if (createdBefore) filters.expiryBefore = createdBefore;
    return Object.keys(filters).length ? filters : undefined;
  };

  const { 
    data: creditCards = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useCreditCards(getApiFilters());
  
  const deleteMutation = useDeleteCreditCard();

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setIsAddModalOpen(true);
  };

  const handleDeleteCard = async (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting credit card:', err);
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCard(null);
  };

  const handleModalSuccess = () => {
  };

  const applyDateFilter = () => {
    setIsFiltering(true);
  };

  const clearFilters = () => {
    setCreatedAfter("");
    setCreatedBefore("");
    setIsFiltering(false);
  };

  const getCardTypeIcon = (cardType: CardType) => {
    switch(cardType) {
      case 'visa':
        return <span className="font-semibold text-blue-600">VISA</span>;
      case 'mastercard':
        return <span className="font-semibold text-orange-600">MC</span>;
      case 'amex':
        return <span className="font-semibold text-green-600">AMEX</span>;
      case 'discover':
        return <span className="font-semibold text-purple-600">DISC</span>;
      default:
        return <CreditCardIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-0">My Credit Cards</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button 
            onClick={handleAddNewCard}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} />
            Add Card
          </Button>
        </div>
      </div>
      
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">Filter by Creation Date</h3>
          {isFiltering && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="createdAfter" className="block text-xs text-gray-500 mb-1">From</label>
            <Input 
              id="createdAfter"
              type="date" 
              value={createdAfter} 
              onChange={(e) => setCreatedAfter(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="createdBefore" className="block text-xs text-gray-500 mb-1">To</label>
            <Input 
              id="createdBefore"
              type="date" 
              value={createdBefore} 
              onChange={(e) => setCreatedBefore(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={applyDateFilter}
              variant="outline"
              className="flex items-center gap-1"
              disabled={isLoading || (!createdAfter && !createdBefore)}
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Filter size={16} />
              )}
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
      
      {isError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center justify-between">
          <span>{(error as Error)?.message || 'Failed to load credit cards'}</span>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}
      
      {isLoading && !isError ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin mr-2">
            <RefreshCw size={20} />
          </div>
          <span>Loading credit cards...</span>
        </div>
      ) : creditCards.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          {!isFiltering ? (
            <>
              <CreditCardIcon size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">You haven't added any credit cards yet</p>
              <Button 
                onClick={handleAddNewCard}
                variant="outline"
              >
                Add Your First Card
              </Button>
            </>
          ) : (
            <>
              <Filter size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">No cards match the selected date filters</p>
              <Button 
                onClick={clearFilters}
                variant="outline"
              >
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500 font-medium">Card Type</TableHead>
                <TableHead className="text-gray-500 font-medium">Card Name</TableHead>
                <TableHead className="text-gray-500 font-medium">Card Number</TableHead>
                <TableHead className="text-gray-500 font-medium">Expiry</TableHead>
                <TableHead className="text-gray-500 font-medium">Added Date</TableHead>
                <TableHead className="text-gray-500 font-medium">Limit</TableHead>
                <TableHead className="text-gray-500 font-medium">Balance</TableHead>
                <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditCards.map((card: { id: string; cardType: $Enums.CardType; cardName: string; cardNumber: string; expiryDate: string; createdAt: Date; limit: string; balance: string; cardHolder: string; updatedAt: Date; }) => (
                <TableRow key={card.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-black">
                    {getCardTypeIcon(card.cardType)}
                  </TableCell>
                  <TableCell className="text-black">{card.cardName}</TableCell>
                  <TableCell className="text-black font-mono">{card.cardNumber}</TableCell>
                  <TableCell className="text-black">{card.expiryDate}</TableCell>
                  <TableCell className="text-black">{formatDate(card.createdAt.toString())}</TableCell>
                  <TableCell className="text-black">{card.limit}</TableCell>
                  <TableCell className="text-black">{card.balance}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditCard(card)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteCard(card.id)}
                        disabled={deleteMutation.isPending && deleteMutation.variables === card.id}
                      >
                        {deleteMutation.isPending && deleteMutation.variables === card.id ? (
                          <RefreshCw className="h-4 w-4 text-red-600 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddCreditCardModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        creditCard={editingCard}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CreditCardTable;