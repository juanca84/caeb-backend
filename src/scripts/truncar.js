/**
Archivo para truncar la tabla clasificadores
 */
const config = require(`../config/config`)()
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.database, config.username, config.password, config.params)
const modelos = require('../model')(sequelize).models
const Clasificador = modelos.clasificadores

Clasificador.destroy({truncate: true})
