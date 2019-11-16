const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const jwtVerify = require('express-jwt');
const {OAuth2Client} = require('google-auth-library')
exports.UserSignup = (req, res, next) => {

    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (err) {
            return res.status(400).json({ error: "something went wrong....." })
        }

        if (user) {
            return res.status(400).json({ error: "email already exists" })
        }
        const { email, name, password } = req.body;
        const userName = shortId.generate();
        const profile = `${process.env.CLIENT_URL}/profile/${userName}`

        const newUser = new User({ password, userName, name, email, profile });
        newUser.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: err })
            }

            res.status(201).json({ message: 'user signup successful' })
        })
    })


}

exports.UserSignIn = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(500).json({ error: 'user not found' });
    }

    const passwordUser = await user.comparePassword(req.body.password, user.password)
    if (!passwordUser) {
        return res.status(500).json({ error: 'email id or password is incorrect' });
    }
    const usertoken = { id: user._id, name: user.name, email: user.email, role: user.role, userName: user.userName }
    const token = jwt.sign(usertoken, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('auth', token, { expiresIn: '1h' });
   
    return res.status(200).json(token);

}

exports.signout = (req, res) => {
    res.clearCookie('auth');
    res.json({
        message: 'signout successful'
    })
}

exports.requireSignin = jwtVerify({
    secret: process.env.JWT_SECRET
})

exports.AuthMiddleware = async (req,res,next)=>{
    const authUserId = req.user.id;

    const user = await User.findById({_id:authUserId})
    if(!user){
        return res.status(500).json({ error: 'user not found' }); 
    }

    req.profile = user;
    next();
}

exports.AuthAdmin = async (req,res,next)=>{
    const authAdminId = req.user.id;
    const user = await User.findById({_id:authAdminId})
    if(!user){
        return res.status(500).json({ error: 'user not found' }); 
    }

    if(user.role !== 1){
        return res.status(403).json({ error: 'access denied need admin rights' }); 
    }

    req.profile = user;
    next();
}

exports.googleLogin = (req,res)=>{
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const idToken = req.body.idToken;
    client.verifyIdToken({idToken,audience:process.env.GOOGLE_CLIENT_ID}).then((response)=>{
        const {email_verified,name,email,jti} = response.payload; 
        if(email_verified){
            
            User.findOne({email}).exec((err,user)=>{
                if(user){
                    const usertoken = { id: user._id, name: user.name, email: user.email, role: user.role, userName: user.userName }
                    const token = jwt.sign(usertoken,process.env.JWT_SECRET,{expiresIn:'1h'})
                    res.cookie('auth',token,{expiresIn:'1h'});
                    return res.status(200).json(token);
                }else{
                    const userName = shortId.generate();
                    const profile = `${process.env.CLIENT_URL}/profile/${userName}`
                    let password = jti;
                    user = new User({name,email,profile,userName,password});
                    user.save((err,data)=>{
                        if(err){
                            return res.status(400).json({error:err})
                        }
                        const usertoken = { id: user._id, name: user.name, email: user.email, role: user.role, userName: user.userName }
                        const token = jwt.sign(usertoken,process.env.JWT_SECRET,{expiresIn:'1h'})
                        res.cookie('auth',token,{expiresIn:'1h'});
                        return res.status(200).json(token);

                    })
                }
            }) 
        }else{
            return res.status(400).json({error:'Google login failed. Try again'})
        }
    })
}