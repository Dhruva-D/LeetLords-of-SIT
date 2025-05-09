# LeetLords-of-SIT Backend

This directory contains the Express.js backend API for the LeetLords-of-SIT application.

## Structure

```
server/
├── controllers/        # Request handlers and business logic
│   ├── leaderboard.js  # Leaderboard-related controller functions
│   └── user.js         # User-related controller functions
├── models/             # Database schema definitions
│   └── user.js         # User model
├── routes/             # API route definitions
│   ├── api/            # API endpoint routes
│   │   ├── leaderboard.js  # Leaderboard API routes
│   │   └── user.js         # User info API routes
│   └── user.js         # Registration API routes
├── connect.js          # Database connection handler
├── index.js            # Application entry point
└── package.json        # Dependencies and scripts
```

## API Endpoints

### Leaderboard

- `GET /api/leaderboard` - Get both normal and weekly leaderboard data

### User Registration

- `POST /api/register` - Register a new user

### User Information

- `GET /api/user/info/:username` - Get LeetCode contest information for a specific user

## Running the Backend

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Start the server:
   ```
   npm run dev
   ```

4. The server will be available at `http://localhost:5000` 