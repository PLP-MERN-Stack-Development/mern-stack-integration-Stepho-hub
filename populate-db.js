const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Post = require('./server/models/Post');
const User = require('./server/models/User');
const Category = require('./server/models/Category');

async function populateDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern_blog');
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      name: 'Blog Admin',
      email: 'admin@blogapp.com',
      password: hashedPassword,
      role: 'admin'
    });
    await user.save();
    console.log('✅ Admin user created');

    // Create categories
    const techCategory = new Category({
      name: 'Technology',
      description: 'Latest in tech and programming'
    });
    await techCategory.save();

    const webCategory = new Category({
      name: 'Web Development',
      description: 'Frontend and backend development'
    });
    await webCategory.save();
    console.log('✅ Categories created');

    // Create sample posts
    const posts = [
      {
        title: 'Welcome to Your MERN Blog!',
        content: `<h2>🎉 Congratulations on deploying your MERN stack blog!</h2>

<p>This is your first blog post showcasing the power of the MERN stack. Your blog now features:</p>

<ul>
<li><strong>User Authentication</strong> - Secure login and registration</li>
<li><strong>Rich Blog Posts</strong> - Create, edit, and delete posts</li>
<li><strong>Categories & Tags</strong> - Organize your content</li>
<li><strong>Comments System</strong> - Engage with your readers</li>
<li><strong>Image Uploads</strong> - Add featured images to posts</li>
<li><strong>Search & Filter</strong> - Find content easily</li>
<li><strong>Responsive Design</strong> - Works on all devices</li>
</ul>

<h3>🚀 What's Next?</h3>
<p>Start creating amazing content and sharing your thoughts with the world!</p>`,
        excerpt: 'Your first blog post celebrating the successful deployment of your MERN stack application.',
        author: user._id,
        category: techCategory._id,
        isPublished: true,
        tags: ['welcome', 'mern', 'blog']
      },
      {
        title: 'Building Modern Web Applications',
        content: `<h2>🌐 The Future of Web Development</h2>

<p>Modern web applications are becoming increasingly sophisticated, combining powerful backend APIs with beautiful, interactive frontend experiences.</p>

<h3>Key Technologies:</h3>
<ul>
<li><strong>React</strong> - Component-based UI development</li>
<li><strong>Node.js</strong> - Server-side JavaScript runtime</li>
<li><strong>MongoDB</strong> - Flexible NoSQL database</li>
<li><strong>Express.js</strong> - Minimalist web framework</li>
</ul>

<p>This stack provides everything you need to build scalable, maintainable web applications.</p>`,
        excerpt: 'Exploring the technologies that power modern web applications and why the MERN stack is a great choice.',
        author: user._id,
        category: webCategory._id,
        isPublished: true,
        tags: ['web-development', 'mern-stack', 'javascript']
      },
      {
        title: 'Database Design Best Practices',
        content: `<h2>🗄️ Designing Scalable Databases</h2>

<p>When building applications with MongoDB, proper data modeling is crucial for performance and maintainability.</p>

<h3>Best Practices:</h3>
<ul>
<li><strong>Embed vs Reference</strong> - Choose the right relationship type</li>
<li><strong>Indexing</strong> - Optimize query performance</li>
<li><strong>Data Validation</strong> - Ensure data integrity</li>
<li><strong>Schema Design</strong> - Plan for future growth</li>
</ul>

<p>Understanding these concepts will help you build better applications.</p>`,
        excerpt: 'Essential database design principles for building scalable MongoDB applications.',
        author: user._id,
        category: techCategory._id,
        isPublished: true,
        tags: ['database', 'mongodb', 'best-practices']
      }
    ];

    for (const postData of posts) {
      const post = new Post(postData);
      await post.save();
      console.log(`✅ Post created: "${post.title}"`);
    }

    console.log('\n🎉 Database populated successfully!');
    console.log('📊 Visit http://localhost:8080 to see your blog posts');
    console.log('🔐 Login with: admin@blogapp.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    process.exit(1);
  }
}

populateDatabase();