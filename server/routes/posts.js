const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation middleware
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('excerpt')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Excerpt cannot exceed 200 characters'),
  body('featuredImage')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Get all posts with pagination and filtering
router.get('/', async (req, res) => {
  console.log('GET /api/posts - Fetching posts with query:', req.query);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    // Build query
    let query = { isPublished: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate('author', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    console.log(`Found ${posts.length} posts out of ${total} total`);
    console.log('Posts data:', posts.map(p => ({ title: p.title, author: p.author?.name })));

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    let post;

    // Try to find by ID first
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(req.params.id).populate('author', 'name').populate('category', 'name');
    }

    // If not found by ID, try to find by slug
    if (!post) {
      post = await Post.findOne({ slug: req.params.id }).populate('author', 'name').populate('category', 'name');
    }

    if (!post) return res.status(404).json({
      success: false,
      error: 'Post not found'
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create post
router.post('/', auth, validatePost, handleValidationErrors, async (req, res) => {
  const post = new Post({
    ...req.body,
    author: req.user.id,
  });
  try {
    const newPost = await post.save();
    res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update post
router.put('/:id', auth, validatePost, handleValidationErrors, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({
      success: false,
      error: 'Post not found'
    });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({
      success: false,
      error: 'Post not found'
    });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Upload image
router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Return the image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', 'name');
    if (!post) return res.status(404).json({
      success: false,
      error: 'Post not found'
    });

    res.json({
      success: true,
      data: post.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add comment to a post
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content, name } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required and must be a string'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({
      success: false,
      error: 'Post not found'
    });

    const newComment = {
      content: content.trim(),
      createdAt: new Date()
    };

    // If user is authenticated, add user, else add name
    if (req.user) {
      newComment.user = req.user.id;
    } else if (name && name.trim()) {
      newComment.name = name.trim();
    } else {
      return res.status(400).json({
        success: false,
        error: 'Name is required for anonymous comments'
      });
    }

    post.comments.push(newComment);
    await post.save();

    // Populate the user data for the response if user exists
    if (newComment.user) {
      await post.populate('comments.user', 'name');
    }

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      data: addedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;