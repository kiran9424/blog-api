const express = require('express');
const router = express.Router();

const {runValidation} = require('../validators');
const {userSignupValidator,userSignInValidator} = require('../validators/auth')
const {UserSignup,UserSignIn,requireSignin} = require('../controllers/auth');

router.post('/signup',userSignupValidator,runValidation,UserSignup);
router.post('/signin',userSignInValidator,runValidation,UserSignIn);
router.get('/secret', requireSignin,(req,res)=>{
    res.json({message:'accessed secret page'})
})

module.exports = router;