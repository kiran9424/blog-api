const express = require('express');
const router = express.Router();

const {requireSignin,AuthAdmin} = require('../controllers/auth');
const {createBlog,getAllBlogs,getAllBlogsCategoriesTags,getSingleBlog,deleteSingleBlog,updateSingleBlog,getBlogPhoto} = require('../controllers/blog');

router.post('/createblog',requireSignin,AuthAdmin,createBlog);
router.get('/blogs',getAllBlogs);
router.post('/blogs-categories-tags',getAllBlogsCategoriesTags)
router.get('/blog/:slug',getSingleBlog);
router.delete('/blog/:slug',requireSignin,AuthAdmin,deleteSingleBlog)
router.patch('/blog/:slug',requireSignin,AuthAdmin,updateSingleBlog)
router.get('/blog-pic/:slug',getBlogPhoto)

module.exports = router