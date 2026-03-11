import { useEffect, useState } from 'react';
import { getUserGenerations, deleteGeneration } from '../../utils/supabase';
import { Download, Trash2, Calendar, Type, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryGallery = ({ user }) => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger for manual refresh

  // Load generations when user changes or refresh is triggered
  useEffect(() => {
    loadGenerations();
  }, [user, refreshKey]);

  // Listen for custom event to refresh history
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('🔄 History refresh event received');
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('refresh-history', handleRefreshEvent);
    return () => window.removeEventListener('refresh-history', handleRefreshEvent);
  }, []);

  const loadGenerations = async () => {
    try {
      console.log('📚 Loading generations for user:', user.id);
      const { data, error } = await getUserGenerations(user.id, 50);

      if (error) {
        console.error('Error fetching generations:', error);
        throw error;
      }

      console.log('✅ Loaded generations:', data?.length || 0);
      setGenerations(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this generation?')) return;

    setDeletingId(id);
    try {
      const { error } = await deleteGeneration(id);
      if (error) throw error;

      // Remove from local state
      setGenerations(generations.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting generation:', error);
      alert('Failed to delete generation. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (generation) => {
    try {
      console.log('⬇️ Downloading generation:', generation.id);

      // Use same priority as display: poster_image_url > transformed_image_url > original_image_url
      const sources = [
        generation.poster_image_url,
        generation.transformed_image_url,
        generation.original_image_url
      ];

      let imageSource = null;
      let sourceType = 'none';

      for (const source of sources) {
        if (!source) continue;
        if (source.startsWith('data:')) {
          if (source.length < 1000) continue; // Skip truncated base64
          imageSource = source;
          sourceType = 'base64';
          break;
        } else if (source.startsWith('http')) {
          imageSource = source;
          sourceType = 'url';
          break;
        }
      }

      if (!imageSource) {
        alert('No image available for this generation');
        return;
      }

      console.log('📥 Downloading via:', sourceType);

      const fileName = `barokah-gen-${generation.greeting_type}-${generation.id.slice(0, 8)}.png`;

      if (sourceType === 'base64') {
        // Base64 data URI — download directly, no proxy needed
        const link = document.createElement('a');
        link.href = imageSource;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Remote URL — use proxy to avoid CORS
        const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageSource)}`;
        const response = await fetch(proxiedUrl);
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      }

      console.log('✅ Download successful');
    } catch (error) {
      console.error('❌ Error downloading:', error);
      alert('Failed to download. Please try again.');

      // Fallback: open in new tab
      const fallbackUrl = generation.poster_image_url || generation.transformed_image_url || generation.original_image_url;
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank');
      }
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-display font-semibold text-white mb-2">
          No History Yet
        </h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          Start generating posters to see them here. Your creations will be saved automatically.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-white">
          Recent Generations ({generations.length})
        </h3>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-gray-300"
          title="Refresh history"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generations.map((generation) => (
          <motion.div
            key={generation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 group"
          >
            {/* Preview Image */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4 bg-gray-900">
              {(() => {
                // Determine best image source with priority:
                // 1. poster_image_url (The final result, often base64)
                // 2. transformed_image_url (Fallback)
                // 3. original_image_url (Last resort)
                const sources = [
                  generation.poster_image_url,
                  generation.transformed_image_url,
                  generation.original_image_url
                ];

                let imgSrc = null;
                let sourceType = 'none';

                for (const source of sources) {
                  if (!source) continue;

                  if (source.startsWith('data:')) {
                    // Direct base64 - check if it looks truncated (too short for an image)
                    if (source.length < 1000) {
                      console.warn(`⚠️ Source looks truncated (${source.length} chars) for generation:`, generation.id);
                      continue;
                    }
                    imgSrc = source;
                    sourceType = 'base64';
                    break;
                  } else if (source.startsWith('http')) {
                    // Remote URL - use proxy
                    imgSrc = `/api/proxy-image?url=${encodeURIComponent(source)}`;
                    sourceType = 'proxy-url';
                    break;
                  }
                }

                console.log('🖼️ Rendering image for generation:', {
                  id: generation.id,
                  mode: generation.generation_mode,
                  usingSource: sourceType,
                  imgSrcPreview: imgSrc?.substring(0, 50) + '...'
                });

                if (!imgSrc) {
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  );
                }

                return (
                  <img
                    src={imgSrc}
                    alt="Generated poster"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Image failed to load:', sourceType, e.target.src.substring(0, 100));
                      e.target.src = 'https://via.placeholder.com/400x500?text=Image+Not+Available';
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully via', sourceType, 'for generation:', generation.id);
                    }}
                    loading="lazy"
                  />
                );
              })()}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDownload(generation)}
                  disabled={deletingId === generation.id}
                  className="p-2 bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors disabled:opacity-50"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(generation.id)}
                  disabled={deletingId === generation.id}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deletingId === generation.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-medium capitalize text-white">
                    {generation.generation_mode}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 capitalize px-2 py-0.5 bg-white/5 rounded-full">
                  {generation.greeting_type}
                </span>
              </div>

              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {generation.generated_text}
              </p>

              {generation.user_name && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Type className="w-3 h-3" />
                  <span>{generation.user_name}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(generation.created_at).toLocaleDateString()}
                </span>
                <span className="text-[10px]">
                  {new Date(generation.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;
