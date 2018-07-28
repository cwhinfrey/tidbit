import { toAscii } from 'web3-utils'

const OwnedPushOracle = artifacts.require('OwnedPushOracle')
const OracleHandlerMock = artifacts.require('OracleHandlerMock')

require('chai').should()

const RESULT = 'hello oracle'

contract('OwnedPushOracle', (accounts) => {

  it('calls receiveResult() on OracleHandler', async () => {
    const oracleHandler = await OracleHandlerMock.new()
    const oracle = await OwnedPushOracle.new(oracleHandler.address)
    await oracle.setResult(RESULT)
    const result = await oracleHandler.result()
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })
})
