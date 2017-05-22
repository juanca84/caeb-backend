/**
Archivo con los metodos necesarios para la asignacion de un administrador
introducido por parametro e inactivacion del administrador por defecto.
 */
const jwt = require('jwt-simple')
const config = require(`../config/config`)()
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, config.username, config.password, config.params)
const modelos = require('../model')(sequelize).models
const Usuario = modelos.usuario
const datos = JSON.parse(process.env.npm_config_argv)
const usuario = datos.remain[0]
const fechaInicio = datos.remain[1]
const fechaFin = datos.remain[2]

console.log('usuario:', usuario)
console.log('fecha_inicio:', fechaInicio)
console.log('fecha_fin:', fechaFin)

Usuario.find({
  where: { usuario }
})
.then(pResp => {
  if (pResp) throw new Error(`El usuario ${usuario} ya se encuentra registrado. Verifique la información introducida.`)
  return Usuario.create({ usuario, fechaInicio, fechaFin })
  .then(pUsuario => {
    const cifrar = {
      id_usuario: pUsuario.id_usuario,
      usuario: pUsuario.usuario,
      fecha_inicio: pUsuario.fechaInicio,
      fecha_fin: pUsuario.fechaFin,
      _fecha_creacion: pUsuario._fecha_creacion
    }
    const token = jwt.encode(cifrar, config.jwtSecret)
    pUsuario.update({ token })
    .then(a => {
      console.info('\n Token: ', token)
      return
    })
  })
})
.catch(pError => {
  if (pError.name) {
    if (pError.name !== 'Error') console.log('Ha ocurrido un error al procesar su solicitud.')
    else console.error('\nError en el registro: ', pError.message)
  } else {
    console.log(pError)
  }
})
