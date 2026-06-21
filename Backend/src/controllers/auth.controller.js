const  userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function registerUserController(req, res) {
    try {
        const username = req.body.username?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "You need username, email and password to register"
            })
        }

        if (username.length < 3) {
            return res.status(400).json({
                message: "Username must be at least 3 characters"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            })
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            })
        }

        const existingByUsername = await userModel.findOne({ username })
        if (existingByUsername) {
            return res.status(400).json({
                message: "Account already registered with this username"
            })
        }

        const existingByEmail = await userModel.findOne({ email })
        if (existingByEmail) {
            return res.status(400).json({
                message: "Account already registered with this email"
            })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username, email, password: hash })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        })

        return res.status(201).json({
            message: "user registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0]
            return res.status(400).json({
                message:
                    field === "email"
                        ? "Account already registered with this email"
                        : "Account already registered with this username"
            })
        }

        console.error("Register error:", err)
        return res.status(500).json({
            message: "Registration failed. Please try again."
        })
    }
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

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
})

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