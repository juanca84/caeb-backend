
const
  fs = require("fs"),
  path = require("path"),
  Sequelize = require("sequelize"),
  modelos = require('./model');
let db = null;

module.exports = app => {
  if (!db) {
    const config = app.src.config.config;
    const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.params
    );

    db = {
        sequelize,
        Sequelize,
        models: modelos(sequelize).models,
    };

  }
 return db;
};
