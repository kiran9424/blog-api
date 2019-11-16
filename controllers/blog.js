const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const slug = require('slugify');
const formidable = require('formidable');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog')

exports.createBlog = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'image could not be uploaded' })
        }

        const { title, body, categories, tags } = fields;

        if (!title || !title.length || title === null) {
            return res.status(400).json({ error: 'title is required' });
        }

        if (!body || body.length < 200 || body === null) {
            return res.status(400).json({ error: 'body is required and body should have minimum 200 characters' });
        }
        if (!categories || categories.length === 0 || categories === null) {
            return res.status(400).json({ error: 'at least one category is required' });
        }

        if (!tags || tags.length === 0 || tags === null) {
            return res.status(400).json({ error: 'at least one tag is required' });
        }

        let newBlog = new Blog();
        newBlog.title = title;
        newBlog.body = body;
        newBlog.excerpt = smartTrim(body, 320, ' ', ' ...')
        newBlog.slug = slug(title, { replace: '-', lower: true });
        newBlog.metaTitle = `${title} | ${process.env.APP_NAME}`;
        newBlog.metaDescription = stripHtml(body.substring(0, 160));
        newBlog.postedBy = req.user.id;

        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');

        if (files.photo) {

            if (files.photo.size > 10000000) {
                return res.status(400).json({ error: 'photo size should be less than or equal to 1MB' })
            }

            newBlog.photo.data = fs.readFileSync(files.photo.path);
            newBlog.photo.contentType = files.photo.type;
        }
        newBlog.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: 'blog cannot be created', err })
            }
            // res.status(201).json(result)
            Blog.findByIdAndUpdate({ _id: result._id }, { $push: { categories: arrayOfCategories } }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({ error: 'blog cannot be created', err })
                } else {
                    Blog.findByIdAndUpdate({ _id: result._id }, { $push: { tags: arrayOfTags } }, { new: true }).exec((err, result) => {
                        if (err) {
                            return res.status(400).json({ error: 'blog cannot be created', err })
                        } else {
                            res.status(201).json(result)
                        }
                    })
                }


            })
        })
    })
}

exports.getAllBlogs = async (req, res, next) => {
    const blogs = await Blog.find({})
        .populate('categories', '_id categoryName slug')
        .populate('tags', '_id tagName slug')
        .populate('postedBy', '_id name userName')
        .select('_id title slug excerpt categories tags posteBy createdAt updatedAt');
    if (!blogs) {
        return res.status(400).json({ error: 'No blogs to display' })
    }
    res.status(200).json(blogs)
}

exports.getAllBlogsCategoriesTags = async (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;



    let blogs = await Blog.find({})
        .populate('categories', '_id categoryName slug')
        .populate('tags', '_id tagName slug')
        .populate('postedBy', '_id name userName profile')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select('_id title slug excerpt categories tags posteBy createdAt updatedAt');

    if (!blogs) {
        return res.status(400).json({ error: 'No blogs to display' })
    }

    let tags = await Tag.find({})
    if (!tags) {
        return res.status(400).json({ error: 'No tags to display' })
    }

    let categories = await Category.find({})
    if (!categories) {
        return res.status(400).json({ error: 'No categories to display' })
    }

    res.status(200).json({ blogs, tags, categories, size: blogs.length })
}

exports.getSingleBlog = async (req, res) => {
    const slug = req.params.slug
    const blog = await Blog.findOne({ slug })
        .populate('categories', '_id categoryName slug')
        .populate('tags', '_id tagName slug')
        .populate('postedBy', '_id name userName')
        .select('_id title body metaTitle metaDescription categories tags posteBy createdAt updatedAt');

    if (!blog) {
        return res.status(400).json({ error: 'No blog to display' })
    }

    res.status(200).json(blog)
}

exports.deleteSingleBlog = async (req, res) => {
    const slug = req.params.slug
    const blog = await Blog.findOneAndRemove({ slug })

    if (!blog) {
        return res.status(400).json({ error: 'No blog to delete' })
    }

    res.status(200).json({ message: 'Blog delete successfully' })
}

exports.updateSingleBlog = async (req, res) => {
    const slug = req.params.slug
    Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({ error: err })
        }
        if (!oldBlog) {
            return res.status(400).json({ error: 'No blog to update' })
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, description, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldBlog.metaDescription = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path);
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

exports.getBlogPhoto =async(req,res)=>{
    const slug = req.params.slug;
    const blog = await Blog.findOne({slug});
    if(!blog){
        return res.status(400).json({ error: 'No blog to display' })
    }
    res.set('Content-Type',blog.photo.contentType);
    return res.send(blog.photo.data)
}