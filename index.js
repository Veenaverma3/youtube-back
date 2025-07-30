 // index.js or server.js
const express = require('express');
const connectDB = require('./Connections/dbconnection');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Add this

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
const AuthRoutes = require('./Routes/user');
const VideoRoutes = require('./Routes/video');
const CommentRoutes = require('./Routes/comment');

app.use('/api', VideoRoutes);
app.use('/auth', AuthRoutes);
app.use('/commentapi', CommentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
