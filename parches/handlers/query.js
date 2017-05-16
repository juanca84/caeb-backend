var _ = require('lodash'),
    qs = require('../parsers/qs'),
    transform = require('../parsers/transform');

module.exports = init;

function init(model) {
   return [
       transform,
       filter,
       query
   ];

   function filter(req, res, next) {
        var options = {},
            keys = {};

        model = req.model || model;



        if( req.query.filter != undefined  && req.query.page != undefined  && req.query.order != undefined){

          keys.model = _.keys(model.rawAttributes);
          keys.query = _.keys(req.query);
          keys.filters = _.intersection(keys.model, keys.query);

          options.attributes = qs.fields(req.query.fields);
          options.limit = qs.limit(req.query.limit) || 50;
          options.offset = (req.query.limit * ((req.query.page || 1) - 1)) || 0;
          options.order = qs.sort(req.query.order);
          options.where = qs.filters(_.pick(req.query, keys.filters)) || {};

          if(req.query.searchPro==1 && req.query.fIni && req.query.fFin){
            options.where.fecha = { $between:[new Date(req.query.fIni) || fAct, new Date(req.query.fFin) || fAct] };
          }

          if(req.query.filter != ''){
            model.describe().then(function (fields) {
              var xfilter = [];
              for (var i in fields) {
                  var field = fields[i];
                  var obj = {};
                  var buscar = (options.attributes==null)? true : options.attributes.indexOf(i)!=-1;
                  if(req.query.searchPro==1 && buscar && req.query.tipoBus=='campo') buscar = req.query.campoSel==i;

                  if(req.query.searchPro==1 && req.query.tipoBus=='documento'){
                      buscar = false;
                      if(i=='plantilla_valor'){
                          obj[i] = { $ilike:"%"+req.query.filter+"%" };
                          xfilter.push(obj);
                      }
                  }
                
                  if(buscar){
                    switch (field.type) {
                      case 'INTEGER':
                        x = parseInt(req.query.filter);
                        if(!isNaN(x) && req.query.filter.indexOf("/") == -1){
                            obj[i] = x;
                            xfilter.push(obj);
                        }
                      break;
                      case 'USER-DEFINED':
                        x = req.query.filter;
                        for (var j in field.special) {
                          // console.log("j",field.special[j]);
                          if(field.special[j].toLowerCase().indexOf(x.toLowerCase()) == 0){
                            obj[i] = field.special[j];
                            xfilter.push(obj);
                          }
                        }
                      break;
                      case 'TIMESTAMP WITH TIME ZONE':
                      // Busqueda de fechas del tipo: 2016-10-20, 2016/10/20, 20-10-2016, 20/10/2016.
                      // TODO: No se puede buscar por el mes.
                      var consulta=procesarFecha(req.query.filter);
                      if(consulta!=false){
                        obj[i]=procesarFecha(req.query.filter);
                        xfilter.push(obj);
                      }
                      break;
                      case 'CHARACTER VARYING':
                        obj[i] = { $ilike:"%"+req.query.filter+"%" };
                        xfilter.push(obj);
                      break;
                      case 'TEXT':
                        obj[i] = { $ilike:"%"+req.query.filter+"%" };
                        xfilter.push(obj);
                      break;
                      default:
                      obj[i] = req.query.filter;
                      xfilter.push(obj);
                    }
                  }
                  // console.log(i," ",fields[i]);
              }
            //   console.log(xfilter);
              for (var i in xfilter[0]) {
                if (i.indexOf("id_")==0) {
                  xfilter.shift();//descatamos el id
                }
              }
              options.where.$or = xfilter;
              options = _.omitBy(options, _.isNull);
              req.options = options;
              next();
            });
          }else {
            options = _.omitBy(options, _.isNull);
            req.options = options;
            next();
          }
        }else {
          //consulta por defecto de sequelize-handlers
          keys.model = _.keys(model.rawAttributes);
          keys.query = _.keys(req.query);
          keys.filters = _.intersection(keys.model, keys.query);

          options.attributes = qs.fields(req.query.fields);
          options.limit = qs.limit(req.query.limit) || 50;
          options.offset = qs.offset(req.query.offset);
          options.order = qs.sort(req.query.sort);
          options.where = qs.filters(_.pick(req.query, keys.filters));

          options = _.omitBy(options, _.isNull);

          req.options = _.merge({}, options, req.options);

          next();
        }
    }

    function query(req, res, next) {
        var options = req.options;

        model
            .findAndCountAll(options)
            .then(respond)
            .catch(next);

        function respond(result) {
            var count = result.count,
                start = options.offset,
                end = options.offset + options.limit;

            if (end >= count) {
                end = count;
                res.status(200);
            } else {
                res.status(206);
            }

            res
                .set('Content-Range', start + '-' + end + '/' + count)
                .send({
                    tipoMensaje: "EXITO",
                    mensaje: "La operación se realizó correctamente.",
                    datos: {
                        total: result.count,
                        resultado: res.transform(result.rows)
                    }
                });
        }
    }






    /**
      Funcion que procesa una cadena, verifica si tiene el formato de una fecha.
      @param {pCadena} Cadena de texto con formato de fecha.
      @return Retorna:
      EXITO -> un objeto de consulta con formato sequelize.
      FALLO -> false.
    */
    function procesarFecha(pCadena){

      var fecha=new Date(pCadena);
      var anio=null, inicio=null, fin=null;

      // Identifica el operador usando en la cadena para separar los datos.
      var operador=pCadena.indexOf('-')>-1? '-': pCadena.indexOf('/')>-1?'/':null;

      // Si existe un operador valido en la cadena.
      if(operador!=null){

        // Si la cadena no es valida como fecha, se la invierte.
        if(fecha == 'Invalid Date') {
          fecha =new Date(((pCadena.split(operador)).reverse()).join("-"));
        }
        // Obtine el año.
        anio=fecha.getFullYear();

        // Si existe el año.
        if(anio!=null){
          var vector=pCadena.split(operador)

          // Si la longitud del vector es igual a 3.
          if(vector.length==3){
            var indice=vector.indexOf(anio.toString());

            // Si el año existe dentro del vector de la cadena.
            if(indice>-1){

              // Armado de la fecha inicio y fecha fin.
              if(indice==0){
                inicio=vector[0]+"-"+vector[1]+"-"+vector[2];
                fin=vector[0]+"-"+vector[1]+"-"+(parseInt(vector[2])+1);
              }
              else if(indice==2) {
                inicio=vector[2]+"-"+vector[1]+"-"+vector[0];
                fin=vector[2]+"-"+vector[1]+"-"+(parseInt(vector[0])+1);
              }

              // Armado de la respuesta a retornar.
              var respuesta={
                $gte: inicio,
                $lt: fin
              };
              return respuesta;
            }
            else return false; // Fin condicional indice.
          }
          else return false; // Fin condicional longitud vector.
        }
        else return false; // Fin condicional existencia año.
      }
      else return false; // Fin condicional existencia operador.
    }
};
