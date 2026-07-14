import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', onClear }) => (
  <div className="relative">
    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-10 pr-10"
    />
    {value && (
      <button onClick={onClear || (() => onChange(''))} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
        <X size={14} />
      </button>
    )}
  </div>
);
