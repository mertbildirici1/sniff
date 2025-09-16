import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Zap, MessageCircle } from 'lucide-react';
import { Perfume, Ranking } from '@/lib/types';

interface RankingCardProps {
  ranking: Ranking;
  showUser?: boolean;
  onComment?: () => void;
}

export default function RankingCard({ ranking, showUser = false, onComment }: RankingCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    return 'Below Average';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <img 
              src={ranking.perfume.imageUrl || '/placeholder.svg'} 
              alt={ranking.perfume.name} 
              className="h-16 w-16 object-cover rounded-lg border"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">
                {ranking.perfume.brand.name}
              </div>
              <div className="font-semibold text-lg">
                {ranking.perfume.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {ranking.perfume.concentration && (
                  <Badge variant="secondary" className="text-xs">
                    {ranking.perfume.concentration}
                  </Badge>
                )}
                {ranking.perfume.releaseYear && (
                  <Badge variant="outline" className="text-xs">
                    {ranking.perfume.releaseYear}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {showUser && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img 
                src={ranking.user.image || '/placeholder.svg'} 
                alt={ranking.user.name || 'User'} 
                className="h-6 w-6 rounded-full"
              />
              <span>{ranking.user.name || ranking.user.handle}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Enjoyment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${ranking.enjoyment}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(ranking.enjoyment)}`}>
                {ranking.enjoyment}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {getScoreLabel(ranking.enjoyment)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${ranking.performance}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(ranking.performance)}`}>
                {ranking.performance}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {getScoreLabel(ranking.performance)}
            </div>
          </div>
        </div>

        {/* Review Text */}
        {ranking.reviewText && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              "{ranking.reviewText}"
            </p>
          </div>
        )}

        {/* Photo */}
        {ranking.photoUrl && (
          <div className="mb-4">
            <img 
              src={ranking.photoUrl} 
              alt="Perfume photo" 
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {new Date(ranking.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onComment}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
