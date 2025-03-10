import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor?: string;
  iconColor?: string;
  className?: string;
}

const StatCard = ({ 
  icon, 
  title, 
  value, 
  bgColor = "bg-amber-50", 
  iconColor,
  className 
}: StatCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-3xl p-5 flex items-center gap-5 shadow-sm w-full justify-center",
      "transition-all duration-300 hover:shadow-md hover:scale-105"
    )}>
      <div className="flex gap-4 items-center">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
          bgColor,
          "hover:bg-opacity-80"
        )}>
          <span className={cn("text-2xl transition-all duration-300", iconColor)}>
            {icon}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[#718EBF] text-[14px] font-normal">{title}</span>
          <h3 className="text-[25px] font-semibold text-[#232323]">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
