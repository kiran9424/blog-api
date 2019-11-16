const Tag = require('../models/tag');
const slugify = require('slugify');

exports.createTag = async (req, res) => {
    const { tagName } = req.body;
    const slug = slugify(tagName, { replace: '-', lower: true })
    const tagFound = await Tag.findOne({ tagName });
    if (tagFound) {
        return res.status(500).json({ error: 'tag already exists' });
    }
    const tag = await Tag.create({ tagName, slug });
    if (!tag) {
        return res.status(500).json({ error: 'tag can\'t be created' });
    }
    res.status(201).json(tag)
}

exports.getAllTags = async(req,res)=>{
    const tags = await Tag.find({});
    if(!tags){
        return res.status(500).json({ error: 'tags not found' });
    }
    res.status(201).json(tags)
}

exports.getTagBySlug = async (req,res)=>{
    const slug = req.params.slug;
    const tag = await Tag.findOne({slug});
    if(!tag){
        return res.status(500).json({ error: 'tag not found' });
    }
    res.status(201).json(tag)
}

exports.deleteBySlug = async (req,res)=>{
    const slug = req.params.slug;
    const tag = await Tag.findOneAndDelete({slug});
    if(!tag){
        return res.status(500).json({ error: 'tag not found to delete' });
    }
    res.status(201).json({message:'tag deleted successfully',tagName:tag.tagName})
}