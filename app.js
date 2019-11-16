const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

//importing Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const blogRoutes = require('./routes/blog');

const app= express();

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true})
.then(()=>console.log('db connected successfully'));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/',authRoutes);
app.use('/api/v1/',userRoutes);
app.use('/api/v1/',categoryRoutes);
app.use('/api/v1/',tagRoutes);
app.use('/api/v1/',blogRoutes);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
    
})