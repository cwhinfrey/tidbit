import { toAscii } from 'web3-utils'
import expectRevert from './helpers/expectRevert'

const OwnedOracle = artifacts.require('OwnedOracle')

require('chai').should()

const RESULT = 'hello oracle'

contract('OwnedOracle', (accounts) => {

  let oracle
  beforeEach(async ()=> {
    oracle = await OwnedOracle.new()
  })

  it('is initialized with the correct state', async () => {
    await expectRevert(oracle.resultFor(0))
    const isResultSet = await oracle.isResultSet()
    isResultSet.should.equal(false)
  })

  it('can set result by owner', async () => {
    await oracle.setResult(RESULT)
    const result = await oracle.resultFor(0)
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })

  it('cannot be set by a non-owner address', async () => {
    await expectRevert(oracle.setResult(RESULT, { from: accounts[1] }))
  })

  it('cannot be set twice', async () => {
    await oracle.setResult(RESULT)
    await expectRevert(oracle.setResult(RESULT))
  })
})
