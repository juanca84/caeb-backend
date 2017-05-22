module.exports = app => {
  const Clasificador = app.src.db.models.clasificadores
  const util = require('../../lib/util')

  app.get('/api/v1/clasificadores', (req, res) => {
    console.log(req.query)
    if (req.query.cod) {
      Clasificador.findOne({
        where: {
          codigo: req.query.cod
        }
      })
      .then(pClasificador => {
        if (pClasificador) {
          res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso', { total: pClasificador.length, datos: pClasificador }))
        } else {
          res.status(200).send(util.formatearMensaje('EXITO', 'No hay datos', { total: 0, datos: [] }))
        }
      })
      .catch(pError => {
        console.log('Revisando el Error', pError)
        res.status(412).send(util.formatearMensaje('ERROR', pError))
      })
    } else if (req.query.des) {
      Clasificador.findAll({
        where: ["descripcion LIKE ? AND tipo = 'SUBCLASE'", `%${req.query.des}%` ]
      })
      .then(pClasificadores => {
        if (pClasificadores) {

          obtenerPadres(Clasificador, pClasificadores[0].dataValues.codigo)
          .then((respuesta) => {
            console.log(respuesta)
          })

          //console.log(obtenerPadres (pClasificadores[0].dataValues.codigo))
          res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso', { total: pClasificadores.length, datos: pClasificadores }))
        } else {
          res.status(200).send(util.formatearMensaje('EXITO', 'No hay datos', { total: 0, datos: [] }))
        }
      })
      .catch(pError => {
        console.log('Revisando el Error', pError)
        res.status(412).send(util.formatearMensaje('ERROR', pError))
      })
    } else {
      Clasificador.findOne()
      .then(pClasificadores => {
        if (pClasificadores.length === 0) {
          res.status(200).send(util.formatearMensaje('EXITO', 'No hay datos', { total: 0, datos: [] }))
        } else {
          res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso', { total: pClasificadores.length, datos: pClasificadores.dataValues }))
        }
      })
      .catch(pError => {
        console.log('Revisando el Error', pError)
        res.status(412).send(util.formatearMensaje('ERROR', pError))
      })
    }
  })

  app.get('/api/v1/clasificadores/cantidad', (req, res) => {
    Clasificador.count()
    .then(pResp => {
      res.status(200).send(util.formatearMensaje('EXITO', 'Obtención de datos exitoso', pResp))
    })
    .catch(pError => {
      res.status(412).send(util.formatearMensaje('ERROR', pError))
    })
  })
}
function obtenerPadres (pModel, pCodSubClase) {
  const util = require('../../lib/util')
  return new Promise((resolve, reject) => {
    let subclase = null
    let clase = null
    let grupo = null
    pModel.findOne(
      {
        where: {
          codigo: pCodSubClase,
          tipo: 'SUBCLASE'
        }
      }
    )
    .then(pSubClase => {
      subclase = pSubClase.dataValues
    })
    .then(pSubClase => {
      pModel.findOne(
        {
          where: {
            codigo: subclase.codigo_padre,
            tipo: 'CLASE'
          }
        }
      )
      .then(pClase => {
        clase = pClase.dataValues
      })
      .then(() => {
        pModel.findOne(
          {
            where: {
              codigo: clase.codigo_padre,
              tipo: 'GRUPO'
            }
          }
        )
        .then(pGrupo => {
          grupo = pGrupo.dataValues
          console.log(grupo)
        })
        .then(() => {
          return resolve({
            grupo: grupo,
            clase: clase,
            subclase: subclase
          })
        })
        .catch(pError => {
          console.log('Revisando el Error', pError)
        })
      })
      .catch(pError => {
        console.log('Revisando el Error', pError)
        //res.status(412).send(util.formatearMensaje('ERROR', pError))
      })
    })
    .catch(pError => {
      console.log('Revisando el Error', pError)
      //res.status(412).send(util.formatearMensaje('ERROR', pError))
    })
  })
}
