/**
Archivo con los metodos necesarios para la asignacion de un administrador
introducido por parametro e inactivacion del administrador por defecto.
 */
const config = require(`../config/config`)()
const XLSX = require('xlsx')
const workbook = XLSX.readFile(`${__dirname}/CAEB_2011.xlsx`)
const sheetNameList = workbook.SheetNames
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, config.username,config.password,config.params)
const modelos = require('../model')(sequelize).models
const Clasificador = modelos.clasificador


//console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]))
//console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]))

// sheetNameList.forEach((y) => {
//   console.log(y)
  const worksheet = workbook.Sheets['Hoja1']
  const headers = {}
  const data = []
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
    //console.log(col)
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
    //data[row][headers[col]] = value
    //console.log(value)
    //console.log(headers[col])
    //console.log(data[row])
  }
  //drop those first two rows which are empty
  data.shift()
  data.shift()
  console.log(data)
  Clasificador.create(data)
  //console.log(headers)
//})
