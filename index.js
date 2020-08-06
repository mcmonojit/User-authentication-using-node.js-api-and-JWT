const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose= require('mongoose');

//Importing routes
const authRoute = require('./routes/auth');

const postRoute = require('./routes/posts');


dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT, 
{ useUnifiedTopology: true }, () => console.log('connected to DB!'));

//Middlewares
app.use(express.json());


//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);




app.listen(3000, () => console.log('Server up and running'));