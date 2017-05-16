module.exports = app => {
  // Almacena las rutas contenidas en el sistema.
  const rutas = { GET: [], PUT: [], POST: [], OPTIONS: [], DELETE: [] }
  for (const k in app._router.stack) {
    if (app._router.stack[k].route) {
      for (const m in app._router.stack[k].route.methods) {
        rutas[m.toUpperCase()].push(app._router.stack[k].regexp)
      }
    }
  }
  app.set('ruta', rutas)
  if (process.env.NODE_ENV !== 'test') {
    app.src.db.sequelize.sync().done(() => {
      if (process.env.FORCE || false) {
        console.log('------------BASE DE DATOS CREADA--------------')
        process.exit(0)
      } else {
        app.listen(app.get('port'), () => {
          console.log(`
                      _.---._    /\\
                   ./'       "-- \//
                 ./              o\\\\
                /./\\  )______   \__\\ \\
               ./  / /\\ \\   | \\ \\  \\ \\
         VK       / /  \\ \\  | |\\ \\  \\/7
                   "     "    "  "
          `)
          console.log(`Iniciando servidor en el puerto ${app.get('port')} `)
        })
      }
    })
  } else {
    app.src.db.sequelize.sync().done(() => {
      console.log('------------BASE DE DATOS CREADA--------------')
      if (process.env.FORCE || false) {
        process.exit(0)
      }
    })
  }
}
