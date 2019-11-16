const express = require('express');
const router = express.Router();

const {runValidation} = require('../validators');
const {tagValidator} = require('../validators/tag')
const {requireSignin,AuthAdmin} = require('../controllers/auth');
const{createTag,getAllTags,getTagBySlug,deleteBySlug} = require('../controllers/tag')

router.post('/createtag',tagValidator,runValidation,requireSignin,AuthAdmin,createTag);
router.get('/tags',getAllTags);
router.get('/tag/:slug',getTagBySlug)
router.delete('/tag/:slug',requireSignin,AuthAdmin,deleteBySlug)

module.exports = router