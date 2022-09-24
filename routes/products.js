const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

router.get(`/`, async (req, resp) => {
  const productList = await Product.find().select("name image -_id"); //.select to show only those params -to don't show id
  if (!productList) {
    resp.status(500).json({ success: false });
  }
  resp.send(productList);
});

router.get(`/`, async (req, resp) => {
  if (req.query.categories) {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find({ category: filter });
    if (!productList) {
      resp.status(500).json({ success: false });
    }
    resp.send(productList);
  }
});

router.get(`/:id`, async (req, resp) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    resp.status(500).json({ success: false });
  }
  resp.send(product);
});

router.post(`/`, async (req, resp) => {
  const category = await Category.findById(req.body.category);
  if (!category) return resp.status(400).send("Invalid Category");

  let product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
    description: req.body.description,
    richDescription: req.body.richDescription,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();

  if (!product) {
    return resp.status(500).send("The Product cannot be create !!");
  }
  resp.send(product);
});

router.put(`/:id`, async (req, resp) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    resp.status(400).send("Invalid Product Id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return resp.status(400).send("Invalid Category");

  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
      description: req.body.description,
      richDescription: req.body.richDescription,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product)
    return resp.status(404).send("The Product cannnot be created !!");
  else {
    resp.send(product);
  }
});

router.delete(`/:id`, (req, resp) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return resp
          .status(200)
          .json({ success: true, message: "The Product Deleted" });
      } else {
        return resp
          .status(500)
          .json({ success: false, message: "Product Not found" });
      }
    })
    .catch((err) => {
      return resp.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, resp) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    resp.status(500).json({ success: false });
  }
  resp.send({
    productCount: productCount,
  });
});

router.get(`/get/featured/:count`, async (req, resp) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    resp.status(500).json({ success: false });
  }
  resp.send(products);
});

module.exports = router;
