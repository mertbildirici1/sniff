'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, List as ListIcon, Search, Loader2 } from 'lucide-react';
import { ListRankDnD } from '@/components/list/ListRankDnD';
import { toast } from 'sonner';

interface Perfume {
  id: string;
  name: string;
  concentration?: string;
  releaseYear?: number;
  imageUrl?: string;
  brand: { id: string; name: string };
}

interface ListItem {
  id: string;
  perfume: Perfume & { notes: any[] };
  rank: number;
}

interface List {
  id: string;
  name: string;
  type: 'own' | 'sniffed' | 'want';
  items: ListItem[];
}

const listTypes = [
  { value: 'own', label: 'Own' },
  { value: 'sniffed', label: 'Sniffed' },
  { value: 'want', label: 'Want' }
];

export default function ListsPage() {
  const { data: session, status } = useSession();
  const [activeList, setActiveList] = useState('own');
  const [isLoading, setIsLoading] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogListType, setDialogListType] = useState<'own' | 'sniffed' | 'want'>('own');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Perfume[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [enjoyment, setEnjoyment] = useState(5.0);
  const [performance, setPerformance] = useState(5.0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch lists on mount
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchLists = async () => {
      setIsLoadingLists(true);
      try {
        const res = await fetch('/api/lists');
        if (res.ok) {
          const data = await res.json();
          setLists(data.lists || []);
        }
      } catch (error) {
        console.error('Failed to fetch lists', error);
      } finally {
        setIsLoadingLists(false);
      }
    };

    fetchLists();
  }, [status]);

  // Search perfumes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchPerfumes = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/perfumes?search=${encodeURIComponent(searchQuery)}&limit=10`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.perfumes || []);
        }
      } catch (error) {
        console.error('Failed to search perfumes', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchPerfumes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleReorder = async (newOrder: string[]) => {
    setIsLoading(true);
    // Find the list for active type
    const list = lists.find(l => l.type === activeList);
    if (!list) {
      setIsLoading(false);
      return;
    }

    try {
      await fetch(`/api/lists/${list.id}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });
    } catch (error) {
      console.error('Failed to reorder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = (listType: 'own' | 'sniffed' | 'want') => {
    setDialogListType(listType);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPerfume(null);
    setEnjoyment(5.0);
    setPerformance(5.0);
    setReviewText('');
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedPerfume) return;

    setIsSubmitting(true);
    try {
      // For own and sniffed, create a ranking first
      if (dialogListType === 'own' || dialogListType === 'sniffed') {
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

      // Find or create the list
      let list = lists.find(l => l.type === dialogListType);

      if (!list) {
        // Create the list
        const listRes = await fetch('/api/lists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: dialogListType.charAt(0).toUpperCase() + dialogListType.slice(1),
            type: dialogListType,
          }),
        });

        if (!listRes.ok) {
          throw new Error('Failed to create list');
        }

        const listData = await listRes.json();
        list = { ...listData.list, items: [] };
        setLists(prev => [...prev, list!]);
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

      const itemData = await itemRes.json();

      // Update local state
      setLists(prev =>
        prev.map(l =>
          l.id === list!.id
            ? { ...l, items: [...l.items, itemData.item] }
            : l
        )
      );

      toast.success(`Added ${selectedPerfume.name} to your ${dialogListType} list!`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding perfume:', error);
      toast.error('Failed to add perfume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getListItems = (type: string) => {
    const list = lists.find(l => l.type === type);
    return list?.items || [];
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[50vh]">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Sign in to see your lists</h1>
          <p className="text-muted-foreground max-w-md">
            Save, rank, and organize your perfumes across your own, sniffed, and want lists.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signup">Create account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">My Lists</h1>
      </div>

      <Tabs value={activeList} onValueChange={setActiveList} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-muted/50 p-2 rounded-xl">
          {listTypes.map((list) => (
            <TabsTrigger
              key={list.value}
              value={list.value}
              className="flex h-20 w-full flex-col items-center justify-center gap-2 rounded-lg border border-transparent bg-background/60 transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border"
            >
              <ListIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{list.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {listTypes.map((list) => (
          <TabsContent key={list.value} value={list.value} className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{list.label}</h2>
                </div>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => openAddDialog(list.value as 'own' | 'sniffed' | 'want')}
                >
                  <Plus className="h-4 w-4" />
                  Add Perfume
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                {isLoadingLists ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : getListItems(list.value).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No perfumes in this list yet. Click "Add Perfume" to get started!
                  </p>
                ) : (
                  <ListRankDnD
                    items={getListItems(list.value)}
                    onReorder={handleReorder}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Perfume Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Add Perfume to {dialogListType.charAt(0).toUpperCase() + dialogListType.slice(1)} List
            </DialogTitle>
            <DialogDescription>
              {dialogListType === 'want'
                ? 'Search for a perfume to add to your want list.'
                : 'Search for a perfume and add your rating.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Perfumes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No perfumes found
                  </p>
                ) : (
                  <div className="divide-y">
                    {searchResults.map((perfume) => (
                      <button
                        key={perfume.id}
                        className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                          selectedPerfume?.id === perfume.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedPerfume(perfume)}
                      >
                        <div className="font-medium">{perfume.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {perfume.brand.name}
                          {perfume.concentration && ` • ${perfume.concentration}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Perfume */}
            {selectedPerfume && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Selected:</div>
                <div className="font-medium">{selectedPerfume.name}</div>
                <div className="text-sm text-muted-foreground">{selectedPerfume.brand.name}</div>
              </div>
            )}

            {/* Rating fields for own/sniffed */}
            {selectedPerfume && (dialogListType === 'own' || dialogListType === 'sniffed') && (
              <div className="space-y-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="enjoyment">Enjoyment: {enjoyment.toFixed(1)}</Label>
                  <Input
                    id="enjoyment"
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={enjoyment}
                    onChange={(e) => setEnjoyment(parseFloat(e.target.value))}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="performance">Performance: {performance.toFixed(1)}</Label>
                  <Input
                    id="performance"
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={performance}
                    onChange={(e) => setPerformance(parseFloat(e.target.value))}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review">Review (optional)</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your thoughts on this perfume..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedPerfume || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to List'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
