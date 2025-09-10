'use client';

import RankingCard from '@/components/cards/RankingCard';
import { Perfume, Ranking, User } from '@/lib/types';

// Mock data for demonstration
const mockRankings: Ranking[] = [
  {
    id: '1',
    userId: '1',
    perfumeId: '1',
    enjoyment: 85,
    versatility: 70,
    performance: 90,
    value: 75,
    reviewText: 'Absolutely love this scent! Perfect for everyday wear and lasts all day.',
    photoUrl: '/placeholder.svg',
    createdAt: new Date('2024-01-15'),
    user: {
      id: '1',
      handle: 'perfumelover',
      name: 'Sarah Johnson',
      image: '/placeholder.svg',
      email: 'sarah@example.com',
      bio: 'Perfume enthusiast',
      city: 'New York',
      joinedAt: new Date('2023-06-01'),
      privacy: 'public',
      streak: 15
    },
    perfume: {
      id: '1',
      name: 'Santal 33',
      concentration: 'EDP',
      releaseYear: 2011,
      imageUrl: '/placeholder.svg',
      brand: { id: '1', name: 'Le Labo', country: 'US' },
      notes: [
        { perfumeId: '1', noteId: '1', position: 'top', note: { id: '1', name: 'Bergamot', family: 'Citrus' } },
        { perfumeId: '1', noteId: '2', position: 'heart', note: { id: '2', name: 'Sandalwood', family: 'Woody' } }
      ]
    }
  },
  {
    id: '2',
    userId: '2',
    perfumeId: '2',
    enjoyment: 95,
    versatility: 80,
    performance: 85,
    value: 60,
    reviewText: 'Incredible longevity and sillage. Worth every penny!',
    photoUrl: '/placeholder.svg',
    createdAt: new Date('2024-01-14'),
    user: {
      id: '2',
      handle: 'fraghead',
      name: 'Mike Chen',
      image: '/placeholder.svg',
      email: 'mike@example.com',
      bio: 'Fragrance collector',
      city: 'Los Angeles',
      joinedAt: new Date('2023-08-15'),
      privacy: 'public',
      streak: 8
    },
    perfume: {
      id: '2',
      name: 'Aventus',
      concentration: 'EDP',
      releaseYear: 2010,
      imageUrl: '/placeholder.svg',
      brand: { id: '2', name: 'Creed', country: 'FR' },
      notes: [
        { perfumeId: '2', noteId: '1', position: 'top', note: { id: '1', name: 'Bergamot', family: 'Citrus' } },
        { perfumeId: '2', noteId: '3', position: 'heart', note: { id: '3', name: 'Pineapple', family: 'Fruity' } }
      ]
    }
  }
];

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Feed</h1>
        <p className="text-muted-foreground mt-2">
          See what your friends are discovering and ranking
        </p>
      </div>
      
      <div className="space-y-6">
        {mockRankings.map((ranking) => (
          <RankingCard 
            key={ranking.id} 
            ranking={ranking} 
            showUser={true}
            onComment={() => console.log('Comment on ranking:', ranking.id)}
          />
        ))}
      </div>
    </div>
  );
}
