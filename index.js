

const
  express = require("express"),
  consign = require("consign"),
  app= express();


console.log("inicio");
consign()
  .include("src/config/config.js")
  .then("src/lib/util.js")
  .then("src/db.js")
  .then("src/lib/middlewares.js")
  .then("src/routes")
  .then("src/lib/boot.js")
  .into(app);
module.exports=app;
