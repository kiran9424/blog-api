const mongoose = require('mongoose');
const tagSchema = new mongoose.Schema({

    tagName: {
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

module.exports = mongoose.model('Tag',tagSchema);