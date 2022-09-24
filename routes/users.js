const {User} = require('../models/user')
const express = require("express");
const router = express.Router();


router.get(`/`,async (req, resp) => {
    const userList = await User.find();
   
    if(!userList){
        resp.status(500).json({success:false})
    }
    resp.send(userList);
  });
  
module.exports = router;