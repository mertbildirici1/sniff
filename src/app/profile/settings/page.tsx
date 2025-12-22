'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LogOut, Loader2, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  handle: string;
  name: string | null;
  bio: string | null;
  city: string | null;
}

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Profile form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Bio form state
  const [bio, setBio] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch profile data
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name || '');
          setCity(data.city || '');
          setBio(data.bio || '');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [status]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        toast.success('Bio updated successfully!');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Failed to save bio:', error);
      toast.error('Failed to update bio. Please try again.');
    } finally {
      setIsSavingBio(false);
    }
  };

  if (status === 'loading' || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <div>
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your display name and location.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Where are you based?"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
            {isSavingProfile ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Edit Bio */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <div>
              <h2 className="text-xl font-semibold">Edit Bio</h2>
              <p className="text-sm text-muted-foreground">
                Tell others about yourself and your fragrance journey.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Share a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/500 characters
            </p>
          </div>
          <Button onClick={handleSaveBio} disabled={isSavingBio}>
            {isSavingBio ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Bio'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">
                Sign out of your account.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

