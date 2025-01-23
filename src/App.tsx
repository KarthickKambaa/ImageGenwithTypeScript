import React, { useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';

interface ApiResponse {
  result: Array<{
    urls: string[];
    seed: number;
    uuid: string;
  }>;
}

function App() {
  const modelVersion = '2.3';
  const apiToken = 'apikeykarthick';
  const [prompt, setPrompt] = useState('a baby riding a bicycle in a field of flowers');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://engine.prod.bria-api.com/v1/text-to-image/base/${modelVersion}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            api_token: apiToken
          },
          body: JSON.stringify({
            prompt,
            num_results: 1,
            sync: true
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data: ApiResponse = await response.json();
      
      if (data.result?.[0]?.urls?.[0]) {
        setImageUrl(data.result[0].urls[0]);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <ImageIcon className="w-8 h-8" />
          Text to Image Generator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Description
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Describe the image you want to generate..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </button>

              {error && (
                <div className="text-red-600 text-sm mt-2">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Right side - Image display */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Image</h2>
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p>No image generated yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;