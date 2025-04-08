// 

require('dotenv').config();

const express = require('express');

const connectDB = require('./database/db');
const authRouter = require('./routes/auth-routes')
const homeRouter = require('./routes/home-routes')
const adminRouter = require('./routes/admin-routes')
const uploadImageRoutes = require('./routes/image-routes')


const app = express();
const PORT = process.env.PORT || 3300

// connect to db
connectDB();


// middleware
app.use(express.json());


// routes
app.use('/api/auth', authRouter);
app.use('/api/home', homeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/image', uploadImageRoutes); 


app.listen(PORT, ()=> {
	console.log(`Server is listening to port ${PORT}`);
})