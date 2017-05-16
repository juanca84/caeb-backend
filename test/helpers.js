const
  supertest = require("supertest"),
  chai = require("chai"),
  app = require("../index.js");

global.app=app;
//como supervisor ejecutara el servidor es para no tener dos consolas
global.request = supertest(app);
global.expect = chai.expect;
