const
  sequelizeHandlers = require("sequelize-handlers"),
  sequelizeFormly = require("sequelize-formly"),
  sequelize = require("sequelize"),
  _ = require("lodash"),
  moment = require('moment');

module.exports = app => {
  const
    Proyecto = app.src.db.models.t_proyecto,
    Empresa = app.src.db.models.t_empresa,
    util = require('../../lib/util');


    /**
    @apiVersion 1.0.0
    @apiGroup proyecto
    @apiName Get todos
  	@api {get} /api/v1/proyectos?page=0&limit=10 Obtiene listado de proyectos con su empresa.

    @apiDescription Get para proyecto, obtiene todos los datos del modelo proyecto, con su empresa

    @apiParam (Query) {Texto} order Campo por el cual se ordenara el resultado
    @apiParam (Query) {Numerico} limit Cantidad de resultados a obtener
    @apiParam (Query) {Numerico} page Número de página de resultados


    @apiSuccessExample {Array} Respuesta :
    HTTP/1.1 200 OK
    {
      "tipoMensaje": "EXITO",
      "mensaje": "Obtencion de datos exitoso",
      "datos": [
        {
          "id": 1,
          "convenio": "a",
          "nombre_proyecto": "Proyecto A",
          "departamento": "La Paz",
          "provincia": "Murillo",
          "municipio": "Nuestra señora de la paz",
          "sisin": "sisin",
          "tipo": "ESTRATEGICO",
          "sector": "Salud",
          "longitud_x": -68.15,
          "latitud_y": -16.5,
          "monto_total": "50000.00",
          "monto_total_fuente": "30000.00",
          "monto_total_apl": "20000.00",
          "estado": "PROCESO",
          "descripcion": "Mi primer proyecto",
          "ambiental": "NO",
          "social": "SI",
          "empresa": {
            "cod_empresa": 1,
            "id": 1,
            "contratista": "la Rana Rene",
            "familias": 1,
            "hectareas": 5.7,
            "piletas": 11,
            "conex": 2,
            "plazo_dias": 200,
            "ampliacion_dias": 0,
            "paralizacion_dias": 1,
            "estado_proyecto": "PROCESO",
            "total_ejecutado": 10000,
            "total_ejecutado_fte": 5000,
            "total_ejecutado_apl": 4500,
            "avance_fisico": "50.00",
            "avance_financiero": "80.00",
            "fecha_inicio": "2017-01-13T00:00:00.000Z",
            "fecha_conclusion": "2017-11-25T00:00:00.000Z",
            "ejecutor": "Saw"
          }
        }, ...
      ]
    }
  */
  app.get('/api/v1/proyectos', (req,res) => {

    // Instancia el objeto opciones de consulta.
    const op = {};
    op.include=[];
    // Agrega a la opciones el modelo empresa.
    op.include.push({ model:Empresa, as:'empresa'});

    // Si existen los parametros, de lo contrario asigna valores por default
    if(req.query.limit) op.limit = req.query.limit || 50;
    else op.limit = 50;
    if(req.query.page) op.offset = req.query.page || 0;
    if(req.query.order) op.order = req.query.order;
    op.order = 'id';

    // Realiza la busqueda.
    Proyecto.findAll(op)
    .then( pProyectos => {

      if(pProyectos.length === 0)
        res.status(200).send(util.formatearMensaje('EXITO', "No hay datos",{total:0,datos:[]}));
      else
        res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso',{total:pProyectos.length, datos:pProyectos}));
    })
    .catch(pError => {
      console.log("Revisando el Error", pError);
      res.status(412).send(util.formatearMensaje('ERROR', pError));
    });
  });

  /**
  @apiVersion 1.0.0
  @apiGroup proyecto
  @apiName Get cantidad
  @api {get} /api/v1/proyectos/cantidad Obtiene el número total de proyectos.

  @apiDescription Get para proyecto, obtiene la cantidad de proyectos existentes

  @apiSuccessExample {Array} Respuesta :
  HTTP/1.1 200 OK
  {
    "tipoMensaje": "EXITO",
    "mensaje": "Obtencion de datos exitoso",
    "datos": 0
  }
*/
  app.get('/api/v1/proyectos/cantidad', (req,res) => {
    Proyecto.count()
    .then(pResp => {
      res.status(200).send(util.formatearMensaje('EXITO', "Obtención de datos exitoso",pResp));
    })
    .catch(pError => {
      res.status(412).send(util.formatearMensaje('ERROR', pError));

    });

  });
};
