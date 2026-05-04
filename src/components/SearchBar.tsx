import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Şehir ara..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-white/5 border border-white/20 rounded-full py-3 pl-12 pr-4 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 shadow-inner"
        />
        <Search className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
        <button
          type="submit"
          className="absolute right-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium rounded-full backdrop-blur-sm transition-all duration-300"
        >
          Ara
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
