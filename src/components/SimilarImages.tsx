
import React from 'react';
import { SimilarImage } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SimilarImagesProps {
  images: SimilarImage[] | null;
  isLoading: boolean;
}

const SimilarImages: React.FC<SimilarImagesProps> = ({ images, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-4 w-32 bg-muted animate-shimmer rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-muted animate-shimmer rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Similar Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-md border">
              <img 
                src={image.url} 
                alt="Similar image" 
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex justify-between items-end">
                  <Badge className="bg-primary/90">
                    {(image.similarity * 100).toFixed(0)}% Match
                  </Badge>
                  <span className="text-xs text-white/80">{image.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarImages;
