const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    passwordHash: bcrypt.hashSync(req.body.passwordHash, india), //secret
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

router.post(`/login`, async (req, resp) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return resp.status(400).send("The User not Found !");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: "1d" }
    );

    resp.status(200).send({ user: user.email, token: token });
  } else {
    return resp.status(400).send("The Password is wrong");
  }
});

router.post(`/register`, async (req, resp) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, india), //secret
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
