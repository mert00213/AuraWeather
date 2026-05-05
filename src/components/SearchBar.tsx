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
    <form onSubmit={handleSubmit} className="relative w-full group">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search location..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-xl focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all duration-500"
        />
        <Search className="absolute left-4 text-white/40 w-4 h-4 pointer-events-none group-focus-within:text-white/70 transition-colors" />
      </div>
    </form>
  );
};

export default SearchBar;
