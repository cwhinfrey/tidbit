/* global artifacts */

const OwnedOracle = artifacts.require('OwnedOracle')

module.exports = function (deployer) {
  deployer.deploy(
    OwnedOracle
  )
}
