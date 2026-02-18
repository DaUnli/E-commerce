import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const SearchBar = () => {
  const [location, setLocation] = useState("New York");

  return (
    <div className="flex w-full max-w-4xl items-center">
      {/* Search Container */}
      <div className="flex w-full items-center bg-white border-2 border-orange-500 rounded-full overflow-hidden shadow-sm focus-within:shadow-md transition-shadow">
        
        {/* Location Selector */}
        <div className="relative group border-r border-slate-200">
          <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-slate-50 transition-colors min-w-[140px]">
            <MapPin size={18} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
              {location}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>

        {/* Main Input Field */}
        <input
          type="text"
          placeholder="Asus"
          className="flex-1 px-6 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
        />

        {/* Search Button */}
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-2.5 transition-all duration-200">
          <Search size={18} strokeWidth={3} />
          <span className="font-bold text-sm tracking-wide">Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;