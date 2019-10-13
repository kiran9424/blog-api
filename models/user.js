const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            max: 32,
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            lowercase: true
        },
        profile: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        about: {
            type: String
        },
        role: {
            type: Number,
            trim: true
        },
        photo: {
            data: Buffer,
            contentType: String
        },

        resetPasswordLink: {
            data: String,
            default: ''
        }

    },
    {
        timestamps: true
    }

)

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password,12)
    next();
})

userSchema.methods.comparePassword = async function(userEnteredPassword,hashedPassword){
    return await  bcrypt.compare(userEnteredPassword,hashedPassword)
}

module.exports=mongoose.model('User',userSchema)