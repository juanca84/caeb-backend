
const
  fs = require("fs"),
  path = require("path"),
  Sequelize = require("sequelize"),
  db = null;

module.exports = (sequelize) => {
  const db={
    models:{},
  };
  const dirModels = path.join(__dirname, "models");

  // Obtiene los modelos del directorio "models".
  fs.readdirSync(dirModels).forEach(dir => {

    if(fs.statSync(`${dirModels}/${dir}`).isDirectory()){

      const subDirModels = path.join(dirModels, dir);

      if(dir !== "ejemplos") //TODO: commentar si esque se quieren cargar los modelos de ejemplos
        fs.readdirSync(subDirModels).forEach(file => {

          const
            pathFile = path.join(subDirModels, file),
            model = sequelize.import(pathFile);

          // Almacena los objetos modelo en un JSON.
          db.models[model.name] = model;
        });
    }
  });
  console.log("cargando asociaciones....");
  Object.keys(db.models).forEach(key => {
      // console.log(`---->${key+db.models[key]}`);
      // Control de relaciones(associate) de los modelos.
      if(db.models[key].associate!==undefined){
        db.models[key].associate(db.models);

      }
  });

  return db;
};
