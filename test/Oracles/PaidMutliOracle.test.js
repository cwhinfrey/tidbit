import { shouldFail } from 'openzeppelin-test-helpers'
import bnChai from 'bn-chai'
import chai from 'chai'
chai
  .use(bnChai(web3.utils.BN))
  .should()

const { toWei, soliditySha3, BN } = web3.utils

const Token = artifacts.require('MockToken')
const PaidMultiOracle = artifacts.require('PaidMultiOracle')

const ORACLE_ID_0 = '0x0'
const ORACLE_ID_1 = '0x1'
const RESULT = soliditySha3('hello oracle')
const RESULT2 = soliditySha3('hello again oracle')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract('PaidMultiOracle', (accounts) => {
  const dataSource1 = accounts[1]
  const dataSource2 = accounts[2]
  const reward = web3.utils.toWei('10', 'ether')
  const contractBalance = toWei('100', 'ether')
  const contractBalance2 = toWei('5', 'ether')

  let multiOracle, token
  beforeEach(async ()=> {
    multiOracle = await PaidMultiOracle.new()
    token = await Token.new()
    await multiOracle.initialize(token.address, reward)
    await token.mint(multiOracle.address, contractBalance)
  })

  it('getReward should return the reward if the contractBalance is greater than the reward', async () => {
    const oracleReward = await multiOracle.getReward()
    oracleReward.should.eq.BN(reward)
  })

  it('getReward should return the contractBalance if the contractBalance is less than the reward', async () => {
    const multiOracle2 = await PaidMultiOracle.new()
    await multiOracle2.initialize(token.address, reward)
    await token.mint(multiOracle2.address, contractBalance2)
    const contractBalance = await token.balanceOf(multiOracle2.address)
    const oracleReward = await multiOracle2.getReward()
    oracleReward.should.eq.BN(contractBalance)
  })
  
  it('requires a non-null dataSource', async () => {
    await shouldFail(
      multiOracle.newOracle(ORACLE_ID_0, ZERO_ADDRESS)
    )
  })

  it('should pay out reward', async () => {
    await multiOracle.newOracle(ORACLE_ID_0, dataSource1)
    await multiOracle.setResult(ORACLE_ID_0, RESULT, {from: dataSource1 })
    await multiOracle.newOracle(ORACLE_ID_1, dataSource2)
    await multiOracle.setResult(ORACLE_ID_1, RESULT2, {from: dataSource2})
    
    const dataSourceBalance1 = new BN(await token.balanceOf(dataSource1))
    const dataSourceBalance2 = new BN(await token.balanceOf(dataSource2))
  
    dataSourceBalance1.should.be.eq.BN(reward)
    dataSourceBalance2.should.be.eq.BN(reward)
  })

  it('cannot pay out reward when the result was set twice', async () => {
    await multiOracle.newOracle(ORACLE_ID_1, dataSource2)
    await multiOracle.setResult(ORACLE_ID_1, RESULT, {from: dataSource2 })
    await shouldFail (
      multiOracle.setResult(ORACLE_ID_1, RESULT2, { from: dataSource2 })
    )
  })
  
  it('isResultSet bool should be flipped after result was set', async () => {
    await multiOracle.newOracle(ORACLE_ID_1, dataSource1)
    let isResultSet = await multiOracle.isResultSet(ORACLE_ID_1)
    isResultSet.should.equal(false)

    await multiOracle.setResult(ORACLE_ID_1, RESULT, {from: dataSource1 })
    isResultSet = await multiOracle.isResultSet(ORACLE_ID_1)
    isResultSet.should.equal(true)
  })
})
