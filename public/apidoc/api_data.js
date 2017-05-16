define({ "api": [
  {
    "version": "1.0.0",
    "group": "proyecto",
    "name": "Get_cantidad",
    "type": "get",
    "url": "/api/v1/proyectos/cantidad",
    "title": "Obtiene el número total de proyectos.",
    "description": "<p>Get para proyecto, obtiene la cantidad de proyectos existentes</p>",
    "success": {
      "examples": [
        {
          "title": "Respuesta :",
          "content": "HTTP/1.1 200 OK\n{\n  \"tipoMensaje\": \"EXITO\",\n  \"mensaje\": \"Obtencion de datos exitoso\",\n  \"datos\": 0\n}",
          "type": "Array"
        }
      ]
    },
    "filename": "src/routes/api/proyectoRT.js",
    "groupTitle": "proyecto"
  },
  {
    "version": "1.0.0",
    "group": "proyecto",
    "name": "Get_todos",
    "type": "get",
    "url": "/api/v1/proyectos?page=0&limit=10",
    "title": "Obtiene listado de proyectos con su empresa.",
    "description": "<p>Get para proyecto, obtiene todos los datos del modelo proyecto, con su empresa</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Texto",
            "optional": false,
            "field": "order",
            "description": "<p>Campo por el cual se ordenara el resultado</p>"
          },
          {
            "group": "Query",
            "type": "Numerico",
            "optional": false,
            "field": "limit",
            "description": "<p>Cantidad de resultados a obtener</p>"
          },
          {
            "group": "Query",
            "type": "Numerico",
            "optional": false,
            "field": "page",
            "description": "<p>Número de página de resultados</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Respuesta :",
          "content": "HTTP/1.1 200 OK\n{\n  \"tipoMensaje\": \"EXITO\",\n  \"mensaje\": \"Obtencion de datos exitoso\",\n  \"datos\": [\n    {\n      \"id\": 1,\n      \"convenio\": \"a\",\n      \"nombre_proyecto\": \"Proyecto A\",\n      \"departamento\": \"La Paz\",\n      \"provincia\": \"Murillo\",\n      \"municipio\": \"Nuestra señora de la paz\",\n      \"sisin\": \"sisin\",\n      \"tipo\": \"ESTRATEGICO\",\n      \"sector\": \"Salud\",\n      \"longitud_x\": -68.15,\n      \"latitud_y\": -16.5,\n      \"monto_total\": \"50000.00\",\n      \"monto_total_fuente\": \"30000.00\",\n      \"monto_total_apl\": \"20000.00\",\n      \"estado\": \"PROCESO\",\n      \"descripcion\": \"Mi primer proyecto\",\n      \"ambiental\": \"NO\",\n      \"social\": \"SI\",\n      \"empresa\": {\n        \"cod_empresa\": 1,\n        \"id\": 1,\n        \"contratista\": \"la Rana Rene\",\n        \"familias\": 1,\n        \"hectareas\": 5.7,\n        \"piletas\": 11,\n        \"conex\": 2,\n        \"plazo_dias\": 200,\n        \"ampliacion_dias\": 0,\n        \"paralizacion_dias\": 1,\n        \"estado_proyecto\": \"PROCESO\",\n        \"total_ejecutado\": 10000,\n        \"total_ejecutado_fte\": 5000,\n        \"total_ejecutado_apl\": 4500,\n        \"avance_fisico\": \"50.00\",\n        \"avance_financiero\": \"80.00\",\n        \"fecha_inicio\": \"2017-01-13T00:00:00.000Z\",\n        \"fecha_conclusion\": \"2017-11-25T00:00:00.000Z\",\n        \"ejecutor\": \"Saw\"\n      }\n    }, ...\n  ]\n}",
          "type": "Array"
        }
      ]
    },
    "filename": "src/routes/api/proyectoRT.js",
    "groupTitle": "proyecto"
  }
] });
