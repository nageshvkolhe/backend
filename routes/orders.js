const {Order} = require('../models/order')
const express = require("express");
const router = express.Router();


router.get(`/`,async (req, resp) => {
    const orderList = await Order.find();
   
    if(!orderList){
        resp.status(500).json({success:false})
    }
    resp.send(orderList);
  });
  
module.exports = router;