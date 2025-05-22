'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function Home() {
  const [tasteProfile, setTasteProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !tasteProfile) return;

    setLoading(true);
    try {
      // Convert the file to base64
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/analyze-wine-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64String,
          tasteProfile,
        }),
      });

      const data = await response.json();
      setResult(data.recommendation);
    } catch (error) {
      console.error('Error analyzing wine list:', error);
      setResult('Error analyzing wine list. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Wine List Scanner</h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-lg">Your Wine Taste Profile:</span>
            <textarea
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white p-3"
              rows={3}
              placeholder="Describe your wine preferences (e.g., I prefer full-bodied red wines with notes of dark fruits and moderate tannins)"
              value={tasteProfile}
              onChange={(e) => setTasteProfile(e.target.value)}
            />
          </label>

          <div className="flex justify-center">
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                <Upload className="w-5 h-5" />
                Upload Wine List
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-sm text-gray-400">
                Take a photo or upload an image of the wine list
              </span>
            </label>
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Analyzing wine list...</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Recommendation:</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
