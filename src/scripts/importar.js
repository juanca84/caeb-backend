/**
Archivo con los metodos necesarios para la asignacion de un administrador
introducido por parametro e inactivacion del administrador por defecto.
 */
importarClasificadores()

function importarClasificadores () {
 return new Promise((resolve, reject) => {
   const config = require(`../config/config`)()
   const XLSX = require('xlsx')
   const workbook = XLSX.readFile(`${__dirname}/CAEB_2011.xlsx`)
   const Sequelize = require('sequelize')
   const sequelize = new Sequelize(config.database, config.username, config.password, config.params)
   const modelos = require('../model')(sequelize).models
   const Clasificador = modelos.clasificadores
   const worksheet = workbook.Sheets['Hoja1']
   const headers = {}
   const data = []
   let filaAux = 0
   let response = false
   let contadorRegistro = 0
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
       response = Clasificador.create(data[filaAux])
                              .then((user) => {
                                return true
                              })
                              .catch(pError => {
                                if (pError.name) {
                                 //  if (pError.name !== 'Error') console.log('Ha ocurrido un error al procesar su solicitud.')
                                 //  else
                                  //console.error('\nError en el registro: ', pError.message)
                                } else {
                                  //console.log(pError)
                                }
                                return false
                              })
       console.log (response)
       if (response === true ) console.log('Exito')
       else console.log('Super Fail')
       filaAux = row
     }
   }
   return resolve(true)
 })
}
