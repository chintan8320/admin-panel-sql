import React from "react";
import SearchBar from "../dashboard/SearchBar";
import { SettingIcon } from "@/lib/assets/setting_ison";
import { BellIcon } from "@/lib/assets/bell_icon";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between bg-white shadow-sm px-6 py-5">
      <h1 className="text-2xl font-semibold text-gray-800">Accounts</h1>

      <div className="flex items-center gap-6">
        <div className="w-65">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full bg-gray-200/50">
            <SettingIcon />
          </button>

          <button className="relative p-2 rounded-full bg-gray-200/50">
            <BellIcon />
          </button>

          <button className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src="https://i.pravatar.cc/100"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
