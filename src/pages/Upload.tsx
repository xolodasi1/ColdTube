import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadFileToCloudinary } from '../lib/cloudinary';
import { databases } from '../lib/appwrite';
import { ID } from 'appwrite';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [thumbnailProgress, setThumbnailProgress] = useState<number>(0);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Use values from env, or mock temporarily if they are missing
  const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const colId = import.meta.env.VITE_APPWRITE_COLLECTION_VIDEOS_ID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }
    if (!thumbnailFile) {
      setError('Please select a thumbnail image.');
      return;
    }
    if (!user) {
      setError('You must be logged in to upload.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // 1. Upload Thumbnail to Cloudinary
      const thumbUrl = await uploadFileToCloudinary(thumbnailFile, 'image', setThumbnailProgress);
      
      // 2. Upload Video to Cloudinary
      const videoUrl = await uploadFileToCloudinary(videoFile, 'video', setVideoProgress);

      // 3. Save to Appwrite Database (If configured)
      if (dbId && colId) {
        await databases.createDocument(dbId, colId, ID.unique(), {
          title,
          description,
          videoUrl,
          thumbnailUrl: thumbUrl,
          userId: user.$id,
          channelName: user.name,
          views: 0,
          createdAt: new Date().toISOString()
        });
      } else {
        // Just mock success if Appwrite DB isn't configured yet
        console.warn('Appwrite DB configured loosely. URLs generated:', { videoUrl, thumbUrl });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Upload Video</h2>
        <p className="text-slate-400 mb-6">You must be logged in to upload videos.</p>
        <button onClick={() => navigate('/login')} className="bg-cold-accent text-cold-950 px-6 py-2 rounded-lg font-medium">
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload New Video</h1>
        <p className="text-slate-400 text-sm mt-1">Share your cold moments with the community</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-4 rounded-xl mb-6 text-sm flex flex-col">
          <p className="font-semibold">Upload successful!</p>
          <p className="text-emerald-500/80 mt-1">Your video is now uploaded. Redirecting to home...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-cold-900 border border-cold-800 rounded-2xl p-6 md:p-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Video Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-cold-950 border border-cold-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cold-accent focus:ring-1 focus:ring-cold-accent transition-all placeholder:text-slate-600"
            placeholder="A catchy title for your video"
            required
            disabled={isUploading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <textarea 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-cold-950 border border-cold-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cold-accent focus:ring-1 focus:ring-cold-accent transition-all placeholder:text-slate-600 resize-none"
            placeholder="Tell viewers about your video..."
            disabled={isUploading}
          />
        </div>

        {/* File Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Video Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Video File</label>
            <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${videoFile ? 'border-cold-accent bg-cold-accent/5' : 'border-cold-800 hover:border-cold-700 bg-cold-950'}`}>
              <Film className={`w-8 h-8 mb-3 ${videoFile ? 'text-cold-accent' : 'text-slate-500'}`} />
              <div className="text-sm text-center font-medium text-slate-300">
                {videoFile ? videoFile.name : 'Select Video'}
              </div>
              <div className="text-xs text-slate-500 mt-1">MP4, WebM up to 100MB</div>
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
            </label>
            {isUploading && videoProgress > 0 && (
              <div className="w-full bg-cold-950 rounded-full h-1.5 mt-2 overflow-hidden border border-cold-800">
                <div className="bg-cold-accent h-1.5 transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
              </div>
            )}
          </div>

          {/* Thumbnail Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Thumbnail Image</label>
            <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${thumbnailFile ? 'border-cold-accent bg-cold-accent/5' : 'border-cold-800 hover:border-cold-700 bg-cold-950'}`}>
              <ImageIcon className={`w-8 h-8 mb-3 ${thumbnailFile ? 'text-cold-accent' : 'text-slate-500'}`} />
              <div className="text-sm text-center font-medium text-slate-300">
                {thumbnailFile ? thumbnailFile.name : 'Select Thumbnail'}
              </div>
              <div className="text-xs text-slate-500 mt-1">JPG, PNG up to 10MB</div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
            </label>
            {isUploading && thumbnailProgress > 0 && (
              <div className="w-full bg-cold-950 rounded-full h-1.5 mt-2 overflow-hidden border border-cold-800">
                <div className="bg-cold-accent h-1.5 transition-all duration-300" style={{ width: `${thumbnailProgress}%` }}></div>
              </div>
            )}
          </div>

        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-cold-800 flex justify-end">
          <button 
            type="submit" 
            disabled={isUploading || !videoFile || !thumbnailFile || !title}
            className="flex items-center gap-2 bg-cold-accent hover:bg-cold-accent-hover text-cold-950 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-xl px-8 py-3 text-sm transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Publish Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
