const logger = require("../lib/logger.js");

console.log("configuracion de test activada");
//Archivo de configuracion para conexion a la base de datos
module.exports = {
  database: "[miDB]", // "plantillas_db"
  username: "[miUsuario]", // "postgres"
  password: "[miSuperPassword]", // "123abc"
  host:'miHostBackend', // test.local.agetic.gob.bo/plantillas-api
  tiempo_token:60,
  params: {
      dialect: "postgres",
      port: 5432,
      host: "localhost",
      pool: {
          "max": 15,
          "min": 0,
          "idle": 10000,
      },
      sync: {force: process.env.FORCE || false},
      logging: (sql) => { logger.info(`[${new Date()}] ${sql}`); },
      define: { underscored: true},
  },
  //configuracion con jwt poner una palabra secreta segura
  jwtSecret: "[miClave]",
  jwtSession: { session: false },
  puerto: 8001
};
