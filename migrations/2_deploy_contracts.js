/* global artifacts */

const OracleBase = artifacts.require('OracleBase')

module.exports = function (deployer) {
  deployer.deploy(
    OracleBase
  )
}
