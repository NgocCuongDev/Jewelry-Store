// components/PostCard.jsx
import Link from 'next/link';
import { IMAGE_URL } from '../../config';
import { useState } from 'react';

const PostCard = ({ post }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath || imageError) return '/images/default-post.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_URL}${imagePath}`;
  };

  const getReadingTime = () => {
    // Ước tính thời gian đọc dựa trên description
    const wordsPerMinute = 200;
    const wordCount = post.description?.split(/\s+/).length || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    return readingTime;
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // TODO: Integrate with your like API
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // TODO: Integrate with your bookmark API
  };

  return (
    <article className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-white/20 hover:border-blue-200/50 relative">
      
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Image Container với hiệu ứng nâng cao */}
        <div className="relative overflow-hidden h-56">
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          )}
          
          {/* Main Image */}
          <img
            src={getImageUrl(post.image)}
            alt={post.title || 'Bài viết'}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              imageLoaded 
                ? 'group-hover:scale-110 opacity-100' 
                : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
          
          {/* Topic Badge */}
          {post.topic && (
            <div className="absolute top-4 left-4">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20">
                {post.topic.name}
              </span>
            </div>
          )}
          
          {/* Reading Time & Date */}
          <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
            <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl text-xs font-medium flex items-center space-x-1 border border-white/10">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{getReadingTime()} phút</span>
            </div>
          </div>

          {/* Hover Effect Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>

        {/* Content Section */}
        <div className="p-7 relative">
          {/* Date với icon đẹp hơn */}
          <div className="flex items-center text-sm text-gray-500/80 mb-4">
            <div className="flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-gray-100">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-700">{formatDate(post.created_at)}</span>
            </div>
          </div>

          {/* Title với gradient text */}
          <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight min-h-[3.5rem] bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
            {post.title || 'Không có tiêu đề'}
          </h3>

          {/* Description với styling đẹp */}
          <p className="text-gray-600/90 mb-6 line-clamp-3 leading-relaxed text-lg min-h-[5.5rem] font-light tracking-wide">
            {post.description || 'Không có mô tả...'}
          </p>

          {/* Interactive Read More Button & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
            <Link 
              href={`/chi-tiet-bai-viet/${post.slug || post.id}`}
              className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              
              {/* Button Content */}
              <span className="relative z-10">Khám phá ngay</span>
              <svg className="w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 -left-full group-hover/btn:left-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-all duration-700" />
            </Link>
            
            {/* Like/Bookmark Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleLike}
                className={`p-3 rounded-2xl transition-all duration-300 group/like border ${
                  isLiked 
                    ? 'bg-red-50/80 border-red-200 text-red-500 shadow-lg' 
                    : 'bg-gray-50/80 border-gray-100 text-gray-500 hover:bg-red-50/80 hover:text-red-500'
                }`}
              >
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isLiked 
                      ? 'scale-110 fill-red-500' 
                      : 'group-hover/like:scale-110'
                  }`} 
                  fill={isLiked ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <button 
                onClick={handleBookmark}
                className={`p-3 rounded-2xl transition-all duration-300 group/bookmark border ${
                  isBookmarked 
                    ? 'bg-blue-50/80 border-blue-200 text-blue-500 shadow-lg' 
                    : 'bg-gray-50/80 border-gray-100 text-gray-500 hover:bg-blue-50/80 hover:text-blue-500'
                }`}
              >
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isBookmarked 
                      ? 'scale-110 fill-blue-500' 
                      : 'group-hover/bookmark:scale-110'
                  }`} 
                  fill={isBookmarked ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-blue-500 to-purple-600 transform rotate-45 translate-x-3 -translate-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-blue-500 to-purple-600 transform rotate-45 -translate-x-3 translate-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Premium Badge for Featured Posts */}
      {post.featured && (
        <div className="absolute top-6 left-6 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12 animate-pulse">
            ⭐ NỔI BẬT
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;