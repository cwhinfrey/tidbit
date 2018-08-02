import { toAscii } from 'web3-utils'
import expectRevert from './helpers/expectRevert'

const BasicOracle = artifacts.require('BasicOracle')

require('chai').should()

const RESULT = 'hello oracle'

contract('BasicOracle', (accounts) => {
  const dataSource = accounts[1]

  let oracle
  beforeEach(async ()=> {
    oracle = await BasicOracle.new(dataSource)
  })

  it('can set result by owner', async () => {
    await oracle.setResult(RESULT, { from: dataSource })
    const result = await oracle.resultFor(0)
    toAscii(result).replace(/\u0000/g, '').should.equal(RESULT)
  })

  it('cannot be set by a different data source', async () => {
    await expectRevert(oracle.setResult(RESULT, { from: accounts[2] }))
  })

  it('cannot be set twice', async () => {
    await oracle.setResult(RESULT, { from: dataSource })
    await expectRevert(oracle.setResult(RESULT, { from: dataSource }))
  })
})
