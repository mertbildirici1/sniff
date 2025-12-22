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
import type { Ranking } from '@/lib/types';
import { dataTagErrorSymbol } from '@tanstack/react-query';

// Mock stats - this would be fetched from the database
const mockStats = {
  totalRankings: 24,
  averageScore: 78,
  topNotes: ['Bergamot', 'Sandalwood', 'Vanilla', 'Amber', 'Musk'],
  topBrands: ['Le Labo', 'Creed', 'Tom Ford', 'Dior', 'Chanel'],
  streak: 15,
  badges: ['Early Adopter', 'Perfume Expert', 'Community Helper']
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStreak, setUserStreak] = useState<number | null>(null);
  const [recentRankings, setRecentRankings] = useState<Ranking[]>([]);
  const [totalRankings, setTotalRankings] = useState<number>(0);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [rankingsError, setRankingsError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let isMounted = true;
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && typeof data.streak === 'number') {
          setUserStreak(data.streak);
        }
        console.log(data)
      } catch (error) {
        console.error('Failed to load user streak', error);
      }
    };


    fetchMe();
    return () => {
      isMounted = false;
    };
  }, [status]);

  useEffect(() => {
    const loadRankings = async () => {
      if (status !== 'authenticated') return;
      setIsLoadingRankings(true);
      setRankingsError(null);
      try {
        const handle = session.user.handle;
        const id = (session.user as any).id;
        const params = new URLSearchParams({ limit: '5' });
        if (handle) params.set('userHandle', handle);
        if (id) params.set('userId', id);

        const res = await fetch(`/api/rankings?${params.toString()}`);
        if (!res.ok) {
          setRankingsError('Failed to load rankings');
          return;
        }
        const data = await res.json();
        const rankings = (data.rankings || []).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        })) as Ranking[];
        setRecentRankings(rankings);
        setTotalRankings(data.pagination?.total ?? 0);
      } catch (error) {
        console.error('Failed to load rankings', error);
        setRankingsError('Failed to load rankings');
      } finally {
        setIsLoadingRankings(false);
      }
    };

    loadRankings();
  }, [session?.user, status]);

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
                    {(userStreak ?? mockStats.streak)} day streak
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
                <div className="text-2xl font-bold">{totalRankings}</div>
                <div className="text-sm text-muted-foreground">Perfumes Ranked</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{userStreak ?? mockStats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Recent Rankings</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Rankings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Rankings</h2>
            <div className="space-y-4">
              {isLoadingRankings && (
                <div className="flex items-center justify-center py-6">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                </div>
              )}
              {!isLoadingRankings && rankingsError && (
                <p className="text-sm text-red-500">{rankingsError}</p>
              )}
              {!isLoadingRankings && !rankingsError && recentRankings.length === 0 && (
                <p className="text-sm text-muted-foreground">No rankings yet.</p>
              )}
              {!isLoadingRankings && !rankingsError && recentRankings.map(ranking => (
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

        </TabsContent>
      </Tabs>
    </div>
  );
}


