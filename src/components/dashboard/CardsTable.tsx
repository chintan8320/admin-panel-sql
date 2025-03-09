import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, CreditCard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCreditCards, deleteCreditCard } from "@/services/creditCardService";
import { CardType } from "@prisma/client";
import AddCreditCardModal from './AddTransactionModal';

interface CreditCard {
  id: string;
  cardName: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: CardType;
  limit: string;
  balance: string;
}

const CreditCardTable: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Load credit cards when component mounts
  useEffect(() => {
    loadCreditCards();
  }, []);

  const loadCreditCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const cards = await fetchCreditCards();
      setCreditCards(cards);
    } catch (err) {
      console.error('Error fetching credit cards:', err);
      setError('Failed to load credit cards');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setIsAddModalOpen(true);
  };

  const handleDeleteCard = async (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      setDeleteLoading(id);
      try {
        await deleteCreditCard(id);
        // Remove card from state after successful deletion
        setCreditCards(prevCards => prevCards.filter(card => card.id !== id));
      } catch (err) {
        console.error('Error deleting credit card:', err);
        alert('Failed to delete card. Please try again.');
      } finally {
        setDeleteLoading(null);
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
    // Reload the cards after a successful add/edit
    loadCreditCards();
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
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-0">My Credit Cards</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={loadCreditCards}
            variant="outline"
            className="flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
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
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={loadCreditCards}>
            Try Again
          </Button>
        </div>
      )}
      
      {loading && !error ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin mr-2">
            <RefreshCw size={20} />
          </div>
          <span>Loading credit cards...</span>
        </div>
      ) : creditCards.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <CreditCard size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">You haven't added any credit cards yet</p>
          <Button 
            onClick={handleAddNewCard}
            variant="outline"
          >
            Add Your First Card
          </Button>
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
                <TableHead className="text-gray-500 font-medium">Limit</TableHead>
                <TableHead className="text-gray-500 font-medium">Balance</TableHead>
                <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditCards.map((card) => (
                <TableRow key={card.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-black">
                    {getCardTypeIcon(card.cardType)}
                  </TableCell>
                  <TableCell className="text-black">{card.cardName}</TableCell>
                  <TableCell className="text-black font-mono">{card.cardNumber}</TableCell>
                  <TableCell className="text-black">{card.expiryDate}</TableCell>
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
                        disabled={deleteLoading === card.id}
                      >
                        {deleteLoading === card.id ? (
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

      {/* Render the add/edit modal */}
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