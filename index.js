const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.NODE_ENV === "production" ? 80 : process.env.PORT || 5000;


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use("/usermaster", require("./routes/user-route"));
app.use("/notemaster", require("./routes/note-route"));
app.use("/productmaster", require("./routes/product-route"));
app.use("/addtocartmaster", require("./routes/cart-route"));
app.use("/buyedproductmaster", require("./routes/buyedone-route"));
app.listen(PORT, () => {

  console.log("Server is running..");

});

module.exports = app;