/**
 * Modelo para Usuarios del sistema
 *
 **/
const crypto = require ('crypto')

module.exports = (sequelize, DataType) => {
  const clasificador = sequelize.define('clasificadores', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Identificador',
    },
    codigo: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      xlabel: 'Código clasificador',
    },
    descripcion: {
      type: DataType.STRING,
      allowNull: false,
      xlabel: 'Descripción clasificador',
    },
    tipo: {
      type: DataType.STRING,
      allowNull: false,
      xlabel: 'Tipo de clasificador',
    },
    id_padre: {
      type: DataType.INTEGER,
      allowNull: true,
      xlabel: 'Identificador del padre',
    },
  },{
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    freezeTableName: true,
    classMethods: {
      associate: models => {
        models.clasificadores.belongsTo(models.clasificadores, { as: 'clasificador', foreignKey: 'id_padre' })
      },
    },
  })
  return clasificador
}
