const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
 const connectDB = require('./Connections/dbconnection');
 const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Constants
const CLIENT_URL = process.env.CLIENT_URL;

// Middleware
 app.use(cors({
  origin: 'https://youtube-fron.vercel.app',
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
app.use('/', (req, res) => {
  res.send('Welcome to the YouTube Clone API'); 
});

const port = process.env.PORT;
// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}`);
});
 