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
        if (pClasificadores.length > 0) {
          obtenerPadres(Clasificador, pClasificadores[0].dataValues.codigo)
          .then((respuesta) => {
            res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso', { total: pClasificadores.length, datos: respuesta }))
          })
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

//functions iterarResultados (p)

function obtenerPadres (pModel, pCodSubClase) {
  return new Promise((resolve, reject) => {
    let subclase = null
    let clase = null
    let grupo = null
    let division = null
    let seccion = null
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
      // {
      //   codigo: pSubClase.dataValues.codigo,
      //   descripcion: pSubClase.dataValues.descripcion
      // }
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
          // {
          //   codigo: pClase.dataValues.codigo,
          //   descripcion: pClase.dataValues.descripcion
          // }
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
          // {
          //   codigo: pGrupo.dataValues.codigo,
          //   descripcion: pGrupo.dataValues.descripcion
          // }
        })
        .then(() => {
          pModel.findOne(
            {
              where: {
                codigo: grupo.codigo_padre,
                tipo: 'DIVISION'
              }
            }
          )
          .then(pDivision => {
            division = pDivision.dataValues
            // {
            //   codigo: pDivision.dataValues.codigo,
            //   descripcion: pDivision.dataValues.descripcion
            // }
          })
          .then(() => {
            pModel.findOne(
              {
                where: {
                  codigo: division.codigo_padre,
                  tipo: 'SECCION'
                }
              }
            )
            .then(pSeccion => {
              seccion = pSeccion.dataValues
              // {
              //   codigo: pSeccion.dataValues.codigo,
              //   descripcion: pSeccion.dataValues.descripcion
              // }
            })
            .then(() => {
              return resolve({
                seccion: {
                  codigo: seccion.codigo,
                  descripcion: seccion.descripcion
                },
                division: {
                  codigo: division.codigo,
                  descripcion: division.descripcion
                },
                grupo: {
                  codigo: grupo.codigo,
                  descripcion: grupo.descripcion
                },
                clase: {
                  codigo: clase.codigo,
                  descripcion: clase.descripcion
                },
                subclase: {
                  codigo: subclase.codigo,
                  descripcion: subclase.descripcion
                }
              })
            })
            .catch(pError => {
              console.log('Revisando el Error', pError)
            })
          })
          .catch(pError => {
            console.log('Revisando el Error', pError)
          })
        })
        .catch(pError => {
          console.log('Revisando el Error', pError)
        })
      })
      .catch(pError => {
        console.log('Revisando el Error', pError)
      })
    })
    .catch(pError => {
      console.log('Revisando el Error', pError)
    })
  })
}
