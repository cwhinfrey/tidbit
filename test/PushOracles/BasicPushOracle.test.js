import { toAscii } from 'web3-utils'

const BasicPushOracle = artifacts.require('BasicPushOracle')
const OracleConsumerMock = artifacts.require('OracleConsumerMock')

require('chai').should()

const RESULT = 'hello oracle'

contract('BasicPushOracle', (accounts) => {
  const dataSource = accounts[1]

  it('calls receiveResult() on OracleConsumer', async () => {
    const oracleConsumer = await OracleConsumerMock.new()
    const oracle = await BasicPushOracle.new()
    await oracle.initialize(dataSource, oracleConsumer.address)
    await oracle.setResult(RESULT, { from: dataSource })
    const result = await oracleConsumer.result()
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })
})
