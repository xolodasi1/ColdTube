import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { databases } from '../lib/appwrite';

export default function VideoView() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '69e4fb2b003213a395fe';
      const colId = import.meta.env.VITE_APPWRITE_COLLECTION_VIDEOS_ID || 'videos';

      try {
        if (!id) return;
        const doc = await databases.getDocument(dbId, colId, id);
        setVideo(doc);
      } catch (err: any) {
        console.error(err);
        setError('Video not found or database error.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-6 animate-pulse">
        <div className="aspect-video bg-cold-900 rounded-xl mb-4 w-full"></div>
        <div className="h-8 bg-cold-900 rounded-lg w-2/3 mb-4"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cold-900"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-cold-900 rounded w-32"></div>
            <div className="h-3 bg-cold-900 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center text-red-400">
        <p>{error}</p>
        <Link to="/" className="text-cold-accent mt-4 hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Video Section */}
      <div className="lg:col-span-2">
        <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-cold-800">
          <video 
            src={video.videoUrl} 
            controls 
            autoPlay 
            poster={video.thumbnailUrl}
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>
        
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-white">{video.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="mt-6 flex items-center justify-between border-b border-cold-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cold-800 to-cold-900 border border-cold-700 flex items-center justify-center text-xl text-cold-accent font-bold">
              {video.channelName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-slate-200">{video.channelName || 'Unknown User'}</p>
              <p className="text-xs text-slate-500">Subscribers hidden</p>
            </div>
            <button className="ml-4 bg-slate-200 hover:bg-white text-black font-semibold px-4 py-2 rounded-full text-sm transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-6 bg-cold-900 rounded-xl p-4 border border-cold-800">
          <p className="text-sm text-slate-300 whitespace-pre-wrap">
            {video.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Placeholder Sidebar for Related Videos */}
      <div className="hidden lg:flex flex-col gap-4">
        <h3 className="font-medium text-slate-400 mb-2">More cold videos</h3>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 group cursor-pointer">
            <div className="w-40 aspect-video bg-cold-900 rounded-lg flex-shrink-0 border border-cold-800 group-hover:border-cold-accent overflow-hidden transition-colors">
               <img src={`https://picsum.photos/seed/${i + 130}cold/300/170`} className="w-full h-full object-cover" alt="Related" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-cold-accent transition-colors">
                Chilled Aesthetics #{i}
              </p>
              <p className="text-xs text-slate-500 mt-1">Ice Studio</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
