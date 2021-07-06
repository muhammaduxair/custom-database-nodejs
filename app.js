const fs = require("fs");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5555;

const fetchDB = fs.readFileSync("db.json", "utf-8");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// home page
app.get("/", (req, res) => {
  const data = JSON.parse(fetchDB);
  const makePaths = Object.keys(data).map((v) => `/${v}`);
  makePaths.unshift("Availible Links");
  res.send(makePaths);
});

// all products
app.get("/products", (req, res) => {
  res.send(JSON.parse(fetchDB).products);
});

// product by id
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const getProducts = JSON.parse(fetchDB).products;
  const filterByID = getProducts.filter((data) => data.id == id);
  filterByID.length
    ? res.send(filterByID[0])
    : res.status(400).send(`Not Product Found By This User id ${id}`);
});

// add products
app.post("/products/add", (req, res) => {
  if (req.body.name && req.body.price) {
    const data = JSON.parse(fetchDB);
    data.products.push(req.body);
    fs.writeFileSync("db.json", JSON.stringify(data));
    res.send(req.body);
  } else {
    res.status(400).send("Please Must be Add Name and Price");
  }
});

// update Products
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const getProducts = JSON.parse(fetchDB);
  const checkAvalibilty = getProducts.products.filter((data) => data.id == id);

  if (checkAvalibilty.length) {
    getProducts.products.map((data) => {
      if (data.id == id) {
        req.body.name ? (data.name = req.body.name) : "";
        req.body.price ? (data.price = req.body.price) : "";
      }
      return data;
    });
    fs.writeFileSync("db.json", JSON.stringify(getProducts));
    res.send(checkAvalibilty[0]);
  } else {
    res.status(400).send(`Not Product Found By This User id ${id}`);
  }
});

// delete product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const getProducts = JSON.parse(fetchDB);
  const checkAvalibilty = getProducts.products.filter((data) => data.id == id);

  if (checkAvalibilty.length) {
    const newData = getProducts.products.filter((data) => {
      return data.id != id;
    });
    getProducts.products = newData;
    fs.writeFileSync("db.json", JSON.stringify(getProducts));
    res.send(checkAvalibilty[0]);
  } else {
    res.status(400).send(`Not Product Found By This User id ${id}`);
  }
});

app.listen(
  PORT,
  console.log(`Your Sserver is Running on Port http://localhost:${PORT}`)
);
