import { toAscii } from 'web3-utils'

const BasicPushOracle = artifacts.require('BasicPushOracle')
const OracleHandlerMock = artifacts.require('OracleHandlerMock')

require('chai').should()

const RESULT = 'hello oracle'

contract('BasicPushOracle', (accounts) => {
  const dataSource = accounts[1]

  it('calls receiveResult() on OracleHandler', async () => {
    const oracleHandler = await OracleHandlerMock.new()
    const oracle = await BasicPushOracle.new(dataSource, oracleHandler.address)
    await oracle.setResult(RESULT, { from: dataSource })
    const result = await oracleHandler.result()
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })
})
