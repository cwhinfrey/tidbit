import { toAscii } from 'web3-utils'
import expectRevert from './helpers/expectRevert'
import { web3 } from './helpers/w3'

const SignedOracle = artifacts.require('SignedOracle')

require('chai').should()

const RESULT = 'hello oracle'
const RESULT_HASH = web3.utils.soliditySha3(RESULT);

contract('SignedOracle', (accounts) => {
  const signer = accounts[1]

  let oracle
  beforeEach(async ()=> {
    oracle = await SignedOracle.new(signer)
  })

  it('can set result by signer', async () => {
    const signature = await web3.eth.sign(RESULT_HASH, signer)

    await oracle.setResult(RESULT_HASH, signature)
    const result = await oracle.resultFor(0)
    result.should.equal(RESULT_HASH)
  })

  it('cannot be set by a different signer', async () => {
    const signature = await web3.eth.sign(RESULT_HASH, accounts [0])
    await expectRevert(oracle.setResult(RESULT_HASH, signature))
  })

  it('cannot be set twice', async () => {
    let signature = await web3.eth.sign(RESULT_HASH, signer)
    await oracle.setResult(RESULT_HASH, signature)
    
    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, signer)
    await expectRevert(oracle.setResult(RESULT_HASH, signature))
  })
})
