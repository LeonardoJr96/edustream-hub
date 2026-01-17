import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, onClear, placeholder = 'Buscar vídeos...' }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ${
          isExpanded 
            ? 'w-64 md:w-80 bg-secondary border border-border rounded-full' 
            : 'w-10'
        }`}
      >
        <button
          type={isExpanded ? 'submit' : 'button'}
          onClick={() => !isExpanded && setIsExpanded(true)}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isExpanded ? 'Buscar' : 'Abrir busca'}
        >
          <Search className="w-5 h-5" />
        </button>
        
        {isExpanded && (
          <>
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            />
            
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
