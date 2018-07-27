require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8546,
      network_id: '*', // Match any network id
      gas: 4600000
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8546,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    rinkeby: getRinkebyConfig()
  }
}

function getRinkebyConfig () {
  var HDWalletProvider = require('truffle-hdwallet-provider')
  var secrets = {}
  try {
    secrets = require('./secrets.json')
  } catch (err) {
    console.log('could not find ./secrets.json')
  }

  var rinkebyProvider = () => {
    const provider = new HDWalletProvider(secrets.mnemonic, 'https://rinkeby.infura.io/' + secrets.infura_apikey)
    return provider
  }

  return {
    network_id: 4,
    provider: rinkebyProvider
  }
}
