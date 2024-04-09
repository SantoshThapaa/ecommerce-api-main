const express = require('express')
const { postCategory, allCategory, categoryDetails, deleteCategory, updateCategory } = require('../controllers/categoryController')
const router = express.Router()
const { categoryValidation, validation } = require('../validation/validator')
const { requireAdmin } = require('../controllers/userController')

router.post('/postcategory', requireAdmin, categoryValidation, validation, postCategory)
router.get('/allcategory', allCategory)
router.get('/categorydetails/:id', categoryDetails)
router.delete('/deletecategory/:id', requireAdmin, deleteCategory)
router.put('/updatecategory/:id', requireAdmin, categoryValidation, validation, updateCategory)

module.exports = router