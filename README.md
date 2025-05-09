# LeetLords-of-SIT

A dynamic LeetCode leaderboard for SIT students, tracking overall and weekly coding performance.

## Features

- Overall LeetCode leaderboard based on user ratings
- Weekly contest leaderboard with performance indicators
- User registration system to add participants
- Modern UI with responsive design

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: LeetCode API via leetcode-query package

## Project Structure

```
LeetLords-of-SIT/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── App.js          # Main React app
│   │   └── ...
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   │   └── api/            # API endpoints
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB (local or Atlas URI)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/LeetLords-of-SIT.git
   cd LeetLords-of-SIT
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

### Running the Application

#### Development Mode

1. Start both backend and frontend servers (from the server directory):
   ```
   npm run dev:both
   ```

   Or start them separately:

   Backend server:
   ```
   cd server
   npm run dev
   ```

   React frontend:
   ```
   cd client
   npm start
   ```

2. Access the application at `http://localhost:3000`

#### Production Mode

1. Build the React frontend (from the client directory):
   ```
   npm run build
   ```

2. Start the server (from the server directory):
   ```
   npm start
   ```

3. Access the application at `http://localhost:5000`

## API Endpoints

- `GET /api/leaderboard` - Get both normal and weekly leaderboard data
- `POST /api/register` - Register a new user
- `GET /api/user/info/:username` - Get LeetCode contest information for a specific user

## License

This project is licensed under the ISC License.

## Acknowledgments

- LeetCode for providing the API
- School of Information Technology (SIT) community
