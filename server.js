require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running and connected to the API!' });
});

// Function to start the Express server
const startExpressServer = (dbType = 'MongoDB') => {
  const PORT = process.env.PORT || 5009;
  
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Connected to ${dbType}`);
  });
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please use a different port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
  
  return server;
};

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/it-service-portal';
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    startExpressServer('MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Falling back to in-memory MongoDB...');
    await connectToInMemoryMongoDB();
  }
};

// Function to connect to in-memory MongoDB
const connectToInMemoryMongoDB = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const memoryURI = mongoServer.getUri();
    
    await mongoose.connect(memoryURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to in-memory MongoDB');
    startExpressServer('in-memory MongoDB');
  } catch (err) {
    console.error('Error starting in-memory MongoDB:', err);
    process.exit(1);
  }
};

// Start the appropriate database connection
if (process.env.NODE_ENV === 'test') {
  // Use in-memory database for testing
  connectToInMemoryMongoDB().catch(console.error);
} else {
  // Try to connect to MongoDB, fallback to in-memory if it fails
  connectToMongoDB().catch(console.error);
}

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
