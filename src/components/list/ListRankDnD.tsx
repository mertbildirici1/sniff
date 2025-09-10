'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ListItem {
  id: string;
  perfume: {
    id: string;
    name: string;
    brand: { name: string };
    concentration?: string;
    releaseYear?: number;
    imageUrl?: string;
    notes: Array<{ note: { name: string } }>;
  };
  rank: number;
}

interface ListRankDnDProps {
  items: ListItem[];
  onReorder: (ids: string[]) => void;
  isLoading?: boolean;
}

export function ListRankDnD({ items, onReorder, isLoading = false }: ListRankDnDProps) {
  const [localItems, setLocalItems] = useState(items);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-muted rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (localItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p>No perfumes in this list yet</p>
          <p className="text-sm mt-2">Add some perfumes to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {localItems.map((item, index) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative">
                <img 
                  src={item.perfume.imageUrl || '/placeholder.svg'} 
                  alt={item.perfume.name} 
                  className="h-20 w-20 object-cover rounded-xl border"
                />
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-muted-foreground truncate">
                  {item.perfume.brand.name}
                </div>
                <div className="text-lg font-semibold truncate">
                  {item.perfume.name}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {item.perfume.concentration && (
                    <Badge variant="secondary" className="text-xs">
                      {item.perfume.concentration}
                    </Badge>
                  )}
                  {item.perfume.releaseYear && (
                    <Badge variant="outline" className="text-xs">
                      {item.perfume.releaseYear}
                    </Badge>
                  )}
                </div>
                {item.perfume.notes.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {item.perfume.notes.slice(0, 3).map((note, noteIndex) => (
                        <Badge key={noteIndex} variant="outline" className="text-xs">
                          {note.note.name}
                        </Badge>
                      ))}
                      {item.perfume.notes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.perfume.notes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}