import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { soliditySha3 } = web3.utils
const { sign } = web3.eth

const SignedOracle = artifacts.require('SignedOracle')

require('chai').should()

const RESULT = 'hello oracle'
const RESULT_HASH = web3.utils.soliditySha3(RESULT);

contract('SignedOracle', (accounts) => {
  const dataSource = accounts[1]
  const messageHash = soliditySha3(RESULT_HASH)

  let oracle
  beforeEach(async ()=> {
    oracle = await SignedOracle.new()
    await oracle.initialize(dataSource)
  })

  it('can set result by data source', async () => {
    const signature = await web3.eth.sign(messageHash, dataSource)

    await oracle.setResult(RESULT_HASH, signature)
    const result = await oracle.resultFor('0x0')
    result.should.equal(RESULT_HASH)
  })

  it('cannot be set by a different data source', async () => {
    const signature = await web3.eth.sign(messageHash, accounts[0])
    await shouldFail(oracle.setResult(RESULT_HASH, signature))
  })

  it('cannot be set twice', async () => {
    let signature = await web3.eth.sign(messageHash, dataSource)
    await oracle.setResult(RESULT_HASH, signature)
    
    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, dataSource)
    await shouldFail(oracle.setResult(RESULT_HASH, signature))
  })
  
  it('should emit ResultSet event', async () => {
    const signature = await web3.eth.sign(messageHash, dataSource)
    const { logs } = await oracle.setResult(RESULT_HASH, signature)
    await expectEvent.inLogs(
      logs,
      'ResultSet',
      { _result: RESULT_HASH, _sender: accounts[0] }
    )
  })
})
