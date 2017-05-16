'use strict';

module.exports = {
  up(queryInterface) {
    // ADMIN
    let proyectos = [];
    for (let i = 1; i <= 3; i ++){
      const obj = {
        id: i,
        convenio:'PROAR',
        nombre_proyecto:`CONSTRUCCIÓN DE LA REPRESA LA PAZ (HAMPATURI ALTO) #${i}`,
        departamento:'LA PAZ',
        provincia:'MURILLO',
        municipio:'LA PAZ',
        sisin:'02873954200000',
        tipo:'INV',
        sector:'AGUA',
        latitud_y:-67.715615234375,
        longitud_x:-16.052314475477,
        monto_total:12469134,
        monto_total_fuente:123456,
        monto_total_apl:12345678,
        estado:'EJECUCION',
        descripcion:'Descripción del proyecto HAMPATURI',
        ambiental:'SI',
        social:'SI',
      };
      proyectos.push(obj);
    }
    return queryInterface.bulkInsert('t_proyecto', proyectos, {});
  },

  down: (queryInterface, Sequelize) =>{

  },


};
