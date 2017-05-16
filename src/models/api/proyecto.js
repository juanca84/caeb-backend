/**
 * Modelo para Proyectos del sistema
 *
 **/
const crypto = require ("crypto");


module.exports = (sequelize, DataType) => {
    const proyecto = sequelize.define("t_proyecto", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            unique: true,
            allowNull: false,
            autoIncrement: true,
            xlabel: 'id',
        },
        convenio: {
            type: DataType.STRING(45),
            defaultValue:null,
            xlabel: 'convenio',
        },
        nombre_proyecto: {
            type: DataType.STRING(150),
            defaultValue:null,
            xlabel: 'nombre_proyecto',
        },
        departamento: {
            type: DataType.STRING(20),
            defaultValue:null,
            xlabel: 'departamento',
        },
        provincia: {
            type: DataType.STRING(100),
            defaultValue:null,
            xlabel: 'provincia',
        },
        municipio: {
            type: DataType.STRING(100),
            defaultValue:null,
            xlabel: 'municipio',
        },
        sisin: {
            type: DataType.STRING(20),
            defaultValue:null,
            xlabel: 'sisin',
        },
        tipo: {
            type: DataType.STRING(100),
            defaultValue:null,
            xlabel: 'tipo',
        },
        sector: {
            type: DataType.STRING(100),
            defaultValue:null,
            xlabel: 'sector',
        },
        longitud_x: {
            type: DataType.FLOAT,
            defaultValue:null,
            xlabel: 'longitud_x',
        },
        latitud_y: {
            type: DataType.FLOAT,
            defaultValue:null,
            xlabel: 'longitud_y',
        },
        monto_total: {
            type: DataType.DECIMAL(15,2),
            defaultValue:null,
            xlabel: 'monto_total',
        },
        monto_total_fuente: {
            type: DataType.DECIMAL(15,2),
            defaultValue:null,
            xlabel: 'monto_total_fuente',
        },
        monto_total_apl: {
            type: DataType.DECIMAL(15,2),
            defaultValue:null,
            xlabel: 'monto_total_apl',
        },
        estado: {
            type: DataType.STRING(15),
            defaultValue:null,
            xlabel: 'estado',
        },
        descripcion: {
            type: DataType.STRING(800),
            defaultValue:null,
            xlabel: 'descripcion',
        },
        ambiental: {
            type: DataType.TEXT,
            xlabel: 'ambiental',
        },
        social: {
            type: DataType.STRING(1000),
            defaultValue:null,
            xlabel: 'social',
        },
    },{
        // createdAt: '_fecha_creacion',
        // updatedAt: '_fecha_modificacion',
        timestamps: false,
        freezeTableName: true,
        classMethods: {
          associate: models => {
            models.t_proyecto.hasOne(models.t_empresa, {as:'empresa', foreignKey:'id'});
          },
        },
    });
    return proyecto;
};
