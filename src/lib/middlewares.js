const
  bodyParser = require("body-parser"),
  express = require("express"),
  cors = require("cors"),
  morgan = require("morgan"),
  logger = require("./logger.js"),
  jwt = require("jwt-simple"),
  helmet = require('helmet'),
  moment = require('moment'),
  hash = require('object-hash');


module.exports = app => {

  // Constante que almacena la congfiguracion.
  const
    configuracion = app.src.config.config,
    Usuario = app.src.db.models.usuario,
    util = require('./util');

  // Establece el puerto
  app.set("port", configuracion.puerto);

  // Establece la llave secreta
  app.set("secretBJA", configuracion.jwtSecret);
  // Establece la sesion.
  // app.set("sesion", {});

  // Realiza el uso de morgan para generar logs.
  app.use(morgan("common", {
    stream: {
      write: (message) => {
        logger.info(message);
      },
    },
  }));

  // Realiza el uso de la libreria helmet.
  app.use(helmet());

  app.use(bodyParser.json({limit:'50mb'}));

  // Permite la visualizacion de los test, en entornos distintos a produccion.
  app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
    next();
  });

  // Establece el uso y configuracion de cors.
  app.use(cors({
    // "origin": "*",
    "Access-Control-Allow-Origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "preflightContinue": true,
    "headers": "Cache-Control, Pragma, if-modified-since,Content-Type, Authorization, Content-Length, X-Requested-With, validacion",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Content-Type-Options"
  }));

  // Deshabilita la informacion.
  app.disable('x-powered-by');

  // Realiza el uso de "bodyParser" para la recepcion de Json como body.
  app.use(bodyParser.json());

  // verifica si hay errores en el formato json
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
      res.status(400).json({ mensaje: "Problemas en el formato JSON" });
    } else {
      res.status(500).send('Error interno!');
      console.error(err.stack);
    }
  });


  // Verifica si el usuario se ha autenticado, para lo cual usa el token como llave.
  app.use('/api',(req,res,next) => {

    // console.log("revisando el entorno de trabajo", process.env.NODE_ENV);
    // if(process.env.NODE_ENV === 'development') return next();

    // Si el metodo de peticion es distinto a OPTIONS.
    next();
  });
};
