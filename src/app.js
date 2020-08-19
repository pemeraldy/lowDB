const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const fileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");
const _ = require("lodash");

const db = lowDb(new fileSync("store.json"));

db.defaults({ products: [] }).write();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    health: "ok",
  });
});

/**
 *
 *
 * /products?category=adult
 * /products?category=adult,digital
 * /products?category=adult,digital&sort=high_to_low
 */
app.get("/products", (req, res) => {
  let data = [];
  let query = db.get("products");
  let { category, sort } = req.query;
  if (category) {
    categories = category.split(",");
    query = query.filter((item) => {
      let intersection = _.intersection(item.categories, categories);
      return intersection.length > 0;
    });
  }

  if (sort) {
    sort = sort.split(",");
    sort = sort[0]; // options are low_to_high, high_to_low
    query = query.sort((a, b) =>
      ["low_to_high"].includes(sort)
        ? a.unit_price - b.unit_price
        : b.unit_price - a.unit_price
    );
  }

  data = query.value();
  return res.json(data);
});

app.get("/products/:id", (req, res) => {
  const data = db
    .get("products")
    .find({ id: req.params.id })
    .value();
  if (data) {
    return res.json(data);
  }
  return res.status(404).send();
});

app.get("/categories", (_req, res) => {
  /*Not good for perfomance but works for our scale*/
  const cats = db
    .get("products")
    .map("categories")
    .flatten()
    .uniq()
    .value();
  return res.json(cats);
});

app.get("*", (_, res) => {
  return res.status(404);
});

module.exports = app;

