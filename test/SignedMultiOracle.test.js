import expectEvent from './helpers/expectEvent'
import expectRevert from './helpers/expectRevert'
import { web3 } from './helpers/w3'

const SignedMultiOracle = artifacts.require('SignedMultiOracle')

require('chai').should()

const RESULT1 = 'hello SignedMultiOracle1'
const RESULT_HASH1 = web3.utils.soliditySha3(RESULT1);

const RESULT2 = 'hello SignedMultiOracle2'
const RESULT_HASH2 = web3.utils.soliditySha3(RESULT2);

contract('SignedMultiOracle', (accounts) => {
  const signer0 = accounts[0]
  const signer1 = accounts[1]
  const signer2 = accounts[2]
  const id1 = '1'
  const id2 = '2'

  let oracle
  beforeEach(async ()=> {
    oracle = await SignedMultiOracle.new()
    await oracle.newOracle(id1, signer1)
    await oracle.newOracle(id2, signer2)
  })

  it('can set result with signature by data source', async () => {
    const signature1 = await web3.eth.sign(RESULT_HASH1, signer1)
    await oracle.setResultWithSignature(id1, RESULT_HASH1, signature1, { from: signer1 })
    const result1 = await oracle.resultFor(id1)
    result1.should.equal(RESULT_HASH1)
    const isResultSet = await oracle.isResultSet(id1)
    isResultSet.should.equal(true)

    const signature2 = await web3.eth.sign(RESULT_HASH2, signer2)
    await oracle.setResultWithSignature(id2, RESULT_HASH2, signature2, { from: signer2 })
    const result2 = await oracle.resultFor(id2)
    result2.should.equal(RESULT_HASH2)
    const isResultSet2 = await oracle.isResultSet(id2)
    isResultSet2.should.equal(true)
  })

  it('cannot be set by a different signer', async () => {
    const signature = await web3.eth.sign(RESULT_HASH1, signer0)
    await expectRevert(oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1}))
  })

  it('cannont be set with the same id twice', async () => {
    let signature = await web3.eth.sign(RESULT_HASH1, signer1)
    await oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 })
    await expectRevert(oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 }))

    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, signer1)
    await expectRevert(oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 }))
  })

  it('should emit ResultSet event', async () => {
    const signature = await web3.eth.sign(RESULT_HASH1, signer1)
    await expectEvent.inTransaction(
      oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1}),
      'ResultSet',
      {_result: RESULT_HASH1, _sender: signer1 }
    )
  })
})