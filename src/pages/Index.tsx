
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import AnalysisResults from '@/components/AnalysisResults';
import SimilarImages from '@/components/SimilarImages';
import Info from '@/components/Info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult, SimilarImage, analyzeImage, findSimilarImages } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFindingSimilar, setIsFindingSimilar] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setAnalysisResults(null);
    setSimilarImages(null);
    
    // Analyze the image
    setIsAnalyzing(true);
    try {
      const results = await analyzeImage(file);
      setAnalysisResults(results);
      toast({
        title: "Analysis complete",
        description: "Your image has been successfully analyzed.",
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
    
    // Find similar images
    setIsFindingSimilar(true);
    try {
      const similar = await findSimilarImages(file);
      setSimilarImages(similar);
    } catch (error) {
      console.error('Error finding similar images:', error);
      toast({
        variant: "destructive",
        title: "Similar image search failed",
        description: "Failed to find similar images. Please try again.",
      });
    } finally {
      setIsFindingSimilar(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Image Analysis Platform</h1>
          <p className="text-muted-foreground">
            Upload an image to analyze its content and find similar images using our powerful AI.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <ImageUploader onImageSelect={handleImageSelect} />
        </div>
        
        {selectedImage && (
          <div className="space-y-6">
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="analysis">Image Analysis</TabsTrigger>
                <TabsTrigger value="similar">Similar Images</TabsTrigger>
              </TabsList>
              <TabsContent value="analysis" className="mt-6">
                <AnalysisResults result={analysisResults} isLoading={isAnalyzing} />
              </TabsContent>
              <TabsContent value="similar" className="mt-6">
                <SimilarImages images={similarImages} isLoading={isFindingSimilar} />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {!selectedImage && (
          <div className="mt-12">
            <Info />
          </div>
        )}
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 ImageAI Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
