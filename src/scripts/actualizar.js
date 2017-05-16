/**
Archivo con los metodos necesarios para la asignacion de un administrador
introducido por parametro e inactivacion del administrador por defecto.
 */
const
  jwt = require('jwt-simple'),
  config = require(`../config/config`)(),
  util = require('../lib/util'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(config.database, config.username,config.password,config.params),
  modelos = require('../model')(sequelize).models,
  Usuario = modelos.usuario,
  datos = JSON.parse(process.env.npm_config_argv),
  usuario = datos.remain[0],
  fecha_inicio= datos.remain[1],
  fecha_fin = datos.remain[2],
  fecha = new Date(),
  fechaEnviar = `${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`;

console.log('usuario:',usuario);
console.log('fecha_inicio:',fecha_inicio);
console.log('fecha_fin:',fecha_fin);
Usuario.find({
  where: { usuario},
})
.then(pUsuario => {
  if(!pUsuario) throw new Error(`El Usuario ${usuario} no existe, verifique la información introducida.`);
  const token = jwt.encode({
    id_usuario: pUsuario.id_usuario,
    usuario: pUsuario.usuario,
    fecha_inicio,
    fecha_fin,
    _fecha_creacion: pUsuario._fecha_creacion,
  }, config.jwtSecret);
  pUsuario.update({token,fecha_fin,fecha_inicio})
  .then(pA => {
    console.log("\n Token: ", token);
  });
})
.catch(pError => {
  if(pError.name ){
    if(pError.name !== 'Error') console.log("Ha ocurrido un error al procesar su solicitud.");
    else console.error("\nError en el registro: ", pError.message);
  }
  else {
    console.log(pError);
  }
});
