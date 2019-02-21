import { toAscii } from 'web3-utils'
import { encodeCall } from 'zos-lib'
const { soliditySha3 } = web3.utils

const BasicPushOracle = artifacts.require('BasicPushOracle')
const OracleConsumerMock = artifacts.require('OracleConsumerMock')

require('chai').should()

const RESULT = soliditySha3('hello oracle')

contract('BasicPushOracle', (accounts) => {
  const dataSource = accounts[1]

  it('calls receiveResult() on OracleConsumer', async () => {
    const oracleConsumer = await OracleConsumerMock.new()
    const oracle = await BasicPushOracle.new()
    const initializeData = encodeCall("initialize", ['address', 'address'], [dataSource, oracleConsumer.address])
    // https://forum.zeppelin.solutions/t/revert-when-calling-initialize-manually/314
    // await oracle.sendTransaction({data: initializeData, from: accounts[0]})
    await web3.eth.sendTransaction({data: initializeData, to: oracle.address, from: accounts[0], gasLimit: 500000})
    const source = await oracle.dataSource()
    await oracle.setResult(RESULT, { from: dataSource })
    const result = await oracleConsumer.result()
    result.should.equal(RESULT)
  })
})
