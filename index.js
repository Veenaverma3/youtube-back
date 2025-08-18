const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
 const connectDB = require('./Connections/dbconnection');
 const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Constants
 const CLIENT_URL = 'https://youtube-fron.vercel.app';
// const CLIENT_URL = 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

// Connect to DB
connectDB();

// Routes
const AuthRoutes = require('./Routes/user');
const VideoRoutes = require('./Routes/video');
const CommentRoutes = require('./Routes/comment');

app.use('/api', VideoRoutes);
app.use('/auth', AuthRoutes);
app.use('/commentapi', CommentRoutes);

app.use('/', (req, res) => {
  res.send('Welcome to the YouTube Clone API'); 
});

const port = process.env.PORT;
// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}`);
});
