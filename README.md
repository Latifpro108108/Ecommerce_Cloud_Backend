# 🛒 GoMart - Ghana's Premier E-commerce Platform

[![GitHub Repository](https://img.shields.io/badge/GitHub-Ecommerce_Cloud_Backend-blue?style=flat-square&logo=github)](https://github.com/Latifpro108108/Ecommerce_Cloud_Backend.git)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)

## 🌟 Project Overview

GoMart is an innovative, comprehensive e-commerce platform designed specifically for the Ghanaian market. Built with modern technologies and localized features, it provides a seamless shopping experience with integrated Mobile Money payments, local delivery services, and Ghana-specific business logic.

## 📁 Repository Information

**Repository:** [Ecommerce_Cloud_Backend](https://github.com/Latifpro108108/Ecommerce_Cloud_Backend.git)  
**Author:** Latifpro108108  
**Technology:** Full-stack JavaScript (Node.js + Next.js)  
**Database:** MongoDB Atlas with Prisma ORM

## 🚀 Key Features

### 🇬🇭 Ghana-Focused Features
- **Mobile Money Integration**: MTN Mobile Money, Vodafone Cash, AirtelTigo Money
- **Local Delivery**: Integration with Ghana Post, DHL Ghana, Bolt, Jumia Logistics
- **Regional Support**: Ghana regions (Greater Accra, Ashanti, etc.) and cities
- **Currency**: Ghana Cedi (GHS) as primary currency
- **Local Business Logic**: Tailored for Ghanaian e-commerce needs

### 🛍️ Core E-commerce Features
- Multi-vendor marketplace
- Product catalog with categories
- Shopping cart and checkout
- Order management and tracking
- Customer reviews and ratings
- Vendor management system
- Payment processing
- Shipping and delivery tracking

### 🤖 Innovative Features (Future Phases)
- AI-powered product recommendations
- Voice-enabled search
- AR/3D product preview
- Gamification system with rewards
- Advanced analytics dashboard

## 🏗️ Project Structure

```
gomart/
├── backend/                    # Express.js API Server
│   ├── config/                # Database and app configuration
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models (Prisma)
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── prisma/                # Prisma schema and migrations
│   └── server.js              # Main server file
├── src/                       # Next.js Frontend
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Next.js pages
│   ├── styles/                # CSS and styling
│   └── utils/                 # Frontend utilities
└── README.md                  # Project documentation
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Built-in validation middleware

### Frontend
- **Framework**: Next.js (React)
- **Styling**: TailwindCSS
- **State Management**: React Context/Redux (future)
- **UI Components**: Custom components with Tailwind

### Database Schema
- **Customer Management**: User profiles, authentication
- **Product Catalog**: Products, categories, vendors
- **Order Processing**: Orders, order items, payments
- **Shipping**: Delivery tracking, courier management
- **Reviews**: Product ratings and feedback
- **Cart**: Shopping cart functionality

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Clone Repository
```bash
git clone https://github.com/Latifpro108108/Ecommerce_Cloud_Backend.git
cd Ecommerce_Cloud_Backend
```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd gomart/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database Configuration
   DATABASE_URL="mongodb+srv://gomartDatabase:GoMart2026@sneldi.wqqosr4.mongodb.net/gomart?retryWrites=true&w=majority&appName=sneldi"
   
   # JWT Secret (Change in production)
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Ghana-specific configurations
   DEFAULT_CURRENCY=GHS
   DEFAULT_REGION="Greater Accra"
   DEFAULT_COUNTRY=Ghana
   ```

4. **Database Setup**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to MongoDB
   npm run db:push
   
   # (Optional) Open Prisma Studio to view data
   npm run db:studio
   ```

5. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to main project directory**:
   ```bash
   cd gomart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 MongoDB Atlas Setup Guide

### 1. Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Create a new cluster

### 2. Database Configuration
1. **Cluster Name**: `sneldi` (as referenced in the connection string)
2. **Database Name**: `gomart`
3. **Username**: `gomartDatabase`
4. **Password**: `GoMart2026`

### 3. Network Access
1. Go to "Network Access" in Atlas dashboard
2. Add IP Address: `0.0.0.0/0` (for development - restrict in production)
3. Save changes

### 4. Database Access
1. Go to "Database Access"
2. Create database user with username: `gomartDatabase`
3. Set password: `GoMart2026`
4. Assign "Read and write to any database" role

### 5. Connection String
The connection string format is:
```
mongodb+srv://gomartDatabase:GoMart2026@sneldi.wqqosr4.mongodb.net/gomart?retryWrites=true&w=majority&appName=sneldi
```

## 🔌 API Endpoints

### Authentication
- `POST /api/customers/register` - Customer registration
- `POST /api/customers/login` - Customer login
- `GET /api/customers/profile` - Get customer profile
- `PUT /api/customers/profile` - Update customer profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with products

### Orders
- `GET /api/orders` - Get customer orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order

### Cart
- `GET /api/cart` - Get customer cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart

## 🧪 Testing

### API Testing
Test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/health

# Get all products
curl http://localhost:5000/api/products

# Register a customer
curl -X POST http://localhost:5000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phoneNumber":"0241234567","password":"password123","region":"Greater Accra","city":"Accra"}'
```

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables in production
2. Change `NODE_ENV` to `production`
3. Use strong JWT secret
4. Configure proper CORS origins
5. Set up MongoDB Atlas with IP restrictions

### Frontend Deployment
1. Build the Next.js application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables for API endpoints

## 📖 Database Schema

### Core Entities
- **Customer**: User profiles and authentication
- **Vendor**: Seller accounts and verification
- **Product**: Product catalog with images and details
- **Category**: Product categorization
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in orders
- **Payment**: Payment processing with Mobile Money support
- **Shipping**: Delivery tracking with local couriers
- **Review**: Product reviews and ratings
- **Cart/CartItem**: Shopping cart functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Verify MongoDB Atlas credentials
   - Check network access settings
   - Ensure correct database URL format

2. **Prisma Client Issues**:
   - Run `npm run db:generate` to regenerate client
   - Check schema syntax
   - Verify environment variables

3. **Environment Variables Not Loading**:
   - Check .env file location and format
   - Ensure no trailing spaces or special characters
   - Restart the server after changes

### Support

For questions and support, please create an issue in the repository or contact the development team.

---

**GoMart** - Empowering Ghana's Digital Economy 🇬🇭