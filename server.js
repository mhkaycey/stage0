import express from "express";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
    USER_EMAIL,
    USER_NAME,
    USER_STACK,
    PORT,
    SERVER_URL
} from "./config.js";

const app = express();

// Middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later",
    timestamp: getCurrentTimestamp()
  } 
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}



));
app.use(express.json());

// Configuration
const CONFIG = {
  catFactsApi: 'https://catfact.ninja/fact',
  timeout: 10000, 
  fallbackFacts:  [
    'Cats can jump up to 6 times their length.',
    'Cats have excellent night vision and can see at light levels six times lower than what a human needs.',
    'Cats have 32 muscles in each ear.',
    'A group of cats is called a clowder.',
    'Cats sleep for 70% of their lives.'
  ]
};

// Your personal information (replace with your actual details)
const USER_INFO = {
  email: USER_EMAIL || "kelechimark041@gmail.com",
  name: USER_NAME || "Egede Kelechukwu Mark",
  stack: USER_STACK || "Node.js/Express"
};

// Utility function to get current UTC timestamp in ISO 8601 format
function getCurrentTimestamp() {
  return new Date().toISOString();
}

function getRandomFallbackFact() {
  const randomIndex = Math.floor(Math.random() * CONFIG.fallbackFacts.length);
  return CONFIG.fallbackFacts[randomIndex];
}

// Function to fetch cat fact from external API
async function fetchCatFact() {
  try {
    const response = await axios.get(CONFIG.catFactsApi, {
      timeout: CONFIG.timeout
    });
    
    if (response.data && response.data.fact) {
      return response.data.fact;
    } else {
      throw new Error('Invalid response format from Cat Facts API');
    }
  } catch (error) {
    console.error('Error fetching cat fact:', error.message);
    
    // Return fallback fact if API fails
    return getRandomFallbackFact();
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Stage Zero Backend API is running'",
    timestamp: getCurrentTimestamp(),
    endpoints:{
      profile: `${SERVER_URL}${PORT}/me`,
      health: `${SERVER_URL}${PORT}/health`
    }

  });
});

// GET /me endpoint
app.get('/me', async (req, res) => {
    const startTime = Date.now();
  try {
    // Log the request
    console.log(`[${getCurrentTimestamp()}] GET /me request received from ${req.ip}`);
    
    // Fetch cat fact
    const catFact = await fetchCatFact();
    
    // Construct response
    const response = {
      status: "success",
      user: {
        email: USER_INFO.email,
        name: USER_INFO.name,
        stack: USER_INFO.stack
      },
      timestamp: getCurrentTimestamp(),
      fact:  catFact
    };
    
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);
    
    // Send response
    res.status(200).json(response);
    
    // Log successful response
    console.log(`[${getCurrentTimestamp()}] GET /me response sent successfully`);
    
  } catch (error) {
    console.error('Unexpected error in /me endpoint:', error);
    
    // Error response
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      timestamp: getCurrentTimestamp()
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Service is healthy",
    timestamp: getCurrentTimestamp(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});


// Handle 404 routes
app.use(/(.*)/, (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    timestamp: getCurrentTimestamp()
  });
});


// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    timestamp: getCurrentTimestamp()
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`Profile endpoint available at: ${SERVER_URL}${PORT}/me`);
//   console.log(`Health check at: ${SERVER_URL}${PORT}/health`);
// });

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Stage Zero Backend Server Started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📅 Started at: ${getCurrentTimestamp()}
🔗 Endpoints:
   - Profile: ${SERVER_URL}${PORT}/me
   - Health: ${SERVER_URL}${PORT}/health
   - Root: ${SERVER_URL}${PORT}/
  `);
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;

