// pages/bai-viet/index.jsx
"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getPosts } from '../api/apiPost';
import { getTopics } from '../api/apiTopic.js';
import PostCard from '../_components/PostCard';

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicsError, setTopicsError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Load topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setTopicsLoading(true);
        setTopicsError(null);
        const result = await getTopics();
        
        if (result.success) {
          setTopics(result.data);
        } else {
          setTopicsError(result.error || 'Không thể tải danh sách chủ đề');
        }
      } catch (err) {
        console.error('Lỗi khi tải chủ đề:', err);
        setTopicsError('Không thể tải danh sách chủ đề');
      } finally {
        setTopicsLoading(false);
      }
    };

    loadTopics();
  }, []);

  // Load posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error('Lỗi khi tải bài viết:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filter posts based on search and topic
  useEffect(() => {
    let result = posts;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(post =>
        post.title?.toLowerCase().includes(keyword) ||
        (post.description && post.description.toLowerCase().includes(keyword))
      );
    }

    if (selectedTopic) {
      result = result.filter(post => post.topic_id === parseInt(selectedTopic));
    }

    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchKeyword, selectedTopic, posts]);

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedTopic('');
  };

  const retryLoadPosts = () => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  };

  const retryLoadTopics = () => {
    const loadTopics = async () => {
      try {
        setTopicsLoading(true);
        setTopicsError(null);
        const result = await getTopics();
        
        if (result.success) {
          setTopics(result.data);
        } else {
          setTopicsError(result.error || 'Không thể tải danh sách chủ đề');
        }
      } catch (err) {
        setTopicsError('Không thể tải danh sách chủ đề');
      } finally {
        setTopicsLoading(false);
      }
    };

    loadTopics();
  };

  // Get topic name by ID
  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.id === parseInt(topicId));
    return topic?.name || 'Chủ đề không xác định';
  };

  // Combined loading state
  if (loading && topicsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state for posts
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Đã xảy ra lỗi</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={retryLoadPosts}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tất cả bài viết | Blog Chuyên nghiệp</title>
        <meta name="description" content="Khám phá tất cả bài viết mới nhất từ chúng tôi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tất cả bài viết
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Khám phá những bài viết mới nhất và thú vị từ đội ngũ chuyên gia của chúng tôi
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm bài viết..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Topic Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select
                  value={selectedTopic}
                  onChange={handleTopicChange}
                  disabled={topicsLoading || topicsError}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Tất cả chủ đề</option>
                  {topicsLoading && (
                    <option disabled>Đang tải chủ đề...</option>
                  )}
                  {topicsError && (
                    <option disabled>Lỗi tải chủ đề</option>
                  )}
                  {!topicsLoading && !topicsError && topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                
                {/* Retry button for topics error */}
                {topicsError && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <button
                      onClick={retryLoadTopics}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Thử lại"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(searchKeyword || selectedTopic) && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                  {searchKeyword && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Tìm kiếm: &quot;{searchKeyword}&quot;
                    </span>
                  )}
                  {selectedTopic && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Chủ đề: {getTopicName(selectedTopic)}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center self-start sm:self-auto"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Hiển thị <span className="font-semibold">{currentPosts.length}</span> trong tổng số{' '}
              <span className="font-semibold">{filteredPosts.length}</span> bài viết
              {totalPages > 1 && ` - Trang ${currentPage} / ${totalPages}`}
            </p>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          {currentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mb-12 flex-wrap gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Trước
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, and pages around current page
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis for gaps
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-300 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Sau
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-600 mb-6">
                  {searchKeyword || selectedTopic 
                    ? 'Hãy thử tìm kiếm với từ khóa khác hoặc chọn chủ đề khác'
                    : 'Hiện chưa có bài viết nào được đăng tải'
                  }
                </p>
                {(searchKeyword || selectedTopic) && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
            <h3 className="text-2xl font-bold mb-2">Đừng bỏ lỡ bài viết mới</h3>
            <p className="mb-6 opacity-90">Đăng ký nhận thông báo khi có bài viết mới</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none sm:rounded-r-none sm:rounded-l-lg"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors sm:rounded-l-none sm:rounded-r-lg">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}