import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createCreditCard, updateCreditCard } from "@/services/creditCardService";
import { CardType } from "@prisma/client";

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

interface AddCreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditCard: CreditCard | null;
  onSuccess: () => void;
}

const AddCreditCardModal: React.FC<AddCreditCardModalProps> = ({
  isOpen,
  onClose,
  creditCard,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<CreditCard>>({
    cardName: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cardType: 'visa',
    limit: '',
    balance: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!creditCard;

  useEffect(() => {
    if (creditCard) {
      setFormData({
        cardName: creditCard.cardName,
        cardNumber: creditCard.cardNumber.replace(/[•\s]/g, ''), // Remove dots and spaces
        cardHolder: creditCard.cardHolder,
        expiryDate: creditCard.expiryDate,
        cardType: creditCard.cardType,
        limit: creditCard.limit.replace(/[$,]/g, ''), // Remove $ and commas
        balance: creditCard.balance.replace(/[$,]/g, ''), // Remove $ and commas
      });
    } else {
      // Reset form when adding new card
      setFormData({
        cardName: '',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cardType: 'visa',
        limit: '',
        balance: '',
      });
    }
    // Reset error state when modal opens/closes
    setError(null);
  }, [creditCard, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special formatting for card number (4 digits groups)
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    }
    // Special formatting for expiry date (MM/YY)
    else if (name === 'expiryDate') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
      if (digitsOnly.length > 2) {
        const formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
        setFormData(prev => ({ ...prev, [name]: formatted }));
      } else {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as CardType }));
  };

  const formatCardNumber = (cardNumber: string) => {
    // Mask all but last 4 digits for display
    if (cardNumber.length >= 4) {
      return `•••• •••• •••• ${cardNumber.slice(-4)}`;
    }
    return cardNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format values for storage/display
      const formattedCardNumber = formatCardNumber(formData.cardNumber || '');
      const formattedLimit = `$${parseFloat(formData.limit || '0').toLocaleString()}`;
      const formattedBalance = `$${parseFloat(formData.balance || '0').toLocaleString()}`;
      
      // Create complete card object
      const cardData = {
        cardName: formData.cardName || '',
        cardNumber: formattedCardNumber,
        cardHolder: formData.cardHolder || '',
        expiryDate: formData.expiryDate || '',
        cardType: formData.cardType as CardType || 'visa',
        limit: formattedLimit,
        balance: formattedBalance,
      };
      
      if (isEditMode && creditCard) {
        // Update existing card
        await updateCreditCard(creditCard.id, cardData);
      } else {
        // Create new card
        await createCreditCard(cardData);
      }
      
      // Call success callback to refresh the card list
      onSuccess();
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error saving credit card:', err);
      setError(err instanceof Error ? err.message : 'Failed to save credit card');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Credit Card' : 'Add New Credit Card'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="cardName">Card Name</Label>
            <Input
              id="cardName"
              name="cardName"
              value={formData.cardName || ''}
              onChange={handleChange}
              placeholder="e.g. Premium Rewards"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="cardType">Card Type</Label>
            <Select
              value={formData.cardType || 'visa'}
              onValueChange={(value) => handleSelectChange('cardType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="discover">Discover</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber || ''}
              onChange={handleChange}
              placeholder="Enter 16-digit card number"
              required
              maxLength={16}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="cardHolder">Cardholder Name</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              value={formData.cardHolder || ''}
              onChange={handleChange}
              placeholder="Name on card"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate || ''}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="limit">Credit Limit</Label>
              <Input
                id="limit"
                name="limit"
                value={formData.limit || ''}
                onChange={handleChange}
                placeholder="0.00"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              name="balance"
              value={formData.balance || ''}
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              step="0.01"
              required
            />
          </div>
          
          <DialogFooter className="sm:justify-end mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCreditCardModal;