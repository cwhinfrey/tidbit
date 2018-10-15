import { web3 } from '../helpers/w3'
import expectRevert from '../helpers/expectRevert'

const AveragedOracle = artifacts.require('AveragedOracle')
const BasicOracle = artifacts.require('BasicOracle')

require('chai').should()

const RESULT1 = web3.utils.asciiToHex('4');
const RESULT2 = web3.utils.asciiToHex('10');
const RESULT3 = web3.utils.asciiToHex('15');

contract('AveragedOracle', (accounts) => {
  const dataSource1 = accounts[1]
  const dataSource2 = accounts[2]
  const dataSource3 = accounts[3]
  const dataSource4 = accounts[4]
  let oracle1, oracle2, oracle3, oracle4

  beforeEach(async () => {
    oracle1 = await BasicOracle.new(dataSource1)
    oracle2 = await BasicOracle.new(dataSource2)
    oracle3 = await BasicOracle.new(dataSource3)
  })

  it('cannot initilize AveragedOracle with empty oracle array.', async () => {
    await expectRevert(AveragedOracle.new([]))
  })

  it('cannot set result if any of the sub-oracles have not been set yet.', async () => {
    const averagedOracle = await AveragedOracle.new([oracle1.address, oracle2.address, oracle3.address])
    await oracle1.setResult(RESULT1, { from: dataSource1 })
    await oracle2.setResult(RESULT2, { from: dataSource2 })
    await expectRevert(averagedOracle.setResult())
  })

  it('set result to the median value', async () => {
    await oracle1.setResult(RESULT1, { from: dataSource1 })
    await oracle2.setResult(RESULT2, { from: dataSource2 })
    await oracle3.setResult(RESULT3, { from: dataSource3 })
    const averagedOracle = await AveragedOracle.new([oracle1.address, oracle2.address, oracle3.address]);
    await averagedOracle.setResult()
    const medianValue = await averagedOracle.resultFor(0)
    web3.utils.hexToUtf8(medianValue).should.equal('10')
  })

  it('set result to the median value even with duplicated value in sub-oracles', async () => {
    oracle4 = await BasicOracle.new(dataSource4)
    await oracle1.setResult(RESULT1, { from: dataSource1 })
    await oracle2.setResult(RESULT2, { from: dataSource2 })
    await oracle3.setResult(RESULT3, { from: dataSource3 })
    await oracle4.setResult(RESULT2, { from: dataSource4 })
    const averagedOracle = await AveragedOracle.new([oracle1.address, oracle2.address, oracle3.address, oracle4.address]);
    await averagedOracle.setResult()
    const medianValue = await averagedOracle.resultFor(0)
    web3.utils.hexToUtf8(medianValue).should.equal('10')
  })

})