const
  sequelizeHandlers = require("sequelize-handlers"),
  sequelizeFormly = require("sequelize-formly"),
  sequelize = require("sequelize"),
  _ = require("lodash"),
  moment = require('moment');

module.exports = app => {

  const
    Empresa = app.src.db.models.t_empresa,
    util = require('../../lib/util');




  app.get('/api/empresas', (req,res) => {
    Empresa.findAll()
    .then( rEmpresas => {
      console.log("Empresa", rEmpresas);
      if(rEmpresas.length === 0)res.status(412).send(util.formatearMensaje('EXITO', "No hay datos"));
      else res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso',rEmpresas));
    })
    .catch(pError => {
      res.status(412).send(util.formatearMensaje('ERROR', pError));
    });
  });


};
