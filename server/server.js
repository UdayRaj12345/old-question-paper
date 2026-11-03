
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const requiredEnvVars = [
  ['DB_HOST', process.env.DB_HOST],
  ['DB_NAME', process.env.DB_NAME],
  ['DB_USER', process.env.DB_USER],
  ['DB_PASSWORD', process.env.DB_PASSWORD],
  ['JWT_SECRET', process.env.JWT_SECRET],
  [
    'CLOUDINARY_CLOUD_NAME',
    process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME
  ],
  [
    'CLOUDINARY_API_KEY',
    process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY
  ],
  [
    'CLOUDINARY_API_SECRET',
    process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET
  ],
  [
    'FRONTEND_URL or CLIENT_URL',
    process.env.FRONTEND_URL || process.env.CLIENT_URL
  ],
];

const missingEnvVars = requiredEnvVars
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnvVars.length) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });

    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
