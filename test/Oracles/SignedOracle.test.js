import expectRevert from '../helpers/expectRevert'
import expectEvent from '../helpers/expectEvent'
import { web3 } from '../helpers/w3'
import { encodeCall } from 'zos-lib'

const SignedOracle = artifacts.require('SignedOracle')

require('chai').should()

const RESULT = 'hello oracle'
const RESULT_HASH = web3.utils.soliditySha3(RESULT);

contract('SignedOracle', (accounts) => {
  const dataSource = accounts[1]

  let oracle
  beforeEach(async ()=> {
    oracle = await SignedOracle.new()
    const data = encodeCall(
        "initialize", 
        ['address'],
        [dataSource]
    )
    await oracle.sendTransaction({data})
  })

  it('can set result by data source', async () => {
    const signature = await web3.eth.sign(RESULT_HASH, dataSource)

    await oracle.setResult(RESULT_HASH, signature)
    const result = await oracle.resultFor(0)
    result.should.equal(RESULT_HASH)
  })

  it('cannot be set by a different data source', async () => {
    const signature = await web3.eth.sign(RESULT_HASH, accounts [0])
    await expectRevert(oracle.setResult(RESULT_HASH, signature))
  })

  it('cannot be set twice', async () => {
    let signature = await web3.eth.sign(RESULT_HASH, dataSource)
    await oracle.setResult(RESULT_HASH, signature)
    
    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, dataSource)
    await expectRevert(oracle.setResult(RESULT_HASH, signature))
  })
  
  it('should emit ResultSet event', async () => {
    const signature = await web3.eth.sign(RESULT_HASH, dataSource)
    await expectEvent.inTransaction(
      oracle.setResult(RESULT_HASH, signature),
      'ResultSet',
      { _result: RESULT_HASH, _sender: accounts[0] }
    )
  })
})
