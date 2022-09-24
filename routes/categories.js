const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, resp) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    resp.status(500).json({ success: false });
  }
  resp.status(200).send(categoryList);
});

router.get(`/:id`, async (req, resp) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    resp
      .status(500)
      .json({ message: "The Category with given ID was not found !!" });
  }
  resp.status(200).send(category);
});

router.post(`/`, async (req, resp) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category)
    return resp.status(404).send("The Category cannnot be created !!");
  resp.send(category);
});

router.put(`/:id`, async (req, resp) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );
  if (!category)
    return resp.status(404).send("The Category cannnot be created !!");

  resp.send(category);
});

router.delete(`/:id`, (req, resp) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return resp
          .status(200)
          .json({ success: true, message: "the category is deleted" });
      } else {
        return resp
          .statusI(404)
          .json({ success: false, message: "Category did not found !!!" });
      }
    })
    .catch((err) => {
      return resp.status(400).json({ success: false, error: err });
    });
});

// router.update
module.exports = router;
