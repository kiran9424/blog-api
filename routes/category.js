const express = require('express');
const router = express.Router();

const {runValidation} = require('../validators');
const {categoryValidator} = require('../validators/category')
const {requireSignin,AuthAdmin} = require('../controllers/auth');
const{createCategory,getAllCategories,getCategoryBySlug,deleteCategoryBySlug} = require('../controllers/category');

router.post('/createcategory',categoryValidator,runValidation,requireSignin,AuthAdmin,createCategory);
router.get('/categories',getAllCategories);
router.get('/categories/:slug',getCategoryBySlug);
router.delete('/categories/:slug',requireSignin,AuthAdmin,deleteCategoryBySlug);

module.exports = router;