/**
Archivo con los metodos necesarios para la asignacion de un administrador
introducido por parametro e inactivacion del administrador por defecto.
 */
importarClasificadores()

function importarClasificadores () {
  return new Promise((resolve, reject) => {
    const config = require(`../config/config`)()
    const Sequelize = require('sequelize')
    const sequelize = new Sequelize(config.database, config.username, config.password, config.params)
    const modelos = require('../model')(sequelize).models
    const Clasificador = modelos.clasificadores
    const XLSX = require('xlsx')
    const workbook = XLSX.readFile(`${__dirname}/CAEB_2011.xlsx`)
    const worksheet = workbook.Sheets['Hoja1']
    const headers = {}
    const data = []
    let clasificador = null
    let filaAux = 0
    let response = false
    let seccion = null
    let division = null
    let grupo = null
    let clase = null
    let tipo = null
    for (const z in worksheet) {
     if (z[0] === '!') continue
     //parse out the column, row, and value
     let tt = 0
     for (let i = 0; i < z.length; i++) {
       if (!isNaN(z[i])) {
         tt = i
         break
       }
     }
     const col = z.substring(0, tt)
     const row = parseInt(z.substring(tt))
     const value = worksheet[z].v
     if (row === 1 && value) {
       headers[col] = value
       continue
     }
     if (!data[row]) data[row] = {}
     if (headers[col] === 'DESCRIPCIÓN') {
       data[row]['descripcion'] = value
     } else {
       data[row]['tipo'] = headers[col]
       data[row]['codigo'] = value
     }
     if (filaAux !== row) {
       if (data[filaAux]) {
         if (data[filaAux]['tipo'] === 'SUBCLASE') {
           tipo = 'CLASE'
         } else if (data[filaAux]['tipo'] === 'CLASE') {
           tipo = 'GRUPO'
         } else if (data[filaAux]['tipo'] === 'GRUPO') {
           tipo = 'DIVISION'
         } else if (data[filaAux]['tipo'] === 'DIVISIÓN') {
           tipo = 'SECCION'
         }
       }
        Clasificador.findAll({
          limit: 1,
          where: { tipo },
          order: [ [ 'id', 'DESC' ]]
        }).then(function(entries){
          //only difference is that you get users list limited to 1
          //entries[0]
        })
       guardarClasificador(Clasificador, data[filaAux])
       .then(response => {
         console.log(response)
       })
       filaAux = row
     }
    }
    console.log('ultimo: ')
  })
}

function guardarClasificador (pModelo, data) {
  return new Promise((resolve, reject) => {
    pModelo.create(data)
    .then(pRespuesta =>
      resolve(pRespuesta.dataValues)
    )
    .catch(pError => {
      if (pError.name) {
        console.error('\nError en el registro: ', pError.message)
      } else {
        console.log(pError)
      }
    })
  })
}
