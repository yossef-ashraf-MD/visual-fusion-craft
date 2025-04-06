
// API service for connecting to the Python Flask backend

export interface AnalysisResult {
  labels: {
    name: string;
    confidence: number;
  }[];
  objects: {
    name: string;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  colors: {
    hex: string;
    name: string;
    percentage: number;
  }[];
}

export interface SimilarImage {
  id: string;
  url: string;
  similarity: number;
  source: string;
}

// The base URL for the Flask API
const API_BASE_URL = 'http://localhost:5000/api';

// Function to analyze an image
export const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  console.log('Analyzing image:', imageFile.name);
  
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // If the server is unavailable, use mock data instead
    return {
      labels: [
        { name: 'Nature', confidence: 0.98 },
        { name: 'Landscape', confidence: 0.95 },
        { name: 'Mountain', confidence: 0.87 },
        { name: 'Forest', confidence: 0.82 },
        { name: 'Outdoors', confidence: 0.79 }
      ],
      objects: [
        {
          name: 'Tree',
          boundingBox: { x: 120, y: 200, width: 100, height: 150 }
        },
        {
          name: 'Mountain',
          boundingBox: { x: 300, y: 100, width: 200, height: 150 }
        }
      ],
      colors: [
        { hex: '#4A7B9D', name: 'Steel Blue', percentage: 35 },
        { hex: '#2D5D2A', name: 'Forest Green', percentage: 25 },
        { hex: '#A49966', name: 'Olive', percentage: 15 },
        { hex: '#B8D3E0', name: 'Light Blue', percentage: 15 },
        { hex: '#3C2F2F', name: 'Dark Brown', percentage: 10 }
      ]
    };
  }
};

// Function to find similar images
export const findSimilarImages = async (imageFile: File): Promise<SimilarImage[]> => {
  console.log('Finding similar images for:', imageFile.name);
  
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch(`${API_BASE_URL}/similar`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to find similar images');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error finding similar images:', error);
    
    // If the server is unavailable, use mock data instead
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        similarity: 0.92,
        source: 'Unsplash'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
        similarity: 0.89,
        source: 'Unsplash'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        similarity: 0.85,
        source: 'Unsplash'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        similarity: 0.82,
        source: 'Unsplash'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5',
        similarity: 0.78,
        source: 'Unsplash'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
        similarity: 0.75,
        source: 'Unsplash'
      }
    ];
  }
};
