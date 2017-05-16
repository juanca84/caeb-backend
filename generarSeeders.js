/**
 Archivo que genera seeders basado en los datos de la base de datos.
 */
const
  fs = require('fs'),
  path = require('path'),
  basename = path.basename(module.filename),
  route = {},
  dirSemillas = "./src/seeders/respaldo/",
  dirModels =   `${__dirname}/src/models`,
  pg = require('pg'),
  config = require(`${__dirname}/src/config/config`)(),
  configDB = `${config.params.dialect}://${config.username}:${config.password}@${config.params.host}:${config.params.port}/${config.database}`,
  pgCliente=new pg.Client(configDB);

console.log(".::::: Iniciando la generacion de semillas basado en la base de datos :::::.");

// Inicia la conexion con la base de datos.
pgCliente.connect();

// Ejecuta la consulta, la consulta obtiene todas las tablas.
ejecutarConsulta("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
.then( pRespuesta => {
    console.log("Tablas obtenidas correctamente.");
  // Itera las tablas obtenidas.
  return pRespuesta.forEach((pItem,pIndice) => {

    // Consulta a ejecutar para cada tabla.
    const consulta = `SELECT * FROM ${pItem.table_name}`;

    // Ejecucion de la consulta.
    return ejecutarConsulta(consulta)
    .then(pRespuestaItem => {

      // Obtiene la plantilla del seeder con los datos obtenidos de la consulta.
      const datos=plantilla(pItem.table_name,pRespuestaItem);
      if (datos!=='') {
        // Crea el archivo en la ruta especificada.
        return escribir(dirSemillas,datos,pItem.table_name,false)
        .then(pRespuestaEscribir => {
          console.log(`${pRespuestaEscribir} -> OK`);
          if(pIndice === pRespuesta.length-1){
            console.log("Creacion de los seeders con datos actuales de la DB FINALIZADO!!!");
            // return true;
            pgCliente.end();
          }
        })
        .catch(pErrorEscribir => {
          console.log("Error en la escritura del archivo", pErrorEscribir);
        });
      }else {
        if(pIndice===pRespuesta.length-1){
          console.log("Creacion de los seeders con datos actuales de la DB FINALIZADO!!!");
          // return true;
          pgCliente.end();
        }
      }
    })
    .catch(pErrorItem => {
      console.log("Error en la obtencio de los datos de la tabla");
    });
  });

})
// Control de error para la busqueda de tablas.
.catch(pError => {
  console.log("Error en la obtencion de las tablas", pError);
});

/**
 Funcion que retorna el formato de la plantilla para el seeder.
 @param {pNombreTabla} Texto Nombre de la tabla.
 @param {pDatos} JSON Objeto que contiene registros obtenidos desde la tabla.
 @return Retorna una cadena de texto.
 */
function plantilla(pNombreTabla, pDatos){

  const
    obj = JSON.stringify(pDatos),
    plantilla = ` 'use strict'
  module.exports = {
    up: function(queryInterface, Sequelize){

      return queryInterface.bulkInsert('${pNombreTabla}',
        ${obj}
      );
    },

    down: function(queryInterface, Sequelize){

    }
  }
  `;
  return (obj !== "[]")? plantilla : '';
}

/**
 Funcion que ejecuta una promesa.
 @param {pConsulta} Texto Cadena que contiene la consulta a ejecutar.
 @return retorna una promesa.
 */
function  ejecutarConsulta(pConsulta){

  return new Promise((resolve,reject) => {
    // Instancia una consulta del tipo cliente.
    const query=pgCliente.query(pConsulta);

    // Durante la ejecucion de la consulta,
    query.on("row", (pFila,pResultado) => {
        pResultado.addRow(pFila);
    });

    query.on("end", pResultado => {
      resolve(pResultado.rows);
    });

  });
}

/**
 Funcion que realiza la escritura de un archivo.
 @param {pRuta} Texto Cadena que contiene la ruta destino del archivo.
 @param {pData} Data Datos del archivo.
 @param {pNombre} Texto Nombre del archivo.
 @param {pSobreEscribir} Boleano bandera que se usa para sobreescribir un archivo.
 */
function escribir(pRuta, pData,pNombre, pSobreEscribir){

  // Declara e inicializa variables locales.
  let rutaOrigen=null,indiceBarra=null,dir=null,temp=null;
  const indiceBarraFin=null;

  // Instancia una nueva promesa, con sus dos metodos.
  return new Promise((resolve,reject) => {

    // Procesa parte inicial de una ruta del tipo ./ruta/...
    indiceBarra=pRuta.indexOf('/');
    temp=pRuta.substring(0,indiceBarra+1);
    pRuta=pRuta.substring(indiceBarra+1,pRuta.length);
    indiceBarra=pRuta.indexOf('/');
    dir=temp+pRuta.substring(0,indiceBarra);

    // Realiza la iteracion mientras la longitud de la ruta sea mayor a 0 y no exista '/'.
    while (pRuta.length>0 && indiceBarra!==-1) {

      // Si no existe la ruta la crea.
      if(!fs.existsSync(dir)) fs.mkdirSync(dir);

      // Actualiza los datos de las variables.
      rutaOrigen=dir;
      pRuta=pRuta.substring(indiceBarra+1,pRuta.length);
      indiceBarra=pRuta.indexOf('/');
      dir=`${rutaOrigen}/${pRuta.substring(0,indiceBarra)}`;
    }

    // Si la longitud de la ruta es mayor a 0.
    if(pRuta.length>0){
      dir+=pRuta;
      if(!fs.existsSync(dir)) fs.mkdirSync(dir);
    }

    const fecha=new Date();
    const tiempo=`${fecha.getFullYear()}${(fecha.getMonth()+1)}${fecha.getDay()}${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}-${pNombre}.js`;
    // const tiempo=fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDay()+""+fecha.getHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+"-"+pNombre+".js"

    // Arma la ruta completa, incluido el nombre del archivo.
    const rutaArchivo=dir+tiempo;

    // Verifica si existe el parametro para sobreescribir el archivo, crea o sobre-escribe el archivo.
    if(pSobreEscribir && pSobreEscribir==true)
      fs.writeFile(rutaArchivo, pData, {flag: 'w+'},(pErrorEscritura) =>  {pErrorEscritura? reject(pErrorEscritura) : resolve(pNombre)});

    else
      !fs.existsSync(rutaArchivo)?
      fs.writeFile(rutaArchivo, pData, {flag: 'w+'},pErrorEscritura =>  {pErrorEscritura?  reject(pErrorEscritura) :  resolve(pNombre)}) :
      reject("El archivo ya existe.");

  });
}
