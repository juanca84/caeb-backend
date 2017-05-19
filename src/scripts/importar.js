/**
Archivo con los metodos necesarios para la asignacion de un administrador
introducido por parametro e inactivacion del administrador por defecto.
 */
guardarClasificadores()

function guardarClasificadores () {
  return new Promise((resolve, reject) => {
    const config = require(`../config/config`)()
    const Sequelize = require('sequelize')
    const sequelize = new Sequelize(config.database, config.username, config.password, config.params)
    const modelos = require('../model')(sequelize).models
    const Clasificador = modelos.clasificadores
    const XLSX = require('xlsx')
    const async = require('async')
    const workbook = XLSX.readFile(`${__dirname}/CAEB_2011.xlsx`)
    const worksheet = workbook.Sheets['Hoja1']
    const headers = {}
    const data = []
    Clasificador.destroy({truncate: true})
    let filaAux = 0
    let response = false
    let seccion = null
    let division = null
    let grupo = null
    let clase = null
    let tipo = null
    for (const z in worksheet) {
     //async.eachSeries(worksheet, function(z, cb) {
     //if (z[0] === '!') continue
     //parse out the column, row, and value
     console.log('z: ',z)
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
       //continue
     }
     if (!data[row]) data[row] = {}
     if (headers[col] === 'DESCRIPCIÓN') {
       data[row]['descripcion'] = value
     } else {
       data[row]['tipo'] = headers[col]
       data[row]['codigo'] = value
     }
     if (filaAux !== row) {
       persitirClasificador(Clasificador, data[filaAux])
       .then(response => {
         //console.log(response)
       })
       filaAux = row
     }
   })
  })
}

function persitirClasificador (pModelo, data) {
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
