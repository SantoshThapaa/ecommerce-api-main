const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')
const jwt = require('jsonwebtoken') // authorization
const { expressjwt } = require("express-jwt") // authentication

// to post user
exports.postUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    // check if email is already registered
    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: 'email is already registered' })
            }
            else {
                user = await user.save()
                if (!user) {
                    return res.status(400).json({ error: 'something went wrong while creating your account' })
                }
                // send token to database
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id,
                })
                token = await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'failed to create token' })
                }
                const url = process.env.FRONTEND_URL + '\/email\/confirmation\/' + token.token
                // send email
                sendEmail({
                    from: 'no-reply@ecommercestore.com',
                    to: user.email,
                    subject: 'Email Verification',
                    text: `Hello\nPlease verify your email by clicking the link below\n\n
                    http://${req.headers.host}/api/confirmation/${token.token}`,
                    html: `
                    <h1>Verify your email</h1>
                    <a href='${url}'>Click to Verify</a>`
                })
                res.send(user)
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

// email confirmation
exports.postEmailConfiguration = (req, res) => {
    // at first find the valid or matching token
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                return res.status(400).json({ error: 'Invalid token or Token may have expired' })
            }
            // if we found the valid token then find the valid user for that token
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(403).json({ error: 'We are unable to find a valid user for this token' })
                    }
                    // check if the user is already verified or not
                    if (user.isVerified) {
                        return res.status(400).json({ error: 'Email is already verified. Login to continue' })
                    }
                    // save the verified user
                    user.isVerified = true
                    user.save()
                        .then(user => {
                            if (!user) {
                                return res.status(400).json({ error: 'Failed to verify your email' })
                            }
                            else {
                                res.json({ msg: 'Your email has been verified' })
                            }
                        })
                        .catch(err => {
                            return res.status(400).json({ error: err })
                        })
                })
                .catch(err => {
                    return res.status(400).json({ error: err })
                })
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

// login process
exports.signIn = async (req, res) => {
    // destructuring userSelect: 
    const { email, password } = req.body

    // at first check if email is registered in the database or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(403).json({ error: 'Sorry the email you provided has not been registered' })
    }
    // if email is found check the matching password for the email
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Email and Password doesn't match" })
    }
    // check if user is verified
    if (!user.isVerified) {
        return res.status(400).json({ error: 'Please verify your email being logging in' })
    }
    // now generate token using user id and jwt secret
    const token = jwt.sign({ _id: user._id, role:user.role }, process.env.JWT_SECRET)
    // store token in the cookie
    res.cookie('myCookie', token, { expire: Date.now() + 999999 })
    // return user information to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { _id, name, email, role } })
}

// forget password
exports.forgetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ error: 'email has not been registered' })
    }
    let token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'failed to create the token, process terminated' })
    }
    // sendEmail
    const url = process.env.FRONTEND_URL+'\/reset\/password\/'+token.token
    sendEmail({
        from: 'no-reply@ecommercestore.com',
        to: user.email,
        subject: 'Password Reset Link',
        text: `Hello\nPlease reset your password by clicking the link below\n\nhttp://${req.headers.host}/api/resetpassword/${token.token}`,
        html: `
        <h1>Reset your password</h1>
        <a href='${url}'>Click to reset your password</a>`
    })
    res.json({ message: 'password reset link has been sent to you email' })
}
// reset password
exports.resetPassword = async (req, res) => {
    // find valid or matching token
    const token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(404).json({ error: 'invalid token or token may have expired' })
    }
    // if token is found then find the 
    let user = await User.findOne({ _id: token.userId })
    if (!user) {
        return res.status(404).json({ error: 'We are unable to find a valid user for this token' })
    }
    // new password set and save
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(500).json({ error: 'failed to reset password' })
    }
    res.json({ message: 'password updated successfully' })
}

// user listStyle: 
exports.userList = async (req, res) => {
    const user = await User.find()
        .select('-hashedPassword')
        .select('-salt')
    if (!user) {
        return res.status(404).json({ error: 'something went wrong' })
    }
    res.send(user)
}

// user details
exports.userDetails = async (req, res) => {
    const user = await User.findById(req.params.uid)
        .select('-hashedPassword')
        .select('-salt')
    if (!user) {
        return res.status(404).json({ error: 'something went wrong' })
    }
    res.send(user)
}

// admin middleware
exports.requireAdmin = (req, res, next) => {
    // verify jwt
    expressjwt(
        {
            secret: process.env.JWT_SECRET,
            algorithms: ["HS256"],
            userProperty: 'auth'
        })
        (req, res, (err) => {
            if (err) {
                return res.status(401).json({ error: 'unauthorized access' })
            }
            // check for user role
            // const tempval = req.auth.role
            // return res.status(410).json({specialmsg: tempval, second:'1234'})
            if (req.auth.role === 1) {
                next()
            }
            else {
                return res.status(403).json({ error: 'you are not authorized to access this page' })
            }
        })
    // , function (req, res) {
    //     if (req.auth.role == 0)
    //         return res.status(401).json({ error: 'unauthorized access' })
    //     else if (req.auth.role == 1)
    //         next()
    //     else {
    //         return res.status(403).json({ error: 'you are not authorized to access this page' })
    //     }
    // }
}

// user middleware
exports.requireUser = (req, res, next) => {
    // verify jwt
    expressjwt(
        {
            secret: process.env.JWT_SECRET,
            algorithms: ["HS256"],
            userProperty: 'auth'
        })
        (req, res, (err) => {
            if (err) {
                return res.status(401).json({ error: 'unauthorized access' })
            }
            if (req.auth.role === 0) {
                next()
            }
            else {
                return res.status(403).json({ error: 'you are not authorized to access this page' })
            }
        })
}

// sign out
exports.signOut = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: 'signout success' })
}