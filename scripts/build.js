var fs = require('fs')

var contractsPath = 'build/contracts'
var bundleFilePath = 'lib/index.js'

fs.readdir(contractsPath, function (err, items) {
  if (err) {
    return console.log(err)
  }

  var bundle = 'module.exports = {'

  for (var i = 0; i < items.length; i++) {
    var fileName = items[i]
    var contractName = fileName.substr(0, fileName.length - 5)
    var data = fs.readFileSync(`${contractsPath}/${fileName}`).toString()
    bundle += `"${contractName}": ${data},`
  }

  bundle = bundle.substr(0, bundle.length - 1)

  bundle += '}'

  fs.writeFile(bundleFilePath, bundle, function (err) {
    if (err) {
      return console.log(err)
    }
  })
})
