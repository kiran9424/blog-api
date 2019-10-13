const {check} = require('express-validator')

exports.userSignupValidator=[
    check('name')
    .not()
    .isEmpty()
    .withMessage('name is required'),

    check('email')
    .isEmail()
    .withMessage('email is invalid'),

    check('password')
    .isLength({min:6})
    .withMessage('password must conatin 6 characters')
]

exports.userSignInValidator=[
    check('email')
    .isEmail()
    .withMessage('email is invalid'),

    check('password')
    .isLength({min:6})
    .withMessage('password must conatin 6 characters')
]