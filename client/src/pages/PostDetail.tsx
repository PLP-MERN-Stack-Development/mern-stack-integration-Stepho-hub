import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  _id: string;
  title: string;
  content: string;
  featuredImage: string;
  createdAt: string;
  author: {
    _id: string;
    name: string;
  };
  category: {
    name: string;
  } | null;
}

interface Comment {
  _id: string;
  user?: {
    _id: string;
    name: string;
  };
  name?: string;
  content: string;
  createdAt: string;
}

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchComments = async (postId: string) => {
    try {
      const response = await postService.getComments(postId);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(slug!);
      setPost(data);
      // Also fetch comments for this post
      await fetchComments(data._id);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    if (!user && !commentName.trim()) {
      toast.error('Name is required for anonymous comments');
      return;
    }

    setSubmittingComment(true);
    try {
      const commentData: any = { content: newComment.trim() };
      if (!user) {
        commentData.name = commentName.trim();
      }
      await postService.addComment(post._id, commentData);
      await fetchComments(post._id);
      setNewComment('');
      setCommentName('');
      toast.success('Comment added successfully');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(post!._id);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const isAuthor = user?.id === post.author?._id;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to posts
        </Button>

        {post.featuredImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {post.category && (
              <Badge variant="secondary">{post.category.name}</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
            </span>
          </div>

          {isAuthor && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/edit/${post._id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        <div className="flex items-center gap-3 mb-8 pb-8 border-b">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {post.author?.name ? post.author.name[0].toUpperCase() : 'A'}
            </span>
          </div>
          <div>
            <p className="font-medium">By {post.author?.name || 'Anonymous'}</p>
          </div>
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            {!user && (
              <div className="mb-3">
                <Input
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Your name..."
                  className="max-w-xs"
                  maxLength={100}
                />
              </div>
            )}
            <div className="flex gap-3">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1"
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={submittingComment || !newComment.trim() || (!user && !commentName.trim())}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {submittingComment ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => {
                const displayName = comment.user?.name || comment.name || 'Anonymous';
                const displayInitial = displayName[0].toUpperCase();
                return (
                  <div key={comment._id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {displayInitial}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{displayName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;