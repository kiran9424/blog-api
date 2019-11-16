const {check} = require('express-validator')

exports.tagValidator=[
    check('tagName')
    .not()
    .isEmpty()
    .withMessage(' tag name is required')

]