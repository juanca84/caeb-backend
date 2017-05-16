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
    if(req.method !== 'OPTIONS'){
      // console.log("revisando las cabeceras", req.headers);
      // Si no existe la propiedad Authorization en las cabeceras de la peticion.
      if(!req.headers.authorization) return res.status(403).send(util.formatearMensaje('ERROR', 'No se puede autentificar.no hay cabecera'));
      const token = req.headers.authorization.split(" ")[1];

      // Si no existe el token.
      if(!token) return res.status(403).send(util.formatearMensaje('ERROR', 'No se puede autentificar.no hay token'));
      const decoToken = jwt.decode(token, app.get('secretBJA'));

      // Si el token no es valido.
      if(!decoToken) return res.status(403).send(util.formatearMensaje('ERROR', 'No se puede autentificar el token.'));

      // Busca al usuario en la base de datos.
      return Usuario.findById(decoToken.id_usuario)
      .then(pUsuario => {

        // Si no existe el usuario.
        if(!pUsuario) throw new Error("No existe el Usuario");

        // Verifica la validez del token.
        if(token !== pUsuario.dataValues.token) throw new Error("El token no es valido...");

        // Si el usuario esta inactivo.
        if(pUsuario.estado ==='INACTIVO') throw new Error("El usuario esta inactivo, contacte al administrador.");

        const respaldo = JSON.parse(JSON.stringify(pUsuario));
        delete respaldo.token;
        delete respaldo.estado;
        delete respaldo._fecha_modificacion;
        const
          base = hash(respaldo),
          hashToken = hash(decoToken),
          actual = moment().tz('America/La_Paz').format('YYYY-MM-DD'),
          inicio = moment(respaldo.fecha_inicio).tz('America/La_Paz').format('YYYY-MM-DD'),
          fin = moment(respaldo.fecha_fin).tz('America/La_Paz').format('YYYY-MM-DD');

        // respaldo.fecha_inicio = inicio;
        // respaldo.fecha_fin = fin;

        console.log(respaldo, "\nREVISANDO\n", decoToken);
        // Compara el contenido del token con el de la base
        if(base !== hashToken) throw new Error("El token no es válido");

        // Valida si la fecha actual esta en el rango de vida del token.
        if(inicio <= actual && actual <= fin ) next();
        else throw new Error("El tiempo de vida del token, expiro. Contacte al administrador");

      })
      .catch(pError => res.status(403).send(util.formatearMensaje('ERROR',pError)));

    } else {
      next();
    }

  });



};
