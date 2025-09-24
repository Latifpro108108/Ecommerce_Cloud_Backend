// GoMart Database Configuration
// MongoDB connection setup with Prisma

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with optimized configuration
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Database connection function
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Test the connection
    await prisma.$connect();
    
    console.log('✅ MongoDB connected successfully via Prisma!');
    console.log(`📊 Database URL: ${process.env.DATABASE_URL ? '***configured***' : '❌ NOT SET'}`);
    
    // Generate Prisma client if not already generated
    await generatePrismaClient();
    
    return prisma;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Generate Prisma Client
const generatePrismaClient = async () => {
  try {
    console.log('🔄 Ensuring Prisma client is generated...');
    // In production, client should already be generated
    // This is mainly for development
    if (process.env.NODE_ENV === 'development') {
      const { exec } = require('child_process');
      await new Promise((resolve, reject) => {
        exec('npx prisma generate', (error, stdout, stderr) => {
          if (error) {
            console.warn('⚠️ Prisma generate warning:', error.message);
            // Don't reject, client might already be generated
            resolve();
          } else {
            console.log('✅ Prisma client generated successfully');
            resolve();
          }
        });
      });
    }
  } catch (error) {
    console.warn('⚠️ Prisma client generation issue:', error.message);
    // Don't throw, let the app continue
  }
};

// Disconnect from database
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
};

// Database health check
const checkDBHealth = async () => {
  try {
    const result = await prisma.$runCommandRaw({ ping: 1 });
    return { status: 'healthy', timestamp: new Date(), ping: result };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date() };
  }
};

// Export database utilities
module.exports = {
  prisma,
  connectDB,
  disconnectDB,
  checkDBHealth
};
