# College Previous Year Question Paper Portal - Backend

A robust RESTful API built with Node.js, Express, and MongoDB for managing and sharing college previous year question papers.

## Features

- **Authentication & Authorization**: JWT-based authentication with Role-Based Access Control (Admin, Faculty, Student, Guest).
- **Paper Management**: Upload (PDFs to Cloudinary), search, filter, and manage papers.
- **Advanced Search**: Text search and advanced filtering by university, college, branch, subject, year, etc.
- **Interactions**: Bookmarking, Rating, Commenting, and tracking views/downloads.
- **Moderation**: Admin approval workflow for uploaded papers, and a reporting system for spam/broken links.
- **Security**: Helmet, Rate Limiting, CORS, Express-Validator, Mongo Sanitize.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **File Uploads**: Multer & Cloudinary
- **Security**: bcryptjs, jsonwebtoken

## Installation

1. **Clone the repository** (if not already done).
2. **Navigate to the server directory**:
   ```bash
   cd server
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Environment Variables**:
   Copy the `.env.example` file to `.env` and configure your credentials.
   ```bash
   cp .env.example .env
   ```
   **Required Variables**:
   - `MONGO_URI`: MongoDB connection string.
   - `JWT_SECRET`: Secret key for signing JWTs.
   - `CLOUDINARY_*`: Cloudinary API keys for PDF uploads.

## Running the Application

**Development Mode**:
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

## Seeding Data

To populate the database with dummy data (Universities, Colleges, Departments, Courses, Subjects, Users, and Papers):

```bash
node seeder.js
```
*Note: This will clear existing data before seeding.*

## API Documentation

- **Swagger**: The API schema is available in `swagger.json`.
- **Postman**: Import `postman_collection.json` into Postman to easily test all endpoints.

## Folder Structure

- `config/`: Configurations for DB and Cloudinary.
- `controllers/`: Request handlers for routes.
- `middleware/`: Custom middleware (auth, error, upload, validation).
- `models/`: Mongoose schemas.
- `routes/`: Express route definitions.
- `utils/`: Utility functions like advanced results filtering.
- `validators/`: Express-validator schemas.

## Deployment Steps

1. Provision a MongoDB database (e.g., MongoDB Atlas).
2. Set up a Cloudinary account.
3. Deploy the application to your preferred platform (Render, Heroku, AWS).
4. Set all the environment variables from `.env` in the hosting environment.
5. Make sure to run `npm install` and start using `node server.js` or PM2.
# old-question-paper
