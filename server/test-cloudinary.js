require('dotenv').config();

const cloudinary = require('./config/cloudinary');

async function test() {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
  } catch (error) {
    console.error('Cloudinary test failed:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name
    });
  }
}

test();
