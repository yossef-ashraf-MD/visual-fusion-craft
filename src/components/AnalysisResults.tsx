
import React from 'react';
import { AnalysisResult } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, EyeIcon, Paintbrush } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-4 w-32 bg-muted animate-shimmer rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted animate-shimmer rounded"></div>
                <div className="h-4 w-48 bg-muted animate-shimmer rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Image Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="labels">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="labels" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Labels
            </TabsTrigger>
            <TabsTrigger value="objects" className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              Objects
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Paintbrush className="h-4 w-4" />
              Colors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="labels" className="pt-4 space-y-4">
            <div className="space-y-3">
              {result.labels.map((label, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{label.name}</span>
                    <span className="text-muted-foreground">{(label.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={label.confidence * 100} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="objects" className="pt-4">
            <div className="space-y-2">
              {result.objects.map((object, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/5">
                    {object.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Position: {object.boundingBox.x}, {object.boundingBox.y}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="pt-4">
            <div className="space-y-3">
              {result.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded border" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>{color.name}</span>
                      <span className="text-muted-foreground">{color.percentage}%</span>
                    </div>
                    <Progress value={color.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
