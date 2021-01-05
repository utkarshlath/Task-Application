const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Error! Age must be positive!')
            }
        }
    },
    password:{
                type: String,
                required: true,
                validate(value){
                    if(value.includes('password')){
                        throw new Error('Password cannot be passowrd')
                    }
                    if(value.length<=6){
                        throw new Error('Length must be greater than 6')
                    }
                }
            },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email!')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'thisismynewcourse')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('Unable to Login!')
    }
    //console.log(user)
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched){
        throw new Error('Unable to Login!')
    }
    return user
}

//Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

//Delete user tasks when user deleted
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User