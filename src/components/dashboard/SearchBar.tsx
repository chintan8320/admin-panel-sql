import { Search } from "@/lib/assets/search";
import React from "react";

const SearchBar = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search />
      </div>

      <input
        type="text"
        placeholder="Search for something"
        className="w-full bg-gray-100 text-blue-400 rounded-full py-2 pl-10 pr-4 text-[12px] 
                   placeholder-[#8BA3CB] focus:outline-none focus:ring-2 focus:ring-blue-300/50 transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;
