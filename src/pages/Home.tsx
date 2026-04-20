import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../lib/appwrite';
import { Query } from 'appwrite';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '69e4fb2b003213a395fe';
      const colId = import.meta.env.VITE_APPWRITE_COLLECTION_VIDEOS_ID || 'videos';

      try {
        const response = await databases.listDocuments(dbId, colId, [
          Query.orderDesc('$createdAt'),
          Query.limit(20)
        ]);
        setVideos(response.documents);
      } catch (err: any) {
        console.error('Failed to fetch videos:', err);
        
        if (err.message === 'NetworkError when attempting to fetch resource.' || err.message.includes('Network Error')) {
          setIsNetworkError(true);
        } else {
          setError(err.message || 'Could not load videos. Please check your Appwrite collection.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="bg-cold-800 rounded-xl aspect-video w-full"></div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-cold-800 flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-4 bg-cold-800 rounded w-full"></div>
                <div className="h-3 bg-cold-800 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isNetworkError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-yellow-500/10 text-yellow-500 p-6 rounded-xl border border-yellow-500/20 max-w-2xl">
          <p className="font-semibold text-lg mb-2">CORS / Network Error</p>
          <p className="text-sm mb-4">
            Appwrite блокирует запрос. Это значит, что твой текущий домен (или домен Vercel) не добавлен в список Web Platforms.
          </p>
          <div className="bg-black/20 p-4 rounded-lg text-left text-xs space-y-2">
            <p><strong>Как быстро починить (разрешить доступ всем сайтам):</strong></p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Открой свою <a href="https://cloud.appwrite.io/console/project-fra-69e4f8980019f8196e7b/overview" target="_blank" rel="noreferrer" className="underline text-blue-400">консоль Appwrite</a>.</li>
              <li>Пролистай вниз до секции <strong>Platforms</strong>.</li>
              <li>Нажми <strong>Add Platform</strong> и выбери <strong>Web App</strong>.</li>
              <li>В поле <strong>Name</strong> впиши: <code>All domains</code></li>
              <li><strong>САМОЕ ГЛАВНОЕ:</strong> В поле <strong>Hostname</strong> вставь ровно один символ: <code>*</code> (просто звездочка).</li>
              <li>Нажми <strong>Next</strong>.</li>
            </ol>
            <p className="mt-4 text-gray-400 italic">Звездочка (*) разрешит любому сайту (AI Studio, версель, локалхост) общаться с твоей базой без CORS ошибок.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 max-w-lg">
          <p className="font-semibold mb-1">Database Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-red-400 mt-2">
            Make sure your Database ID is correct and the Collection "videos" has the correct attributes.
          </p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-2">No videos yet</h2>
        <p className="text-slate-500 mb-6">Be the first to upload a video to ColdTube!</p>
        <Link to="/upload" className="bg-cold-accent text-cold-950 px-6 py-2.5 rounded-xl font-semibold transition-colors hover:bg-cold-accent-hover">
          Upload Video
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <Link to={`/video/${video.$id}`} key={video.$id} className="group cursor-pointer flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-cold-900 border border-cold-800 group-hover:border-cold-accent transition-colors">
            <img 
              src={video.thumbnailUrl || `https://picsum.photos/seed/${video.$id}/600/340`} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cold-800 to-cold-900 border border-cold-700 flex items-center justify-center flex-shrink-0 text-cold-accent font-bold">
              {video.channelName?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <h3 className="text-slate-100 font-medium text-sm line-clamp-2 leading-tight group-hover:text-cold-accent transition-colors">
                {video.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{video.channelName || 'Unknown User'}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
