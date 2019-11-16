const Category = require('../models/category');
const slugify = require('slugify');

exports.createCategory = async (req, res) => {
    const { categoryName } = req.body;
    let slug = slugify(categoryName,
        { 
            replacement: '-', 
            lower: true 
        });
    const foundCategory = await Category.findOne({categoryName})
    if(foundCategory){
        return res.status(500).json({ error: 'category already exists' });
    }

        const category = await Category.create({categoryName,slug});

        if(!category){
            return res.status(500).json({ error: 'category can\'t be created' });
        }

        res.status(201).json(category);
}

exports.getAllCategories = async (req,res)=>{
    const categories = await Category.find();
    if(!categories){
        return res.status(500).json({ error: 'categories not found' });
    }
    res.status(200).json(categories);
}

exports.getCategoryBySlug = async(req,res)=>{
    const slug = req.params.slug;
    const category =  await Category.findOne({slug});
    if(!category){
        return res.status(500).json({ error: 'category not found' });
    }
    res.status(200).json(category);
}

exports.deleteCategoryBySlug = async(req,res)=>{
    const slug = req.params.slug;
    const category = await Category.findOneAndDelete({slug});
    if(!category){
        return res.status(500).json({ error: 'category not found to delete' });
    }
    res.status(200).json({message:'category deleted successfully',categoryName:category.categoryName});
}