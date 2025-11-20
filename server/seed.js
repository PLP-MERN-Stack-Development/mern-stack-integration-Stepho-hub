const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const steve = new User({
      name: 'Steve',
      email: 'steve@example.com',
      password: hashedPassword
    });
    const becky = new User({
      name: 'Becky',
      email: 'becky@example.com',
      password: hashedPassword
    });
    await steve.save();
    await becky.save();
    console.log('User created');

    // Create categories
    const techCategory = new Category({ name: 'Technology' });
    const lifestyleCategory = new Category({ name: 'Lifestyle' });
    await techCategory.save();
    await lifestyleCategory.save();
    console.log('Categories created');

    // Create posts
    const postsData = [
      {
        title: 'Getting Started with MERN Stack',
        content: 'The MERN stack is a popular full-stack JavaScript framework consisting of MongoDB, Express.js, React.js, and Node.js. It allows developers to build robust web applications using a single programming language throughout the entire stack.',
        excerpt: 'Learn the basics of building applications with MongoDB, Express, React, and Node.js',
        category: techCategory._id
      },
      {
        title: 'React Hooks: A Complete Guide',
        content: 'React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications.',
        excerpt: 'Master React Hooks for modern functional component development',
        category: techCategory._id
      },
      {
        title: 'Node.js Best Practices',
        content: 'Writing efficient and maintainable Node.js code requires following certain best practices. This includes proper error handling, asynchronous programming patterns, and security considerations.',
        excerpt: 'Essential best practices for Node.js development',
        category: techCategory._id
      },
      {
        title: 'MongoDB Aggregation Pipeline',
        content: 'The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms the documents into aggregated results.',
        excerpt: 'Powerful data processing with MongoDB aggregation',
        category: techCategory._id
      },
      {
        title: 'Building REST APIs with Express',
        content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Learn how to build scalable REST APIs.',
        excerpt: 'Create scalable REST APIs using Express.js',
        category: techCategory._id
      },
      {
        title: 'Healthy Living Tips',
        content: 'Maintaining a healthy lifestyle involves regular exercise, balanced nutrition, adequate sleep, and stress management. Small changes can make a big difference in your overall well-being.',
        excerpt: 'Discover practical tips for a healthier life',
        category: lifestyleCategory._id
      },
      {
        title: 'Mindfulness Meditation Guide',
        content: 'Mindfulness meditation involves paying attention to the present moment without judgment. It can help reduce stress, improve focus, and enhance emotional regulation.',
        excerpt: 'Learn the art of mindfulness for better mental health',
        category: lifestyleCategory._id
      },
      {
        title: 'Nutrition for Busy Professionals',
        content: 'Eating healthy doesn\'t have to be complicated. With proper planning and smart choices, you can maintain a nutritious diet even with a busy schedule.',
        excerpt: 'Maintain healthy eating habits in a fast-paced lifestyle',
        category: lifestyleCategory._id
      },
      {
        title: 'The Importance of Sleep',
        content: 'Quality sleep is essential for physical and mental health. Poor sleep can affect mood, cognitive function, immune system, and overall quality of life.',
        excerpt: 'Understanding the critical role of sleep in health',
        category: lifestyleCategory._id
      },
      {
        title: 'Stress Management Techniques',
        content: 'Chronic stress can have serious health consequences. Learning effective stress management techniques is crucial for maintaining both physical and mental well-being.',
        excerpt: 'Effective strategies to manage and reduce stress',
        category: lifestyleCategory._id
      }
    ];

    for (let i = 0; i < postsData.length; i++) {
      const postData = postsData[i];
      const author = i % 2 === 0 ? steve._id : becky._id; // Alternate authors
      const post = new Post({
        ...postData,
        author,
        isPublished: true,
        featuredImage: null // No images for seeded posts
      });
      await post.save();
    }
    console.log('10 posts created');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();