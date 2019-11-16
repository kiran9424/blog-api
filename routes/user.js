const express= require('express');
const router = express.Router();
const {loggedInUserProfile} = require('../controllers/user')
const {requireSignin,AuthMiddleware} = require('../controllers/auth');

router.get('/profile',requireSignin,AuthMiddleware,loggedInUserProfile)

module.exports = router