const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const jwtVerify = require('express-jwt');

exports.UserSignup = (req, res, next) => {

    User.findOne({ email: req.body.email }).exec((err, email) => {
        if (err) {
            return res.status(400).json({ error: "something went wrong....." })
        }

        if (email) {
            return res.status(400).json({ error: "email already exists" })
        }
    })

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

exports.signout =(req,res)=>{
    res.clearCookie('auth');
    res.json({
        message:'signout successful'
    })
}

exports.requireSignin = jwtVerify({
    secret:process.env.JWT_SECRET
})