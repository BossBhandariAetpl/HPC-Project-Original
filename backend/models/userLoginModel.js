import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userLoginSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        uId: {
            type: Number,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            required: true,
            default: 'active'
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            required: true,
            default: 'user'
        }
    },
    { timestamps: true }
)

userLoginSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        next(err);
    }
})

userLoginSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const UserLogin = mongoose.model('UserLogin', userLoginSchema);

export default UserLogin;