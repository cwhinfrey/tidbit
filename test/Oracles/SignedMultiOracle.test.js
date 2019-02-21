import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { soliditySha3 } = web3.utils
const { sign } = web3.eth

const SignedMultiOracle = artifacts.require('SignedMultiOracle')

require('chai').should()

const RESULT1 = 'hello SignedMultiOracle1'
const RESULT_HASH1 = soliditySha3(RESULT1);

const RESULT2 = 'hello SignedMultiOracle2'
const RESULT_HASH2 = soliditySha3(RESULT2);

contract('SignedMultiOracle', (accounts) => {
  const signer0 = accounts[0]
  const signer1 = accounts[1]
  const signer2 = accounts[2]
  const id1 = '0x10'
  const id2 = '0x20'
  const messageHash1 = soliditySha3(RESULT_HASH1)

  let oracle
  beforeEach(async () => {
    oracle = await SignedMultiOracle.new()
    await oracle.newOracle(id1, signer1)
    await oracle.newOracle(id2, signer2)
  })

  it('can set result with signature by data source', async () => {
    const signature1 = await sign(messageHash1, signer1)
    await oracle.setResultWithSignature(id1, RESULT_HASH1, signature1, { from: signer1 })
    const result1 = await oracle.resultFor(id1)
    result1.should.equal(RESULT_HASH1)
    const isResultSet = await oracle.isResultSet(id1)
    isResultSet.should.equal(true)

    const messageHash2 = soliditySha3(RESULT_HASH2)
    const signature2 = await web3.eth.sign(messageHash2, signer2)
    await oracle.setResultWithSignature(id2, RESULT_HASH2, signature2, { from: signer2 })
    const result2 = await oracle.resultFor(id2)
    result2.should.equal(RESULT_HASH2)
    const isResultSet2 = await oracle.isResultSet(id2)
    isResultSet2.should.equal(true)
  })

  it('cannot be set by a different signer', async () => {
    const signature = await web3.eth.sign(RESULT_HASH1, signer0)
    await shouldFail(oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1}))
  })

  it('cannot be set with the same id twice', async () => {
    let signature = await web3.eth.sign(messageHash1, signer1)
    await oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 })
    await shouldFail(oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 }))

    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, signer1)
    await shouldFail(oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 }))
  })

  it('should emit ResultSet event', async () => {
    // hard-coded here since web3.utils.fromAscii won't return 32 bytes hex string
    const bytes32Id = '0x1000000000000000000000000000000000000000000000000000000000000000'
    const signature = await web3.eth.sign(messageHash1, signer1)
    const { logs } = await oracle.setResultWithSignature(id1, RESULT_HASH1, signature, { from: signer1 })
    await expectEvent.inLogs(
      logs,
      'ResultSet',
      {_id: bytes32Id, _result: RESULT_HASH1, _sender: signer1 }
    )
  })
})
