'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>{
    return queryInterface.bulkInsert('t_empresa',[
      {
        id:1,
        contratista:'ASOCIACIÓN ACCIDENTAL',
        familias:123,
        hectareas:5.7,
        piletas:11,
        conex:2,
        plazo_dias:800,
        ampliacion_dias:0,
        paralizacion_dias:1,
        estado_proyecto:'EJECUCION',
        total_ejecutado:1234,
        total_ejecutado_fte:1234,
        total_ejecutado_apl:12345,
        avance_fisico:47,
        avance_financiero:58,
        fecha_inicio:'03/06/2016',
        fecha_conclusion:'15/11/2017',
        ejecutor:'Saw',
      },

    ]);

  },
  down: (queryInterface, Sequelize) =>{

  },


};
