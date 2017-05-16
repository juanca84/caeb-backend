/**
 * Modelo clasificador
 *
 **/

module.exports = (sequelize, DataType) => {
  const clasificador = sequelize.define('clasificadores',
    {
      id: {
        type: DataType.INTEGER,
        xlabel: 'Identificador',
      },
      codigo: {
        type: DataType.STRING(200),
        primaryKey: true,
        autoIncrement: true,
        xlabel: 'Código de Clasificador',
      },
      nombre: {
        type: DataType.STRING(200),
        allowNull: true,
        defaultValue: null,
        xlabel: 'Nombre de Clasificador',
      },
      tipo: {
        type: DataType.STRING(200),
        allowNull: true,
        defaultValue: null,
        xlabel: 'Tipo de Clasificador',
      },
      id_padre: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
        xlabel: 'Identificador del padre',
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      classMethods: {
        associate: models => {
          models.t_empresa.belongsTo(models.t_proyecto, { as: 'proyecto', foreignKey: 'id' })
        },
      },
    })
  return empresa
}
