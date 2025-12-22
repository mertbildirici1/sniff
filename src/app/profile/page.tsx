'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, BarChart3, Settings, List as ListIcon } from 'lucide-react';
import RankingCard from '@/components/cards/RankingCard';
import Link from 'next/link';
import type { Ranking } from '@/lib/types';

// Mock top lists - replace with real data when available
const mockTopNotes = ['Bergamot', 'Sandalwood', 'Vanilla', 'Amber', 'Musk'];
const mockTopBrands = ['Le Labo', 'Creed', 'Tom Ford', 'Dior', 'Chanel'];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userBio, setUserBio] = useState<string | null>(null);
  const [listCounts, setListCounts] = useState({ own: 0, sniffed: 0, want: 0 });
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
        if (isMounted && data.bio) {
          setUserBio(data.bio);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };


    fetchMe();
    return () => {
      isMounted = false;
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchLists = async () => {
      try {
        const res = await fetch('/api/lists');
        if (!res.ok) return;
        const data = await res.json();
        const counts = { own: 0, sniffed: 0, want: 0 };
        (data.lists || []).forEach((list: any) => {
          const len = Array.isArray(list.items) ? list.items.length : 0;
          if (list.type === 'own') counts.own = len;
          if (list.type === 'sniffed') counts.sniffed = len;
          if (list.type === 'want') counts.want = len;
        });
        setListCounts(counts);
      } catch (error) {
        console.error('Failed to load lists', error);
      }
    };

    fetchLists();
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
                {userBio && (
                  <p className="text-sm text-muted-foreground mb-2">{userBio}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockTopNotes.slice(0, 3).map(note => (
                    <Badge key={note} variant="secondary" className="text-xs">
                      {note}
                    </Badge>
                  ))}
                  {mockTopBrands.slice(0, 3).map(brand => (
                    <Badge key={brand} variant="outline" className="text-xs">
                      {brand}
                    </Badge>
                  ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <ListIcon className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{listCounts.own}</div>
                <div className="text-sm text-muted-foreground">Own</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ListIcon className="h-5 w-5 text-emerald-500" />
              <div>
                <div className="text-2xl font-bold">{listCounts.sniffed}</div>
                <div className="text-sm text-muted-foreground">Sniffed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ListIcon className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">{listCounts.want}</div>
                <div className="text-sm text-muted-foreground">Want</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Rankings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Rankings</h2>
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
    </div>
  );
}


