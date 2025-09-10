'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, ExternalLink, Filter } from 'lucide-react';

// Mock store data
const mockStores = [
  {
    id: '1',
    name: 'Sephora',
    address: '123 5th Ave, New York, NY 10001',
    lat: 40.7505,
    lng: -73.9934,
    brands: ['Dior', 'Chanel', 'Tom Ford', 'YSL'],
    type: 'Retail Store',
    hours: '10:00 AM - 9:00 PM',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Le Labo Boutique',
    address: '456 Bleecker St, New York, NY 10014',
    lat: 40.7328,
    lng: -74.0026,
    brands: ['Le Labo'],
    type: 'Boutique',
    hours: '11:00 AM - 7:00 PM',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'Creed Boutique',
    address: '789 Madison Ave, New York, NY 10065',
    lat: 40.7614,
    lng: -73.9776,
    brands: ['Creed'],
    type: 'Boutique',
    hours: '10:00 AM - 6:00 PM',
    phone: '(555) 345-6789'
  },
  {
    id: '4',
    name: 'Ulta Beauty',
    address: '321 Broadway, New York, NY 10007',
    lat: 40.7128,
    lng: -74.0060,
    brands: ['Dior', 'Chanel', 'Giorgio Armani', 'Versace'],
    type: 'Retail Store',
    hours: '9:00 AM - 10:00 PM',
    phone: '(555) 456-7890'
  }
];

const brandFilters = ['All', 'Dior', 'Chanel', 'Tom Ford', 'Le Labo', 'Creed', 'YSL', 'Giorgio Armani', 'Versace'];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const filteredStores = mockStores.filter(store => {
    const matchesSearch = searchQuery === '' || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = selectedBrand === 'All' || 
      store.brands.includes(selectedBrand);
    
    return matchesSearch && matchesBrand;
  });

  const openInMaps = (store: typeof mockStores[0]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Map</h1>
        <p className="text-muted-foreground mt-2">
          Find stores and boutiques near you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search stores or addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Brand Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter by brand:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandFilters.map(brand => (
              <Badge
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <Card className="h-96">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Interactive Map</p>
            <p className="text-sm">Map integration coming soon</p>
            <p className="text-xs mt-2">For now, browse stores below and click to open in Google Maps</p>
          </div>
        </CardContent>
      </Card>

      {/* Store List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredStores.length} stores found
          </h2>
        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p>No stores found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStores.map(store => (
              <Card 
                key={store.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedStore === store.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {store.type}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInMaps(store);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {store.address}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium mb-1">Hours: {store.hours}</div>
                      <div className="text-muted-foreground">Phone: {store.phone}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Available Brands:</div>
                      <div className="flex flex-wrap gap-1">
                        {store.brands.map(brand => (
                          <Badge key={brand} variant="secondary" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
