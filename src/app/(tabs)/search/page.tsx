'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import PerfumeCard from '@/components/cards/PerfumeCard';
import { Perfume } from '@/lib/types';

// Fetch perfumes from API
async function fetchPerfumes(search = '', brand = '', note = '', limit = 50): Promise<Perfume[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (brand) params.append('brand', brand);
  if (note) params.append('note', note);
  params.append('limit', limit.toString());
  
  const response = await fetch(`/api/perfumes?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch perfumes');
  }
  const data = await response.json();
  return data.perfumes;
}

const filterOptions = {
  concentration: ['EDT', 'EDP', 'Parfum'],
  notes: ['Bergamot', 'Sandalwood', 'Rose', 'Vanilla', 'Amber', 'Musk'],
  brands: ['Le Labo', 'Creed', 'Tom Ford', 'Dior', 'Chanel'],
  priceRange: ['Under $50', '$50-$100', '$100-$200', '$200+']
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category]?.includes(value)
        ? prev[category].filter(v => v !== value)
        : [...(prev[category] || []), value]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  // Search function
  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const brand = selectedFilters.brands?.[0] || '';
      const note = selectedFilters.notes?.[0] || '';
      
      const results = await fetchPerfumes(searchQuery, brand, note);
      setPerfumes(results);
    } catch (err) {
      setError('Failed to search perfumes');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial perfumes
  useEffect(() => {
    performSearch();
  }, []);

  // Filter perfumes based on selected filters
  const filteredPerfumes = perfumes.filter(perfume => {
    const matchesFilters = Object.entries(selectedFilters).every(([category, values]) => {
      if (values.length === 0) return true;
      
      switch (category) {
        case 'concentration':
          return values.includes(perfume.concentration || '');
        case 'notes':
          return values.some(note => 
            perfume.notes.some(perfumeNote => perfumeNote.note.name === note)
          );
        case 'brands':
          return values.includes(perfume.brand.name);
        default:
          return true;
      }
    });

    return matchesFilters;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-2">
          Search perfumes, brands, notes, and perfumers
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search perfumes, brands, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch()}
            className="pl-10"
          />
        </div>
        <Button
          onClick={performSearch}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Concentration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Concentration</label>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.concentration.map(conc => (
                      <Badge
                        key={conc}
                        variant={selectedFilters.concentration?.includes(conc) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('concentration', conc)}
                      >
                        {conc}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.notes.map(note => (
                      <Badge
                        key={note}
                        variant={selectedFilters.notes?.includes(note) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('notes', note)}
                      >
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brands</label>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.brands.map(brand => (
                      <Badge
                        key={brand}
                        variant={selectedFilters.brands?.includes(brand) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('brands', brand)}
                      >
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.priceRange.map(price => (
                      <Badge
                        key={price}
                        variant={selectedFilters.priceRange?.includes(price) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('priceRange', price)}
                      >
                        {price}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {loading ? 'Searching...' : `${filteredPerfumes.length} results`}
          </h2>
          {Object.values(selectedFilters).some(filters => filters.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Searching perfumes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500">
              <p>{error}</p>
              <Button 
                onClick={performSearch} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p>No perfumes found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPerfumes.map(perfume => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
