import React from 'react';
import SidebarLink from './SidebarLink';
import { MainLogo } from '@/lib/assets/main';
import { Transactions } from '@/lib/assets/transcations';
import { Accounts } from '@/lib/assets/accounts';
import { Investments } from '@/lib/assets/investment';
import { Card } from '@/lib/assets/card';
import { Loans } from '@/lib/assets/loans';
import { Service } from '@/lib/assets/service';
import { Privileges } from '@/lib/assets/privileges';
import { Setting } from '@/lib/assets/setting';
import { Home } from '@/lib/assets/home';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-screen sticky top-0 border-r border-gray-100 py-8 flex flex-col">
      {/* Logo */}
      <div className="pr-4 pl-10 mb-8">
        <div className="flex items-center gap-2 text-bank-blue">
          <MainLogo />
        </div>
      </div>

      {/* Navigation */}
      <nav className="pr-3 flex-1">
        <div className="space-y-1">
          <SidebarLink href="/" icon={<Home />} label="Dashboard" />
          <SidebarLink href="/transactions" icon={<Transactions />} label="Transactions" />
          <SidebarLink href="/accounts" icon={<Accounts />} label="Accounts" />
          <SidebarLink href="/investments" icon={<Investments />} label="Investments" />
          <SidebarLink href="/credit-cards" icon={<Card />} label="Credit Cards" />
          <SidebarLink href="/loans" icon={<Loans />} label="Loans" />
          <SidebarLink href="/services" icon={<Service />} label="Services" />
          <SidebarLink href="/privileges" icon={<Privileges />} label="My Privileges" />
          <SidebarLink href="/settings" icon={<Setting />} label="Setting" />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
