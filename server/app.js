require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

// Security
app.use(helmet());

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
  ...(process.env.LOCAL_FRONTEND_URL
    ? process.env.LOCAL_FRONTEND_URL.split(',')
    : []),
  'https://paperhub-sandy.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].map(origin => origin.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(compression());

// Request logging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const paperRoutes = require('./routes/paper.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const commentRoutes = require('./routes/comment.routes');
const ratingRoutes = require('./routes/rating.routes');
const adminRoutes = require('./routes/admin.routes');
const reportRoutes = require('./routes/report.routes');
const notificationRoutes = require('./routes/notification.routes');
const academicRoutes = require('./routes/academic.routes');
const noteRoutes = require('./routes/note.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/academic', academicRoutes);

// Temporary test endpoint
app.get('/api/papers-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Papers test route is working',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

// Base route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the College Previous Year Question Paper Portal API',
  });
});

// Error handling — must remain at the end
const { errorHandler, notFound } = require('./middleware/error.middleware');

app.use(notFound);
app.use(errorHandler);

module.exports = app;
