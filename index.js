const express= require('express');
const connectDB = require('./Connections/dbconnection')
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
 

const cookieParser = require('cookie-parser');
app.use(cookieParser());
 app.use(express.json())
connectDB();


const AuthRoutes = require('./Routes/user');
const VideoRoutes = require('./Routes/video');
const CommentRoutes = require('./Routes/comment');

app.use('/api',VideoRoutes)
app.use('/auth',AuthRoutes)
app.use('/commentapi',CommentRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})