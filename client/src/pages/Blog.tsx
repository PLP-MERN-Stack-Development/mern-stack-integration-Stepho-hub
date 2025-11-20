import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '@/services/api';
import { usePosts } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { format } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  createdAt: string;
  author: {
    name: string;
  };
  category: {
    name: string;
  } | null;
}

interface Category {
  _id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const Blog = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use custom hook for posts
  const { getPosts } = usePosts();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory, searchQuery, refreshTrigger]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts.execute(currentPage, 9, selectedCategory, searchQuery);
      setPagination(response?.pagination || null);

      // Clear optimistic post after real data loads
      localStorage.removeItem('newPost');
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Get posts including optimistic update
  const getDisplayPosts = () => {
    const realPosts = getPosts.data || [];
    const optimisticPost = localStorage.getItem('newPost');

    if (optimisticPost && currentPage === 1 && !selectedCategory && !searchQuery) {
      try {
        const parsedPost = JSON.parse(optimisticPost);
        // Add optimistic post at the beginning if not already in real posts
        const exists = realPosts.some((post: any) => post.title === parsedPost.title);
        if (!exists) {
          return [parsedPost, ...realPosts];
        }
      } catch (error) {
        console.error('Error parsing optimistic post:', error);
      }
    }

    return realPosts;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchPosts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Blog Posts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest articles and insights
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                Search
              </Button>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button type="button" variant="ghost" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </form>
            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              disabled={getPosts.loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${getPosts.loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {getPosts.loading ? (
          <div className="text-center text-muted-foreground">Loading posts...</div>
        ) : (() => {
          const displayPosts = getDisplayPosts();
          return displayPosts.length === 0 ? (
            <div className="text-center text-muted-foreground">
              {searchQuery || selectedCategory !== 'all'
                ? 'No posts found matching your criteria.'
                : 'No posts yet. Be the first to create one!'
              }
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayPosts.map((post: Post) => (
                <Link key={post._id} to={`/post/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
                    {post.featuredImage && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.category && (
                          <Badge variant="secondary">{post.category.name}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-4">
                        By {post.author?.name || 'Anonymous'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
          );
        })()}
      </main>
    </div>
  );
};

export default Blog;