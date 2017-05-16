'use strict'
 module.exports = {
   up: function(queryInterface, Sequelize){

     return queryInterface.bulkInsert('usuario',
       [
         {
           "usuario":"khipus",
           "fecha_inicio":"2017-04-15T04:00:00.000Z",
           "fecha_fin":"2017-12-28T04:00:00.000Z",
           "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c3VhcmlvIjoxLCJ1c3VhcmlvIjoia2hpcHVzIiwiZmVjaGFfaW5pY2lvIjoiMjAxNy0wNC0xNVQwNDowMDowMC4wMDBaIiwiZmVjaGFfZmluIjoiMjAxNy0xMi0yOFQwNDowMDowMC4wMDBaIiwiX2ZlY2hhX2NyZWFjaW9uIjoiMjAxNy0wNC0xM1QwNDowMDowMC4wMDBaIn0.MqqVMsFWstUtp5usODs2lZfzG3TyTuyPD-Ld5mbhpIA",
           "estado":"ACTIVO",
           "_fecha_creacion":"2017-04-13T04:00:00.000Z",
           "_fecha_modificacion":"2017-04-13T04:00:00.000Z"
         }
       ]
     );
   },

   down: function(queryInterface, Sequelize){

   }
 }
