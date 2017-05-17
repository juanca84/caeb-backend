function guardar (pModel, pVector) {
  return new Promise((resolve, reject) => {
    pModel.insert(pVector)
    .then(r => resolve(r))
    .catch(e => reject(e))
  })
}

module.exports.guardar = guardar
