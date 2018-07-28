import { toAscii } from 'web3-utils'

const SingleSourcePushOracle = artifacts.require('SingleSourcePushOracle')
const OracleHandlerMock = artifacts.require('OracleHandlerMock')

require('chai').should()

const RESULT = 'hello oracle'

contract('SingleSourcePushOracle', (accounts) => {
  const dataSource = accounts[1]

  it('calls receiveResult() on OracleHandler', async () => {
    const oracleHandler = await OracleHandlerMock.new()
    const oracle = await SingleSourcePushOracle.new(dataSource, oracleHandler.address)
    await oracle.setResult(RESULT, { from: dataSource })
    const result = await oracleHandler.result()
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })
})
