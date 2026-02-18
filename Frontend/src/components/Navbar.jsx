import React from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  User,
  Bell,
  MessageSquare,
} from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className="bg-orange-500 p-2 rounded-full">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">Odaplace</span>
        </div>

        {/* Search Bar Group */}
        <div className="flex flex-1 items-center border-2 border-orange-500 rounded-full overflow-hidden">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 border-r hover:bg-gray-50">
            <MapPin size={18} />
            <span className="text-sm">New York</span>
          </button>
          <input
            type="text"
            placeholder="Asus"
            className="flex-1 px-4 py-2 outline-none text-sm"
          />
          <button className="bg-orange-500 text-white px-6 py-2 flex items-center gap-2 hover:bg-orange-600 transition">
            <Search size={18} />
            <span className="font-medium">Search</span>
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-slate-500">
          <div className="flex items-center gap-1 cursor-pointer">
            <img
              src="https://flagcdn.com/us.svg"
              className="w-5 h-4"
              alt="USA"
            />
            <span className="text-xs font-bold uppercase">EN</span>
          </div>
          <Bell size={20} className="cursor-pointer" />
          <MessageSquare size={20} className="cursor-pointer" />
          <ShoppingCart size={20} className="cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=User" alt="avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
