import React from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Bell,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

const   Navbar = () => {
  return (
    <nav className="border-b bg-white px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto gap-4 md:gap-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit cursor-pointer">
          <div className="bg-orange-500 p-2 rounded-lg">
            <span className="text-white font-black text-xl leading-none">O</span>
          </div>
          <span className="text-2xl font-bold text-slate-800 hidden sm:block">
            Odaplace
          </span>
        </div>

        {/* Search Bar Group - Hidden on very small screens, or grows on large */}
        <div className="hidden md:flex flex-1 items-center border-2 border-orange-500 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-orange-200 transition-all">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 border-r hover:bg-gray-50 transition-colors">
            <MapPin size={18} className="text-orange-500" />
            <span className="text-sm font-medium whitespace-nowrap">New York</span>
            <ChevronDown size={14} />
          </button>
          
          <input
            type="text"
            placeholder="Search for products (e.g. Asus)"
            className="flex-1 px-4 py-2 outline-none text-sm text-slate-700"
          />
          
          <button className="bg-orange-500 text-white px-6 py-2 flex items-center gap-2 hover:bg-orange-600 active:scale-95 transition-all">
            <Search size={18} />
            <span className="font-semibold">Search</span>
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-6 text-slate-500">
          {/* Language Picker */}
          <button className="hidden sm:flex items-center gap-1 hover:bg-slate-50 p-1 rounded transition">
            <img
              src="https://flagcdn.com/us.svg"
              className="w-5 h-3.5 object-cover rounded-sm"
              alt="USA"
            />
            <span className="text-xs font-bold uppercase">EN</span>
          </button>

          {/* Icon Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative p-2 hover:bg-slate-100 rounded-full cursor-pointer transition">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="p-2 hover:bg-slate-100 rounded-full cursor-pointer transition">
              <MessageSquare size={20} />
            </div>

            <div className="relative p-2 hover:bg-slate-100 rounded-full cursor-pointer transition">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                3
              </span>
            </div>
          </div>

          {/* User Profile */}
          <button className="flex items-center gap-2 pl-2 border-l ml-2 hover:opacity-80 transition">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
              <img 
                src="https://ui-avatars.com/api/?name=User&background=f1f5f9&color=475569" 
                alt="avatar" 
              />
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar - Visible only on small screens */}
      <div className="mt-3 md:hidden">
        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
             <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-3 py-2 outline-none text-sm"
              />
              <button className="bg-orange-500 p-2 text-white">
                <Search size={18} />
              </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;