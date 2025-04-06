
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanSearch, Images, Server } from 'lucide-react';

const Info = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ScanSearch className="h-5 w-5 text-primary" />
            Image Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            Our AI can identify objects, scenes, colors, and more from any image you upload.
            Get detailed insights about what's in your images.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Images className="h-5 w-5 text-primary" />
            Similar Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            Find visually similar images to your uploads. Discover related content
            based on visual patterns and content.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Powered by Flask
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            This app connects to a Python Flask backend with two powerful endpoints
            for image analysis and similar image search. Backend code included!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Info;
