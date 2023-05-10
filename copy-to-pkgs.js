const fse = require('fs-extra')
const path = require('path')
const compsPath = path.resolve(__dirname, './src/components')
const pkgPath = path.resolve(__dirname, './packages')

fse.copy(compsPath, pkgPath)
    .then(() => console.log('cp comps success!'))
    .catch(err => console.error(err, 'cp error!'))