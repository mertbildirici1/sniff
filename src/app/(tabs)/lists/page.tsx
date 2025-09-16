'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, List as ListIcon } from 'lucide-react';
import { ListRankDnD } from '@/components/list/ListRankDnD';

// Mock data for demonstration
const mockListItems = [
  {
    id: 'item-1',
    perfume: {
      id: '1',
      name: 'Santal 33',
      concentration: 'EDP',
      releaseYear: 2011,
      imageUrl: '/placeholder.svg',
      brand: { name: 'Le Labo' },
      notes: [
        { note: { name: 'Bergamot' } },
        { note: { name: 'Sandalwood' } }
      ]
    },
    rank: 1
  },
  {
    id: 'item-2',
    perfume: {
      id: '2',
      name: 'Aventus',
      concentration: 'EDP',
      releaseYear: 2010,
      imageUrl: '/placeholder.svg',
      brand: { name: 'Creed' },
      notes: [
        { note: { name: 'Bergamot' } },
        { note: { name: 'Pineapple' } }
      ]
    },
    rank: 2
  }
];

const listTypes = [
  { value: 'tried', label: 'Tried', description: 'Perfumes you\'ve tested' },
  { value: 'wishlist', label: 'Wishlist', description: 'Perfumes you want to try' },
  { value: 'collection', label: 'Collection', description: 'Perfumes you own' }
];

export default function ListsPage() {
  const [activeList, setActiveList] = useState('tried');
  const [isLoading, setIsLoading] = useState(false);

  const handleReorder = async (newOrder: string[]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('New order:', newOrder);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">My Lists</h1>
        <p className="text-muted-foreground mt-2">
          Organize and rank your perfumes
        </p>
      </div>

      <Tabs value={activeList} onValueChange={setActiveList} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {listTypes.map((list) => (
            <TabsTrigger key={list.value} value={list.value} className="flex flex-col items-center gap-1">
              <ListIcon className="h-4 w-4" />
              <span className="text-xs">{list.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {listTypes.map((list) => (
          <TabsContent key={list.value} value={list.value} className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{list.label}</h2>
                  <p className="text-sm text-muted-foreground">{list.description}</p>
                </div>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Perfume
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <ListRankDnD 
                  items={mockListItems} 
                  onReorder={handleReorder}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}