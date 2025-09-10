'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Star, DollarSign, Upload, X } from 'lucide-react';
import { Perfume } from '@/lib/types';

interface RankingFormProps {
  perfume: Perfume;
  onSubmit: (ranking: {
    enjoyment: number;
    versatility: number;
    performance: number;
    value: number;
    reviewText?: string;
    photoUrl?: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RankingForm({ perfume, onSubmit, onCancel, isLoading = false }: RankingFormProps) {
  const [scores, setScores] = useState({
    enjoyment: 0,
    versatility: 0,
    performance: 0,
    value: 0
  });
  const [reviewText, setReviewText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...scores,
      reviewText: reviewText.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ScoreSlider = ({ 
    category, 
    icon: Icon, 
    label, 
    color 
  }: { 
    category: keyof typeof scores; 
    icon: any; 
    label: string; 
    color: string; 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-sm font-semibold ${getScoreColor(scores[category])}`}>
          {scores[category]}
        </span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={scores[category]}
          onChange={(e) => handleScoreChange(category, parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${scores[category]}%, #e5e7eb ${scores[category]}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <img 
            src={perfume.imageUrl || '/placeholder.svg'} 
            alt={perfume.name} 
            className="h-12 w-12 object-cover rounded-lg border"
          />
          <div>
            <div className="text-sm text-muted-foreground">{perfume.brand.name}</div>
            <div className="text-lg font-semibold">{perfume.name}</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreSlider 
              category="enjoyment" 
              icon={Heart} 
              label="Enjoyment" 
              color="text-red-500" 
            />
            <ScoreSlider 
              category="performance" 
              icon={Zap} 
              label="Performance" 
              color="text-blue-500" 
            />
            <ScoreSlider 
              category="versatility" 
              icon={Star} 
              label="Versatility" 
              color="text-yellow-500" 
            />
            <ScoreSlider 
              category="value" 
              icon={DollarSign} 
              label="Value" 
              color="text-green-500" 
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review (Optional)</label>
            <Textarea
              placeholder="Share your thoughts about this perfume..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Photo (Optional)</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Paste image URL..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </div>
            {photoUrl && (
              <div className="relative inline-block">
                <img 
                  src={photoUrl} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  onClick={() => setPhotoUrl('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Ranking'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
