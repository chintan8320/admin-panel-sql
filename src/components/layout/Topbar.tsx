import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../dashboard/SearchBar";
import { SettingIcon } from "@/lib/assets/setting_ison";
import { BellIcon } from "@/lib/assets/bell_icon";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
}

const Topbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  const currentUser: User = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = (): void => {
    localStorage.clear()
    router.push('/login')

  };

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

          <div className="relative">
            <button 
              ref={buttonRef}
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-colors focus:outline-none"
              onClick={() => setShowMenu(!showMenu)}
              aria-expanded={showMenu}
              aria-haspopup="true"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>
            
            {showMenu && (
              <div 
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                role="menu"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;