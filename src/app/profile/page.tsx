'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, BarChart3, Trophy, Calendar, MapPin, Settings } from 'lucide-react';
import RankingCard from '@/components/cards/RankingCard';
import Link from 'next/link';

// Mock stats - this would be fetched from the database
const mockStats = {
  totalRankings: 24,
  averageScore: 78,
  topNotes: ['Bergamot', 'Sandalwood', 'Vanilla', 'Amber', 'Musk'],
  topBrands: ['Le Labo', 'Creed', 'Tom Ford', 'Dior', 'Chanel'],
  streak: 15,
  badges: ['Early Adopter', 'Perfume Expert', 'Community Helper']
};

// Mock rankings - this would be fetched from the database
const mockRankings = [
  {
    id: '1',
    userId: '1',
    perfumeId: '1',
    enjoyment: 85,
    performance: 90,
    reviewText: 'Absolutely love this scent! Perfect for everyday wear and lasts all day.',
    photoUrl: '/placeholder.svg',
    createdAt: new Date('2024-01-15'),
    user: {
      id: '1',
      handle: 'user',
      name: 'User Name',
      image: '/placeholder.svg',
      email: 'user@example.com',
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
    userId: '1',
    perfumeId: '2',
    enjoyment: 95,
    performance: 85,
    reviewText: 'Incredible longevity and sillage. Worth every penny!',
    photoUrl: '/placeholder.svg',
    createdAt: new Date('2024-01-14'),
    user: {
      id: '1',
      handle: 'user',
      name: 'User Name',
      image: '/placeholder.svg',
      email: 'user@example.com',
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.image || '/placeholder.svg'} alt={user?.name || 'User'} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                  {user?.handle && (
                    <Badge variant="outline">@{user.handle}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {mockStats.streak} day streak
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/profile/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.totalRankings}</div>
                <div className="text-sm text-muted-foreground">Perfumes Ranked</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.averageScore}</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Rankings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Rankings</h2>
            <div className="space-y-4">
              {mockRankings.slice(0, 3).map(ranking => (
                <RankingCard 
                  key={ranking.id} 
                  ranking={ranking} 
                  showUser={false}
                />
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Badges</h2>
            <div className="flex flex-wrap gap-2">
              {mockStats.badges.map(badge => (
                <Badge key={badge} variant="secondary" className="text-sm">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <h2 className="text-xl font-semibold">All Rankings</h2>
          <div className="space-y-4">
            {mockRankings.map(ranking => (
              <RankingCard 
                key={ranking.id} 
                ranking={ranking} 
                showUser={false}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Top Notes */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Top Notes</h2>
            <div className="flex flex-wrap gap-2">
              {mockStats.topNotes.map(note => (
                <Badge key={note} variant="outline" className="text-sm">
                  {note}
                </Badge>
              ))}
            </div>
          </div>

          {/* Top Brands */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Top Brands</h2>
            <div className="flex flex-wrap gap-2">
              {mockStats.topBrands.map(brand => (
                <Badge key={brand} variant="outline" className="text-sm">
                  {brand}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activity Chart Placeholder */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Activity chart coming soon</p>
                  <p className="text-sm">Track your perfume discovery journey over time</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

