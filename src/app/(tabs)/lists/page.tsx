'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
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
  { value: 'own', label: 'Own', description: 'Perfumes you own' },
  { value: 'sniffed', label: 'Sniffed', description: 'Perfumes you\'ve sniffed' },
  { value: 'want', label: 'Want', description: 'Perfumes you want' }
];

export default function ListsPage() {
  const { data: session, status } = useSession();
  const [activeList, setActiveList] = useState('own');
  const [isLoading, setIsLoading] = useState(false);

  const handleReorder = async (newOrder: string[]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('New order:', newOrder);
    setIsLoading(false);
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
        <p className="text-muted-foreground mt-2">
          Organize and rank your perfumes
        </p>
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