const { check,validationResult } = require('express-validator')

exports.categoryValidation=[
    check('category_name','category name is required').notEmpty()
    .isLength({min: 3}).withMessage('category must must be longer than 3 characters')
]

exports.productValidation = [
    check('productName','product name is required').notEmpty()
    .isLength({min:3}).withMessage('product name must be longer than 3 characters'),
    check('productPrice','price is required').notEmpty()
    .isNumeric().withMessage('product price must be numeric value'),
    check('countInStock','count in stock is required').notEmpty()
    .isNumeric().withMessage('count in stock must be numeric value'),
    check('category','category is required'),
    check('productDescription','description is required').notEmpty()
    .isLength({min:20}).withMessage('product name must be longer than 20 characters'),
]

exports.userValidation = [
    check('name','name is required').notEmpty()
    .isLength({min:3}).withMessage('name must have 3 characters or more'),
    check('email','email is required').notEmpty()
    .isEmail().withMessage('Invalid email format'),
    check('password','password is required').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('password must contain at least one number')
    .matches(/[@#$^&-+=()]/).withMessage('password must contain at least one special character')
    .isLength({min:8}).withMessage('password must be at least 8 characters long')
    .isLength({max: 32}).withMessage('password cannot be longer than 32 characters')
]

exports.passwordValidation = [
    check('password','password is required').notEmpty()
    .matches(/[a-z]/).withMessage('password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('password must contain at least one numerical digit')
    .matches(/[@#$^&-+=()]/).withMessage('password must contain at least one special character')
    .isLength({min:8}).withMessage('password must be at least 8 characters long')
    .isLength({max: 32}).withMessage('password cannot be longer than 32 characters')
]

exports.validation = (req,res,next) =>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error: errors.array()[0].msg})
    }
}