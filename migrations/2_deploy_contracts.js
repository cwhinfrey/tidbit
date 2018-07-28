/* global artifacts */

const BasicOracle = artifacts.require('BasicOracle')

module.exports = function (deployer) {
  deployer.deploy(
    BasicOracle
  )
}
