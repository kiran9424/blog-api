const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({

    categoryName: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    }
},

    {
        timestamps: true
    }
)

module.exports = mongoose.model('Category',categorySchema);