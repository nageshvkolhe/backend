const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get(`/`, async (req, resp) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    resp.status(500).json({ success: false });
  }
  resp.send(userList);
});

router.get(`/:id`, async (req, resp) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    resp
      .status(500)
      .json({ message: "The Ueser with given Id was not found !!" });
  }
  resp.send(user);
});

router.post(`/`, async (req, resp) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10), //secret
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();

  if (!user) {
    return resp.status(500).send("The User cannot be create !!");
  }
  resp.send(user);
});

module.exports = router;
