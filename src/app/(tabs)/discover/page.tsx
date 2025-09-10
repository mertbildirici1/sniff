'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Star, Filter, Loader2 } from 'lucide-react';
import PerfumeCard from '@/components/cards/PerfumeCard';
import { Perfume } from '@/lib/types';

// Fetch perfumes from API
async function fetchPerfumes(limit = 20): Promise<Perfume[]> {
  const response = await fetch(`/api/perfumes?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch perfumes');
  }
  const data = await response.json();
  return data.perfumes;
}

const editorialLists = [
  {
    id: '1',
    title: 'Best Winter Scents 2024',
    description: 'Cozy and warm fragrances perfect for the colder months',
    author: 'Editorial Team'
  },
  {
    id: '2',
    title: 'Hidden Gems Under $100',
    description: 'Amazing value perfumes that punch above their weight',
    author: 'Community Picks'
  },
  {
    id: '3',
    title: 'Office-Friendly Fragrances',
    description: 'Subtle scents that won\'t overpower in professional settings',
    author: 'Fragrance Experts'
  }
];

const seasonalFilters = [
  { value: 'spring', label: 'Spring', emoji: '🌸' },
  { value: 'summer', label: 'Summer', emoji: '☀️' },
  { value: 'fall', label: 'Fall', emoji: '🍂' },
  { value: 'winter', label: 'Winter', emoji: '❄️' }
];

const priceRanges = [
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 - $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200-plus', label: '$200+' }
];

export default function DiscoverPage() {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [trendingPerfumes, setTrendingPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPerfumes() {
      try {
        setLoading(true);
        const perfumes = await fetchPerfumes(20);
        setTrendingPerfumes(perfumes);
      } catch (err) {
        setError('Failed to load perfumes');
        console.error('Error loading perfumes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPerfumes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-muted-foreground mt-2">
          Find new perfumes based on your preferences
        </p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="editorial" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Editorial
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading perfumes...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500">
                  <p>{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingPerfumes.map(perfume => (
                  <PerfumeCard key={perfume.id} perfume={perfume} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4" />
                <p>Personalized recommendations coming soon</p>
                <p className="text-sm mt-2">Based on your preferences and past rankings</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editorial" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Editorial Lists</h2>
            <div className="space-y-4">
              {editorialLists.map(list => (
                <Card key={list.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{list.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{list.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>By {list.author}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trendingPerfumes.slice(0, 3).map(perfume => (
                        <PerfumeCard key={perfume.id} perfume={perfume} />
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All in This List
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seasonal Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Season</CardTitle>
                <p className="text-sm text-muted-foreground">Find perfumes perfect for each season</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {seasonalFilters.map(season => (
                    <Button
                      key={season.value}
                      variant={selectedSeason === season.value ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setSelectedSeason(
                        selectedSeason === season.value ? null : season.value
                      )}
                    >
                      <span>{season.emoji}</span>
                      {season.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Range</CardTitle>
                <p className="text-sm text-muted-foreground">Filter by your budget</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <Button
                      key={range.value}
                      variant={selectedPriceRange === range.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedPriceRange(
                        selectedPriceRange === range.value ? null : range.value
                      )}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Filters Coming Soon */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">More Filters</CardTitle>
              <p className="text-sm text-muted-foreground">Additional discovery options</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4" />
                  <p>More filter options coming soon</p>
                  <p className="text-sm mt-2">Notes, concentration, gender target, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
