const express = require('express')
const { postOrder, orderList, orderDetails, updateStatus, userOrderList } = require('../controllers/orderController')
const { requireUser, requireAdmin } = require('../controllers/userController')
const router = express.Router()

router.post('/postorder', requireUser ,postOrder)
router.get('/orderlist', requireAdmin, orderList)
router.get('/orderdetails/:id', requireUser, orderDetails)
router.put('/updatestatus/:id', requireAdmin, updateStatus)
router.get('/userorderlist/:userid', requireUser, userOrderList)

module.exports = router