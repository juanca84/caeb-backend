/**
 * Modelo para Usuarios del sistema
 *
 **/
const crypto = require ("crypto");


module.exports = (sequelize, DataType) => {
    const usuario = sequelize.define("usuario", {
        id_usuario: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            xlabel: 'ID',
        },
        usuario: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
            xlabel: 'Nombre de usuario',
        },
        fecha_inicio: {
            type: DataType.STRING,
            allowNull: true,
            xlabel: 'Fecha de inicio',
        },
        fecha_fin: {
            type: DataType.STRING,
            allowNull: true,
            xlabel: 'Fecha fin',
        },
        token: {
            type: DataType.TEXT,
            xlabel: 'token',
        },
        estado: {
            type: DataType.ENUM('ACTIVO', 'INACTIVO'),
            defaultValue: 'ACTIVO',
            xlabel: 'Estado',
        },
    },{
        createdAt: '_fecha_creacion',
        updatedAt: '_fecha_modificacion',
        freezeTableName: true,
        classMethods: {

        },
    });
    return usuario;
};
