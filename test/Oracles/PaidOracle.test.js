import expectRevert from '../helpers/expectRevert'
import expectEvent from '../helpers/expectEvent'
import { web3 } from '../helpers/w3'
import { encodeCall } from 'zos-lib'

const PaidOracle = artifacts.require('PaidOracle')
const BigNumber = require('bignumber.js');

const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const RESULT = 'hello oracle'

contract('PaidOracle', (accounts) => {
  const dataSource = accounts[2]
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const reward = web3.utils.toWei('10', 'ether')
  const contractBalance = web3.utils.toWei('100', 'ether')

  let oracle
  let oracle2
  beforeEach(async ()=> {
    oracle = await PaidOracle.new()
    const data = encodeCall(
        "initialize", 
        ['address', 'uint256'],
        [dataSource, reward]
    )
    await oracle.sendTransaction({data, value: contractBalance})
  })

  it('requires a non-null dataSource', async () => {
    oracle2 = await PaidOracle.new()
    const data = encodeCall(
        "initialize", 
        ['address', 'uint256'],
        [ZERO_ADDRESS, reward]
    )
    await expectRevert(
      oracle2.sendTransaction({data, value: contractBalance})
    )
  })

  it('reward should be the contract balance if its less than the reward, otherwise return reward itself.', async () => {
    const contractBalance = await web3.eth.getBalance(oracle.address)
    const oracleReward = await oracle.getReward()
    const amount = Math.min(contractBalance, reward)
    oracleReward.should.be.bignumber.equal(amount)
  })

  it('should pay out reward', async () => {
    const dataSourceOriginalBalance = await web3.eth.getBalance(dataSource)
    dataSourceOriginalBalance.should.be.bignumber.equal(web3.utils.toWei('1000000', 'ether'))

    await oracle.setResult(RESULT, {from: dataSource })

    const dataSourceBalance = await web3.eth.getBalance(dataSource)
    '1000010'.should.be.bignumber.equal(web3.utils.fromWei(dataSourceBalance, 'ether'), 2, BigNumber.ROUND_UP)
  })

  it('cannot pay out reward when the result was set twice', async () => {
    await oracle.setResult(RESULT, {from: dataSource })
    await expectRevert (
      oracle.setResult(RESULT, { from: dataSource })
    )
  })

  it('isResultSet should be flipped after result was set', async () => {
    let isResultSet = await oracle.isResultSet(0)
    isResultSet.should.equal(false)

    await oracle.setResult(RESULT, {from: dataSource })
    isResultSet = await oracle.isResultSet(0)
    isResultSet.should.equal(true)
  })
})
