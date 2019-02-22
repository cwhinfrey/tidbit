import { expectEvent, shouldFail } from 'openzeppelin-test-helpers'
const { soliditySha3 } = web3.utils
const { sign } = web3.eth

const SignedMultiOracle = artifacts.require('SignedMultiOracle')

require('chai').should()

const RESULT1 = soliditySha3('hello SignedMultiOracle1')

const RESULT2 = soliditySha3('hello SignedMultiOracle2')

contract('SignedMultiOracle', (accounts) => {
  const signer0 = accounts[0]
  const signer1 = accounts[1]
  const signer2 = accounts[2]
  const thirdParty = accounts[2]
  const id1 = soliditySha3(1)
  const id2 = soliditySha3(2)

  let oracle, messageHash1, messageHash2
  beforeEach(async () => {
    oracle = await SignedMultiOracle.new()
    await oracle.newOracle(id1, signer1)
    await oracle.newOracle(id2, signer2)

    messageHash1 = soliditySha3(id1, RESULT1, oracle.address)
    messageHash2 = soliditySha3(id2, RESULT2, oracle.address)
  })

  it('can set result with signature by data source', async () => {
    const signature1 = await sign(messageHash1, signer1)
    await oracle.setResultWithSignature(id1, RESULT1, signature1, { from: thirdParty })
    const result1 = await oracle.resultFor(id1)
    result1.should.equal(RESULT1)
    const isResultSet = await oracle.isResultSet(id1)
    isResultSet.should.equal(true)

    const signature2 = await web3.eth.sign(messageHash2, signer2)
    await oracle.setResultWithSignature(id2, RESULT2, signature2, { from: thirdParty })
    const result2 = await oracle.resultFor(id2)
    result2.should.equal(RESULT2)
    const isResultSet2 = await oracle.isResultSet(id2)
    isResultSet2.should.equal(true)
  })

  it('cannot be set by a different signer', async () => {
    const signature = await web3.eth.sign(RESULT1, signer0)
    await shouldFail(oracle.setResultWithSignature(id1, RESULT1, signature, { from: thirdParty}))
  })

  it('cannot be set with the same id twice', async () => {
    let signature = await web3.eth.sign(messageHash1, signer1)
    await oracle.setResultWithSignature(id1, RESULT1, signature, { from: signer1 })
    await shouldFail(oracle.setResultWithSignature(id1, RESULT1, signature, { from: thirdParty }))

    const secondHash = web3.utils.soliditySha3('another result');
    signature = await web3.eth.sign(secondHash, signer1)
    await shouldFail(oracle.setResultWithSignature(id1, RESULT1, signature, { from: thirdParty }))
  })

  it('should emit ResultSet event', async () => {
    // hard-coded here since web3.utils.fromAscii won't return 32 bytes hex string
    const signature = await web3.eth.sign(messageHash1, signer1)
    const { logs } = await oracle.setResultWithSignature(id1, RESULT1, signature, { from: thirdParty })
    await expectEvent.inLogs(
      logs,
      'ResultSet',
      {_id: id1, _result: RESULT1, _sender: thirdParty }
    )
  })
})
