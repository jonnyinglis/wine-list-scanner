'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Camera, CameraOff } from 'lucide-react';
import type { WebcamProps } from 'react-webcam';

const Webcam = dynamic<WebcamProps>(() => import('react-webcam').then((mod) => mod.default), {
  ssr: false,
});

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [tasteProfile, setTasteProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleScan = async (imageData: string | null) => {
    if (!imageData || !tasteProfile) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-wine-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
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
    setIsScanning(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Wine List Scanner</h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-lg">Your Wine Taste Profile:</span>
            <textarea
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              rows={3}
              placeholder="Describe your wine preferences (e.g., I prefer full-bodied red wines with notes of dark fruits and moderate tannins)"
              value={tasteProfile}
              onChange={(e) => setTasteProfile(e.target.value)}
            />
          </label>

          <div className="flex justify-center">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Start Scanning
                </>
              )}
            </button>
          </div>
        </div>

        {isScanning && (
          <div className="relative">
            <Webcam
              className="rounded-lg w-full"
              screenshotFormat="image/jpeg"
              audio={false}
              videoConstraints={{
                facingMode: 'environment'
              }}
            />
            <button
              onClick={() => {
                const webcam = document.querySelector('video');
                if (webcam) {
                  const canvas = document.createElement('canvas');
                  canvas.width = webcam.videoWidth;
                  canvas.height = webcam.videoHeight;
                  canvas.getContext('2d')?.drawImage(webcam, 0, 0);
                  const image = canvas.toDataURL('image/jpeg');
                  handleScan(image);
                }
              }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              Capture & Analyze
            </button>
          </div>
        )}

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
