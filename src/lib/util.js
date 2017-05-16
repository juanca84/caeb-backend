const
  http = require('http'),
  path = require("path"),
  fs = require('fs');
// const hash = require('object-hash');
// const html_pdf = require('html-pdf');
// const ejs = require("ejs");
// const moment = require('moment');
// const Uuid = require('uuid');
console.log("archivo util");





const funcionCabeceras = (objs) => {
  const cabs = [];
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    for (const key in obj) {
      const attrName = key;
      const attrValue = obj[key];
      //Ocultamos el atributo URL, para no ser mostrado en la vista EJS
      if (attrName === "url" ) {
      } else {
        cabs.push(attrName);
      }
    }
  }
  return cabs;
};


/**
Funcion que asigna un formato a los mensajes de respuesta para una peticion http.
@param {estado} Estado de la peticion http.
@param {mensaje} Mensaje a retornar.
@param {datos} Datos obtenidos o generados para ser retornados.
@return Retorna un {json} con los datos en el formato establecido.
*/
const formatearMensaje = (tipoMensaje, mensaje, datos,token) => {

  // Validacion para el parametro mensaje.
  let mensajeFinal=mensaje;

  // Si el parametro mensaje es un objeto, actualiza el valor del mensaje final.
  if(mensaje.message) mensajeFinal=mensaje.message;

  if(process.env.NODE_ENV =='production'){
    if(mensaje.name ){
      if(mensaje.name !== 'Error'){
        mensajeFinal="Ha ocurrido un error al procesar su solicitud.";
      }
      else {
        console.log("El nombre del mensaje es ERROR", mensaje);
      }
    }
  }

  // Declara el objeto respuesta.
  const respuesta={
    mensaje: mensajeFinal,
    tipoMensaje,
    datos,
  };

  // Esto solo es necesario y se aplica, en la operacion de autenticación.
  if(token)respuesta.token= token;

  return respuesta;
};

/**
 Funcion que ejecuta una promesa.
 @param {pConsulta} Texto Cadena que contiene la consulta a ejecutar.
 @return retorna una promesa.
 */
function  ejecutarConsulta(pConsulta, pgCliente){

  return new Promise((resolve,reject) => {
    // Instancia una consulta del tipo cliente.
    const query=pgCliente.query(pConsulta);

    // Durante la ejecucion de la consulta,
    query.on("row", (pFila,pResultado) => {
      pResultado.addRow(pFila);
    });

    query.on("end", pResultado => {

      if(pResultado.command == 'UPDATE')
        resolve((pResultado.rowCount ==1)?true:false);
      else if(pResultado.command == 'INSERT')
        resolve((pResultado.rowCount ==1)?true:false);
      else
        resolve(pResultado.rows);
    });
  });
}


module.exports = {
  funcionCabeceras,
  formatearMensaje,
  ejecutarConsulta,
};
