import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Perfume } from "@/lib/types";

interface PerfumeCardProps {
  perfume: Perfume;
  showRank?: boolean;
  rank?: number;
}

export default function PerfumeCard({ perfume, showRank = false, rank }: PerfumeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative">
            <img 
              src={perfume.imageUrl || '/placeholder.svg'} 
              alt={perfume.name} 
              className="h-20 w-20 object-cover rounded-xl border"
            />
            {showRank && rank && (
              <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
                {rank}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-muted-foreground truncate">
              {perfume.brand.name}
            </div>
            <div className="text-lg font-semibold truncate">
              {perfume.name}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {perfume.concentration && (
                <Badge variant="secondary" className="text-xs">
                  {perfume.concentration}
                </Badge>
              )}
              {perfume.releaseYear && (
                <Badge variant="outline" className="text-xs">
                  {perfume.releaseYear}
                </Badge>
              )}
            </div>
            {perfume.notes.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {perfume.notes.slice(0, 3).map((note) => (
                    <Badge key={note.noteId} variant="outline" className="text-xs">
                      {note.note.name}
                    </Badge>
                  ))}
                  {perfume.notes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{perfume.notes.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
