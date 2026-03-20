const  userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function registerUserController(req,res) {
    const{username,email,password} = req.body
    
    if(!username || !email || !password){
        return res.status(400).json({
            message:"you need username email and password to register a user"
        })
    }

    const isUserAlreadyExisted = await userModel.findOne({
         $or: [{username},{email}]
    })

    if(isUserAlreadyExisted){
        return res.status(400).json({
            message:"Account already registered with this username and email"
        })
    }

    if(isUserAlreadyExisted === username){
        return res.status(400).json({
            message:"Account already registered with this username"
        })
    }
    if(isUserAlreadyExisted === email){
        return res.status(400).json({
            message:"Account already registered with this email"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })
    const token = jwt.sign({
        id:user._id,username:user.username
    },process.env.JWT_SECRET,
    {expiresIn:"1d"})

    res.cookie("token",token)

    res.status(201).json({
        message:"user registered successfully",
        user:{
            id:user._id,
            username: user.username,
            email:user.email
        }
    })
}

async function loginUserController(req,res){
    const {email,password}=req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign({
        id:user._id, 
        username: user.username
    },process.env.JWT_SECRET,
    {expiresIn:"1d"})

    res.cookie("token",token)
     res.status(201).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            email:user.email
        }
    })

}

async function logOutUserController(req,res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"user logged out successfully"
    })
}

async function getMeController(req,res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User Detail Fetched Successfully",
        user:{
            id:user._id,
            username: user.username,
            email:user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logOutUserController,
    getMeController
}