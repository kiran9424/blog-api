const express = require('express');
const router = express.Router();

const {runValidation} = require('../validators');
const {userSignupValidator,userSignInValidator} = require('../validators/auth')
const {UserSignup,UserSignIn,googleLogin} = require('../controllers/auth');

router.post('/signup',userSignupValidator,runValidation,UserSignup);
router.post('/signin',userSignInValidator,runValidation,UserSignIn);
router.post('/google-login',googleLogin)

module.exports = router;