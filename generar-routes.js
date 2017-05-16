const
  fs = require('fs'),
  path = require('path'),
  basename = path.basename(module.filename);
  route = {},
  dirRoutes = `${__dirname}/src/routes`,
  dirModels =   `${__dirname}/src/models`,
  dirTestUnitario = `${__dirname}/test/unitario`;
// console.log("basename", basename);
fs.readdirSync(dirModels).filter((dirCompleto) =>
  (dirCompleto.indexOf('.') !== 0) && (dirCompleto !== basename)
)
.forEach((dirCompleto) => {

  const subDirModels = `${dirModels}/${dirCompleto}`;

  if (fs.statSync(subDirModels).isDirectory()){

    console.log(subDirModels);

    const subDirRoutes = `${dirRoutes}/${dirCompleto}`;
    const subDirTestUnitario = `${dirTestUnitario}/${dirCompleto}`;
    if (!fs.existsSync(subDirRoutes))
      fs.mkdirSync(subDirRoutes);
    if (!fs.existsSync(subDirTestUnitario))
      fs.mkdirSync(subDirTestUnitario);

    fs.readdirSync(subDirModels).filter((fileCompleto) =>
      (fileCompleto.indexOf('.') !== 0) && (fileCompleto !== basename)
    ).forEach((fileCompleto) => {

      if (fileCompleto.slice(-3) !== '.js')
        return

      const file = fileCompleto.substr(0,fileCompleto.length-3);
      // console.log('file', file);

      fs.exists(`${subDirRoutes}/${file}RT.js`, (exists) => {
        if(!exists){
          console.log(file.concat('RT.js -- NO EXISTE'));
          const contenido = `import sequelizeHandlers from "sequelize-handlers";
import sequelizeFormly from "sequelize-formly";

module.exports = app => {
  const ${file} = app.src.db.models.${file};

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Post ${file}
  @api {post} /api/v1/${dirCompleto}/${file} Crear ${file}

  @apiDescription Post para ${file}

  @apiParam (Peticion) {Texto} campo Descripción del campo
  @apiParam (Peticion) {Numerico} _usuario_creacion Identificador del usuario que esta creando

  @apiParamExample {json} Ejemplo para enviar:
  {
    "campo": "xxx",
    "_usuario_creacion": "1"
  }

  @apiSuccess (Respuesta) {Numerico} id_${file} Identificador de ${file}
  @apiSuccess (Respuesta) {Numerico} _usuario_creacion Identificador del usuario creador
  @apiSuccess (Respuesta) {Numerico} _usuario_modificacion Identificador del usuario modificador
  @apiSuccess (Respuesta) {FechaHora} _fecha_creacion Fecha de creación de ${file}
  @apiSuccess (Respuesta) {FechaHora} _fecha_modificacion Fecha de modificación de ${file}

  @apiSuccessExample {json} Respuesta del Ejemplo:
  HTTP/1.1 200 OK
  {
    "tipoMensaje":"EXITO",
    "mensaje":"La operación se realizó correctamente.",
    "datos":{
      "id_${file}": "1",
      "campo": "xxx",
      "_usuario_creacion": "1",
      "_fecha_creacion": " << fecha y hora actual >> ",
      "_fecha_modificacion": " << fecha y hora actual >> "
    }
  }

  @apiSampleRequest off
*/
  app.post('/api/v1/${dirCompleto}/${file}', sequelizeHandlers.create(${file}));

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Get ${file}/:id
  @api {get} /api/v1/${dirCompleto}/${file}/:id Obtiene un/a ${file}

  @apiDescription Get ${file}, obtiene un/a ${file}

  @apiParam (Parametro) {Numerico} id Identificador de ${file} que se quiere obtener

  @apiSuccess (Respuesta) {Numerico} id_${file} Identificador de ${file}
  @apiSuccess (Respuesta) {Numerico} _usuario_creacion Identificador del usuario creador
  @apiSuccess (Respuesta) {Numerico} _usuario_modificacion Identificador del usuario modificador
  @apiSuccess (Respuesta) {FechaHora} _fecha_creacion Fecha de creación de ${file}
  @apiSuccess (Respuesta) {FechaHora} _fecha_modificacion Fecha de modificación de ${file}

  @apiSuccessExample {json} Respuesta:
  HTTP/1.1 200 OK
  {
    "tipoMensaje": "EXITO",
    "mensaje": "La operación se realizó correctamente.",
    "datos": {
      "id_${file}": "1",
      "campo": "xxx",
      "_usuario_creacion": "1",
      "_fecha_creacion": " << fecha y hora >> ",
      "_fecha_modificacion": " << fecha y hora >> "
    }

  }
*/
  app.get('/api/v1/${dirCompleto}/${file}/:id', sequelizeHandlers.get(${file}));

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Get ${file}
  @api {get} /api/v1/${dirCompleto}/${file}/ Obtiene la lista completa de ${file}

  @apiDescription Get ${file}

  @apiSuccessExample {json} Respuesta:
  HTTP/1.1 200 OK
  {
    "tipoMensaje": "EXITO",
    "mensaje": "La operación se realizó correctamente.",
    "datos": {
      "total": 21,
      "resultado":[
        {
          "id_${file}": "1",
          "campo": "xxx",
          "_usuario_creacion": "1",
          "_fecha_creacion": " << fecha y hora >> ",
          "_fecha_modificacion": " << fecha y hora >> "
        },
        {
          "id_${file}": "2",
          "campo": "zzz",
          "_usuario_creacion": "1",
          "_fecha_creacion": " << fecha y hora >> ",
          "_fecha_modificacion": " << fecha y hora >> "
        },
        ...
      ]

  }

*/

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Get ${file}/?order=&limit=&page=&filter=
  @api {get} /api/v1/${dirCompleto}/${file}/?order=&limit=&page=&filter= Obtiene la lista paginada de ${file}

  @apiDescription Get ${file}

  @apiParam (Query) {Texto} order Campo por el cual se ordenará el resultado
  @apiParam (Query) {Numerico} limit Cantidad de resultados a obtener
  @apiParam (Query) {Numerico} page Número de página de resultados
  @apiParam (Query) {Texto} filter Texto a buscar en los registros

  @apiSuccess (Respuesta) {Texto} tipoMensaje Tipo del mensaje de respuesta.
  @apiSuccess (Respuesta) {Texto} mensaje Mensaje de respuesta.
  @apiSuccess (Respuesta) {Objeto} datos Objeto de con los datos de respuesta
  @apiSuccess (Respuesta) {Numerico} total Numero de objetos categoria
  @apiSuccess (Respuesta) {Array} resultado Array de objetos categoria


  @apiSuccessExample {json} Respuesta:
    HTTP/1.1 200 OK
    {
      "tipoMensaje": "EXITO",
      "mensaje": "La operación se realizó correctamente.",
      "datos": {
        "total": 21,
        "resultado":[
          {
            "id_${file}": 1,
            "codigo": "CI",
            "descripcion": "Carnet de identidad",
            "estado": "ACTIVO",
            "_usuario_creacion": 5,
            "_usuario_modificacion": null,
            "_fecha_creacion": "2016-08-29T13:59:22.788Z",
            "_fecha_modificacion": "2016-08-29T13:59:22.788Z"
          },
          {
            "id_${file}": 2,
            "codigo": "PAS",
            "descripcion": "Pasaporte",
            "estado": "ACTIVO",
            "_usuario_creacion": 5,
            "_usuario_modificacion": null,
            "_fecha_creacion": "2016-08-29T14:02:19.060Z",
            "_fecha_modificacion": "2016-08-29T14:02:19.060Z"
          },
          ...
        ]
    }

*/
  app.get('/api/v1/${dirCompleto}/${file}', sequelizeHandlers.query(${file}));

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Delete ${file}
  @api {delete} /api/v1/${dirCompleto}/${file}/:id Elimina un/a ${file}

  @apiDescription Delete ${file}

  @apiParam (Parametro) {Numerico} id Identificador de ${file} que se quiere eliminar

  @apiSuccessExample {json} Respuesta:
      HTTP/1.1 200 OK
    {

    }
*/
  app.delete('/api/v1/${dirCompleto}/${file}/:id', sequelizeHandlers.remove(${file}));

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Put ${file}
  @api {put} /api/v1/${dirCompleto}/${file}/:id Actualiza un/a ${file}

  @apiDescription Put ${file}

  @apiParam (Parametro) {Numerico} id Identificador de ${file} que se quiere actualizar

  @apiParam (Peticion) {Texto} campo Decripción del campo

  @apiParamExample {json} Ejemplo para enviar:
  {
    "campo": "yyy",
  }

  @apiSuccess (Respuesta) {Numerico} id_${file} Identificador de ${file}
  @apiSuccess (Respuesta) {Numerico} _usuario_creacion Identificador del usuario creador
  @apiSuccess (Respuesta) {Numerico} _usuario_modificacion Identificador del usuario modificador
  @apiSuccess (Respuesta) {FechaHora} _fecha_creacion Fecha de creacion de ${file}
  @apiSuccess (Respuesta) {FechaHora} _fecha_modificacion Fecha de modificacion de ${file}

  @apiSuccessExample {json} Respuesta del Ejemplo:
  HTTP/1.1 200 OK
  {
    "tipoMensaje": "EXITO",
    "mensaje": "La operación se realizó correctamente.",
    "datos":{
      "id_${file}": "1",
      "campo": "yyy",
      "_usuario_creacion": "1",
      "_fecha_creacion": " << fecha y hora >>",
      "_fecha_modificacion": " << fecha y hora actual >> "
    }

  }

  @apiSampleRequest off
*/
  app.put('/api/v1/${dirCompleto}/${file}/:id', sequelizeHandlers.update(${file}));

/**
  @apiVersion 1.0.0
  @apiGroup ${dirCompleto} ${file}
  @apiName Options ${file}
  @api {options} /api/v1/${dirCompleto}/${file} Extrae formly de ${file}

  @apiDescription Options de ${file}

  @apiSuccess (Respuesta) {Texto} key Llave para el campo
  @apiSuccess (Respuesta) {Texto} type Tipo de etiqueta este puede ser input, select, datepicker, etc
  @apiSuccess (Respuesta) {Objeto} templateOptions Objeto de opciones para la etiqueta, el cual varia de acuerdo el tipo de etiqueta

  @apiSuccessExample {json} Respuesta:
  HTTP/1.1 200 OK
  [
    {
      "key": "id_${file}",
      "type": "input",
      "templateOptions": {
        "type": "number",
        "label": "Id ${file}",
        "required": true
      },
    },
    {
      "key": "campo",
      "type": "input",
      "templateOptions": {
        "type": "text",
        "label": "Campo",
        "required": true
      }
    }
  ]

  @apiSampleRequest off
*/
  app.options('/api/v1/${dirCompleto}/${file}', sequelizeFormly.formly(${file}, app.src.db.models));
};`;

          const dirRoutesFile = `${subDirRoutes}/${file}RT.js`;
          fs.writeFile(dirRoutesFile, contenido, { flag: 'wx' }, (err) => {
              if (err) throw err;
              console.log(`Archivo Route ${dirCompleto}/${file} generado!`);
          });

        }

      });

      fs.exists(`${subDirTestUnitario}/${file}.uni.js`, (exists) => {
        if(!exists){
          const contenidoTest = `console.log("ejecucion test ${file}")
describe("Ruta: ejemplo de consumo ${file} normal", () => {
  var id_${file} = null;
  describe("GET /", () => {
    it("Test operacion GET ${file}", done => {
      request.get("/api/v1/${dirCompleto}/${file}/")
      .expect(200)
      .end((err, res) => {
        console.log("err->",err);
        // console.log("res.body->",res.body);
        const expected = "CODIGO";
        expect(res.body.datos.resultado[0].codigo).to.eql(expected);
        done(err);
        });
    });
  });
  describe("POST /", () => {
    it("Test operacion POST ${file}", done => {
      request.post("/api/v1/${dirCompleto}/${file}/")
      .expect(201)
      .type('json')
      //TODO: se debe cambiar el json conforme a los campos de la tabla testeada
      .send('{"nombre": "TEST_INSERT", "_usuario_creacion": "1"}')
      .end((err, res) => {
        const expected = "TEST_INSERT";
        console.log("err->", err);
        // console.log("res.body->",res.body);
        id_${file} = res.body.datos.id_${file};
        expect(res.body.datos.descripcion).to.eql(expected);
        done(err);
        });
    });
  });
  describe("PUT /", () => {
    it("Test operacion PUT ${file}", done => {
      request.put("/api/v1/${dirCompleto}/${file}/"+id_${file})
      .type('json')
      //TODO: se debe cambiar el json conforme a los campos de la tabla testeada
      .send('{"nombre": "TEST_UPDATE", "_usuario_modificacion": "1"}')
      .expect(200)
      .end((err, res) => {
        const expected = "TEST_UPDATE";
        console.log("err->", err);
        // console.log("res.body->",res.body);
        expect(res.body.datos.descripcion).to.eql(expected);
        done(err);
        });
    });
  });
  describe("DELETE /", () => {
    it("Test operacion DELETE ${file}", done => {
      request.delete("/api/v1/${dirCompleto}/${file}/"+id_${file})
      .expect(204)
      .end((err, res) => {
        const expected = {};
        console.log("err->", err);
        // console.log("res.body->",res.body);
        expect(res.body).to.eql(expected);
        done(err);
        });
    });
  });
});
`;

          const dirRoutesFileTest= `${subDirTestUnitario}/${file}.uni.js`;
          fs.writeFile(dirRoutesFileTest, contenidoTest, { flag: 'wx' }, (err) => {
              if (err) throw err;
              console.log(`Archivo Test ${dirCompleto}/${file} generado!`);
          });
        }

      });



    });
  }



});
