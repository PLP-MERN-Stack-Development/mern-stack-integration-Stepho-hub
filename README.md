# MERN Blog Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application with modern UI, dark/light theme support, and comprehensive CRUD operations.

## 🚀 Features

- **Blog Management**: Create, read, update, and delete blog posts
- **User Authentication**: JWT-based registration and login
- **Categories**: Organize posts by categories
- **Comments System**: Interactive comments on blog posts
- **Image Uploads**: Featured images for posts
- **Dark/Light Theme**: Toggle between themes with smooth animations
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Railway (Full-Stack), Render (Backend), Vercel (Frontend)

## 🌐 Live Deployed Application

### **Current Deployment URLs:**
- **🚂 Railway (Full Application)**: [https://mern-stack-integration-stepho-hub-production.up.railway.app](https://mern-stack-integration-stepho-hub-production.up.railway.app)
- **⚛️ Vercel (Frontend Only)**: [https://mern-stack-integration-stepho-hub.vercel.app](https://mern-stack-integration-stepho-hub.vercel.app)
- **🔧 Render (Backend API)**: [https://mern-stack-integration-stepho-hub.onrender.com](https://mern-stack-integration-stepho-hub.onrender.com)

### **Access Your Blog:**
1. **Main Application**: Use the Railway URL for the complete experience
2. **Frontend Only**: Use Vercel URL (connects to Render backend)
3. **API Only**: Use Render URL for API testing

### **Default Login Credentials:**
- **Email**: admin@blogapp.com
- **Password**: password123

## 📁 Project Structure

```
mern-blog-engine-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API services
│   ├── public/             # Static assets
│   └── dist/               # Built files (generated)
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── uploads/            # Uploaded files
├── railway.json           # Railway deployment config
├── render.yaml            # Render deployment config
├── vercel.json            # Vercel deployment config
└── package.json           # Root package.json for deployments
```

## 🚀 Local Development

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mern-blog-engine-main
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   cd ..
   ```

4. **Environment Setup**

   - Copy `server/.env.example` to `server/.env`
   - Update MongoDB connection string and JWT secret
   - Copy `client/.env.example` to `client/.env` (if needed)

5. **Start Development Servers**

   ```bash
   # Terminal 1: Start server
   cd server
   npm run dev

   # Terminal 2: Start client
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚀 Production Deployment

This application is deployed across three platforms for optimal performance:

### 🚂 Railway (Full-Stack Application)
**URL**: [https://mern-stack-integration-stepho-hub-production.up.railway.app](https://mern-stack-integration-stepho-hub-production.up.railway.app)

**Features**:
- Complete MERN application (Frontend + Backend + Database)
- Automatic deployments from GitHub
- Built-in MongoDB integration
- Single URL for entire application

**Environment Variables**:
```
DATABASE_URL=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-here
NODE_ENV=production
```

### ⚛️ Vercel (Frontend Only)
**URL**: [https://mern-stack-integration-stepho-hub.vercel.app](https://mern-stack-integration-stepho-hub.vercel.app)

**Features**:
- Ultra-fast React frontend deployment
- Global CDN for instant loading
- Automatic HTTPS and custom domains
- Connects to Render backend API

**Environment Variables**:
```
VITE_API_URL=https://mern-stack-integration-stepho-hub.onrender.com/api
```

### 🔧 Render (Backend API Only)
**URL**: [https://mern-stack-integration-stepho-hub.onrender.com](https://mern-stack-integration-stepho-hub.onrender.com)

**Features**:
- Dedicated backend API service
- RESTful endpoints for all blog operations
- File upload handling
- JWT authentication

**Environment Variables**:
```
DATABASE_URL=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-here
NODE_ENV=production
```

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │     Render      │    │    Railway      │
│   Frontend      │◄──►│   Backend API   │    │ Full Application│
│                 │    │                 │    │                 │
│ React + Vite    │    │ Express + Node  │    │ React + Express │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Atlas         │
                    └─────────────────┘
```

### **Recommended Usage:**
- **Railway**: Complete application experience
- **Vercel + Render**: Best performance (separate concerns)
- **Development**: Use Railway for full-stack testing

### Environment Variables Summary

**Railway (Full Application):**
```
DATABASE_URL=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-here
NODE_ENV=production
```

**Render (Backend Only):**
```
DATABASE_URL=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-here
NODE_ENV=production
```

**Vercel (Frontend Only):**
```
VITE_API_URL=https://mern-stack-integration-stepho-hub.onrender.com/api
```

### Database Setup

**MongoDB Atlas (Recommended for all platforms):**
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Whitelist IP: `0.0.0.0/0` for cloud deployments

## 📡 API Endpoints

### Posts

- `GET /api/posts` - Get all posts (with pagination, search, filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/comments` - Add comment to post (auth required)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (auth required)

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## 🔧 Configuration

### Environment Variables

**Server (.env)**

```
MONGO_URI=mongodb://localhost:27017/mern_blog
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

**Client (.env)**

```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 UI Components

Built with modern React patterns and shadcn/ui:

- Responsive navigation with mobile menu
- Theme toggle (dark/light/system)
- Form validation with React Hook Form
- Toast notifications
- Loading states and error handling

## 📱 Features Overview

- **Blog Posts**: Rich text content with featured images
- **User Management**: Secure authentication system
- **Content Management**: Full CRUD operations for posts
- **Image Handling**: Upload and display featured images
- **Responsive Design**: Works on all device sizes
- **Modern UX**: Smooth animations and transitions

## 📸 Screenshots

### Homepage with Animated Hero

![Homepage](screenshots/01-homepage.png)
_Animated hero section with floating elements, gradient text, and blog posts grid_

### Authentication Page

![Authentication](screenshots/02-authentication.png)
_Modern glassmorphism design with animated backgrounds and smooth transitions_

### Create Post Form

![Create Post](screenshots/03-create-post.png)
_Comprehensive post creation form with image upload, category selection, and rich text editing_

### Individual Post View

![Post Detail](screenshots/04-post-detail.png)
_Full post display with featured image, author info, and interactive comments section_

### Search & Filter Functionality

![Search & Filter](screenshots/05-search-filter.png)
_Advanced search and filtering system with real-time results and multiple sort options_

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉**

---
*Final Update: All deployment configurations and documentation completed - Week 4 MERN Assignment*
