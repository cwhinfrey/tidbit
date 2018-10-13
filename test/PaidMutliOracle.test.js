import expectRevert from './helpers/expectRevert'
import expectEvent from './helpers/expectEvent'
import { web3 } from './helpers/w3'

const PaidMultiOracle = artifacts.require('PaidMultiOracle')
const BigNumber = require('bignumber.js');

const should = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();
  
const RESULT = 'hello oracle'
const RESULT2 = 'hello again oracle'

contract('PaidMultiOracle', (accounts) => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const dataSource1 = accounts[1]
  const dataSource2 = accounts[2]
  const reward = web3.utils.toWei('10', 'ether')
  const contractBalance = web3.utils.toWei('100', 'ether')
  const contractBalance2 = web3.utils.toWei('5', 'ether')

  let oracle
  beforeEach(async ()=> {
    oracle = await PaidMultiOracle.new(reward, {value: contractBalance})
  })

  it('getReward should return the reward if the contractBalance is greater than the reward', async () => {
    const contractBalance = await web3.eth.getBalance(oracle.address)
    const oracleReward = await oracle.getReward()
    oracleReward.should.be.bignumber.equal(reward)
  })

  it('getReward should return the contractBalance if the contractBalance is less than the reward', async () => {
    const oracle2 = await PaidMultiOracle.new(reward, {value: contractBalance2})
    const contractBalance = await web3.eth.getBalance(oracle2.address)
    const oracleReward = await oracle2.getReward()
    oracleReward.should.be.bignumber.equal(contractBalance)
  })
  
  it('requires a non-null dataSource', async () => {
    await expectRevert(
      oracle.newOracle(0, ZERO_ADDRESS)
    )
  })

  it('should pay out reward', async () => {
    const dataSourceOriginalBalance = await web3.eth.getBalance(dataSource1)
    dataSourceOriginalBalance.should.be.bignumber.equal(web3.utils.toWei('1000000', 'ether'))

    await oracle.newOracle(0, dataSource1)
    await oracle.setResult(0, RESULT, {from: dataSource1 })

    const dataSourceBalance = await web3.eth.getBalance(dataSource1)
    '1000010'.should.be.bignumber.equal(web3.utils.fromWei(dataSourceBalance, 'ether'), 2, BigNumber.ROUND_UP)
  })

  it('cannot pay out reward when the result was set twice', async () => {
    await oracle.newOracle(1, dataSource2)
    await oracle.setResult(1, RESULT, {from: dataSource2 })
    await expectRevert (
      oracle.setResult(1, RESULT2, { from: dataSource2 })
    )
  })
  
  it('isResultSet bool should be flipped after result was set', async () => {
    await oracle.newOracle(1, dataSource1)
    let isResultSet = await oracle.isResultSet(1)
    isResultSet.should.equal(false)

    await oracle.setResult(1, RESULT, {from: dataSource1 })
    isResultSet = await oracle.isResultSet(1)
    isResultSet.should.equal(true)
  })
})
