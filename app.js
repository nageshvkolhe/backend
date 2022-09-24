// console.log("Hello World");
// console.log("Hey !!!")

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');

require("dotenv/config");

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routes
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const categoriesRoutes = require('./routes/categories');


const api = process.env.API_URL;

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/categories`, categoriesRoutes);


//Database
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection successfull !!!");
  })
  .catch(() => {
    console.log(err);
  });


//server
app.listen(3000, () => {
  console.log("Server running on 3000 port");
});

// module.exports = router;
