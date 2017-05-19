actualizarClasificadores()

function actualizarClasificadores () {
  return new Promise((resolve, reject) => {
    const config = require(`../config/config`)()
    const Sequelize = require('sequelize')
    const sequelize = new Sequelize(config.database, config.username, config.password, config.params)
    const modelos = require('../model')(sequelize).models
    const Clasificador = modelos.clasificadores
    console.log('esto debe correr despues')
    let seccion_id = null
    let division_id = null
    let grupo_id = null
    let clase_id = null
    Clasificador.all()
    .then((response) => {
      console.log(response)
      if (response.length > 0) {
        response.map((item, x) => {
          if (item.dataValues.tipo === 'SECCIÓN') {
            seccion_id = item.dataValues.id
          } else if (item.dataValues.tipo === 'DIVISIÓN') {
            item.update({ip_padre: 1234567})
            division_id = item.dataValues.id
          } else if (item.dataValues.tipo === 'GRUPO') {
            grupo_id = item.dataValues.id
          } else if (item.dataValues.tipo === 'CLASE') {
            clase_id = item.dataValues.id
          } else if (item.dataValues.tipo === 'SUBCLASE') {
            clase_id = item.dataValues.id
          }
          console.log('seccion: ', seccion_id)
          console.log('division: ', division_id)
          console.log('grupo: ', grupo_id)
          console.log('clase: ', clase_id)
        })
      }

    })
    // console.log('ultimo: ')
    // pModelo.findAll({
    //   limit: 1,
    //   where: { tipo: 'CLASE' },
    //   order: [['id', 'DESC']]
    // })
    // .then((pRespuesta) => {
    //   dataAux = data
    //   console.log(pRespuesta)
    //   if (pRespuesta.length > 0) {
    //     dataAux['id_padre'] = pRespuesta[0].dataValues.id
    //   }
    // })
  })
}
