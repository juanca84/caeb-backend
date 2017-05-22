/**
 * Modelo de los clasificadores del sistema
 *
 **/

module.exports = (sequelize, DataType) => {
  const clasificador = sequelize.define('clasificadores', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Identificador'
    },
    codigo: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
      xlabel: 'Código clasificador'
    },
    descripcion: {
      type: DataType.STRING,
      allowNull: false,
      xlabel: 'Descripción clasificador'
    },
    tipo: {
      type: DataType.STRING,
      allowNull: false,
      xlabel: 'Tipo de clasificador'
    },
    codigo_padre: {
      type: DataType.INTEGER,
      allowNull: true,
      xlabel: 'Identificador del padre'
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: models => {
        models.clasificadores.belongsTo(models.clasificadores, { as: 'clasificadores', foreignKey: 'codigo_padre' })
      }
    }
  })
  return clasificador
}
