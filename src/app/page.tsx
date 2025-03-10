'use client'
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Balance } from '@/lib/assets/balance';
import { Income } from '@/lib/assets/income';
import { Expense } from '@/lib/assets/expense';
import { Saving } from '@/lib/assets/saving';
import CreditCardTable from '@/components/dashboard/CardsTable';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
        <StatCard 
          icon={<Balance />} 
          title="My Balance" 
          value="$12,750" 
        />
        <StatCard 
          icon={<Income />} 
          title="Income" 
          value="$5,600" 
          bgColor="bg-blue-100"
        />
        <StatCard 
          icon={<Expense />} 
          title="Expense" 
          value="$3,460" 
          bgColor="bg-red-100"
        />
        <StatCard 
          icon={<Saving />} 
          title="Total Saving" 
          value="$7,920" 
          bgColor="bg-green-100"
        />
      </div>

      <CreditCardTable />
    </DashboardLayout>
  );
};

export default Index;
