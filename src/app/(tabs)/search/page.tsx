'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, X, Loader2, Heart, Eye, ShoppingBag } from 'lucide-react';
import PerfumeCard from '@/components/cards/PerfumeCard';
import { Perfume } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

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
};

export default function SearchPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingListType, setRatingListType] = useState<'own' | 'sniffed' | null>(null);
  const [enjoyment, setEnjoyment] = useState(50);
  const [performance, setPerformance] = useState(50);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openPerfumeModal = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setShowRatingForm(false);
    setRatingListType(null);
    setEnjoyment(50);
    setPerformance(50);
    setReviewText('');
    setIsModalOpen(true);
  };

  const handleListAction = (listType: 'own' | 'sniffed' | 'want') => {
    if (!session) {
      toast.error('Please sign in to add perfumes to your lists');
      return;
    }

    if (listType === 'want') {
      // Add directly to want list
      addToList(listType);
    } else {
      // Show rating form for own/sniffed
      setRatingListType(listType);
      setShowRatingForm(true);
    }
  };

  const addToList = async (listType: 'own' | 'sniffed' | 'want') => {
    if (!selectedPerfume) return;

    setIsSubmitting(true);
    try {
      // For own and sniffed, create a ranking first
      if (listType === 'own' || listType === 'sniffed') {
        const rankingRes = await fetch('/api/rankings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            perfumeId: selectedPerfume.id,
            enjoyment,
            performance,
            reviewText: reviewText.trim() || undefined,
          }),
        });

        if (!rankingRes.ok) {
          throw new Error('Failed to create ranking');
        }
      }

      // Get user's lists
      const listsRes = await fetch('/api/lists');
      let lists = [];
      if (listsRes.ok) {
        const listsData = await listsRes.json();
        lists = listsData.lists || [];
      }

      // Find or create the list
      let list = lists.find((l: any) => l.type === listType);

      if (!list) {
        // Create the list
        const listRes = await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: listType.charAt(0).toUpperCase() + listType.slice(1),
            type: listType,
          }),
        });

        if (!listRes.ok) {
          throw new Error('Failed to create list');
        }

        const listData = await listRes.json();
        list = listData.list;
      }

      // Add perfume to list
      const itemRes = await fetch(`/api/lists/${list.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfumeId: selectedPerfume.id }),
      });

      if (!itemRes.ok) {
        throw new Error('Failed to add to list');
      }

      toast.success(`Added ${selectedPerfume.name} to your ${listType} list!`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding perfume:', error);
      toast.error('Failed to add perfume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div
                key={perfume.id}
                onClick={() => openPerfumeModal(perfume)}
                className="cursor-pointer"
              >
                <PerfumeCard perfume={perfume} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Perfume Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedPerfume && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedPerfume.name}</DialogTitle>
                <DialogDescription>{selectedPerfume.brand.name}</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {/* Zoomed Perfume View */}
                <div className="flex gap-6">
                  <img
                    src={selectedPerfume.imageUrl || '/placeholder.svg'}
                    alt={selectedPerfume.name}
                    className="h-32 w-32 object-cover rounded-xl border"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedPerfume.concentration && (
                        <Badge variant="secondary">{selectedPerfume.concentration}</Badge>
                      )}
                      {selectedPerfume.releaseYear && (
                        <Badge variant="outline">{selectedPerfume.releaseYear}</Badge>
                      )}
                    </div>
                    
                    {selectedPerfume.notes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedPerfume.notes.map((note) => (
                            <Badge key={note.noteId} variant="outline" className="text-xs">
                              {note.note.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Form (for own/sniffed) */}
                {showRatingForm && ratingListType && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Rate this perfume</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="enjoyment">Enjoyment: {enjoyment}</Label>
                      <Input
                        id="enjoyment"
                        type="range"
                        min="0"
                        max="100"
                        value={enjoyment}
                        onChange={(e) => setEnjoyment(parseInt(e.target.value))}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="performance">Performance: {performance}</Label>
                      <Input
                        id="performance"
                        type="range"
                        min="0"
                        max="100"
                        value={performance}
                        onChange={(e) => setPerformance(parseInt(e.target.value))}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review">Review (optional)</Label>
                      <Textarea
                        id="review"
                        placeholder="Share your thoughts..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                {showRatingForm && ratingListType ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRatingForm(false);
                        setRatingListType(null);
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => addToList(ratingListType)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        `Add to ${ratingListType} list`
                      )}
                    </Button>
                  </>
                ) : !session ? (
                  <div className="w-full text-center">
                    <p className="text-sm text-muted-foreground mb-3">Sign in to add to your lists</p>
                    <Button asChild>
                      <Link href="/auth/signin">Sign in</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => handleListAction('own')}
                      disabled={isSubmitting}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-xs">I own this</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => handleListAction('sniffed')}
                      disabled={isSubmitting}
                    >
                      <Eye className="h-5 w-5" />
                      <span className="text-xs">I sniffed this</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => handleListAction('want')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ShoppingBag className="h-5 w-5" />
                      )}
                      <span className="text-xs">I want this</span>
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
