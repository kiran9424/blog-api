const {check} = require('express-validator')

exports.categoryValidator=[
    check('categoryName')
    .not()
    .isEmpty()
    .withMessage('category name  is required')

]