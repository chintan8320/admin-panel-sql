import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarLink = ({ href, icon, label, isActive: forcedIsActive }: SidebarLinkProps) => {
  
  // Use provided isActive prop if available, otherwise determine based on pathname
  const isActive = false;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-[26px] px-[25px] pl-10 py-3 transition-all",
        isActive ? "border-l-4 border-[#1814F3]" : "text-gray-500"
      )}
    >
      <div
        className={cn(
          "transition-transform duration-300",
          isActive ? "scale-110" : "scale-100"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-[16px] font-medium transition-colors",
          isActive ? "text-[#1814F3]" : "text-[#B1B1B1]"
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarLink;