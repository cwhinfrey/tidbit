import { shouldFail } from 'openzeppelin-test-helpers'
import { encodeCall } from 'zos-lib'
import bnChai from 'bn-chai'
import chai from 'chai'
chai
  .use(bnChai(web3.utils.BN))
  .should()

const { BN, soliditySha3, toWei } = web3.utils

const PaidOracle = artifacts.require('PaidOracle')

const RESULT = soliditySha3('hello oracle')

contract('PaidOracle', (accounts) => {
  const dataSource = accounts[2]
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const reward = web3.utils.toWei('10', 'ether')
  const contractBalance = web3.utils.toWei('100', 'ether')

  let oracle, initializeData
  beforeEach(async ()=> {
    oracle = await PaidOracle.new()
    initializeData = encodeCall("initialize", ['address', 'uint256'], [dataSource, reward])
    await web3.eth.sendTransaction({data: initializeData, value: contractBalance, to: oracle.address, from: accounts[0], gasLimit: 500000})
    // await oracle.sendTransaction({data: initializeData, value: contractBalance})
  })

  it('requires a non-null dataSource', async () => {
    const paidOracle = await PaidOracle.new()
    initializeData = encodeCall("initialize", ['address', 'uint256'], [ZERO_ADDRESS, reward])
    
    await shouldFail(
      paidOracle.sendTransaction({data: initializeData, value: contractBalance})
    )
  })

  it('reward should be the contract balance if its less than the reward, otherwise return reward itself.', async () => {
    const contractBalance = new BN(await web3.eth.getBalance(oracle.address))
    const oracleReward = await oracle.getReward()
    let amount = contractBalance.lt(reward) ? contractBalance : reward
    oracleReward.should.eq.BN(amount)
  })

  it('should pay out reward', async () => {
    const dataSourceOriginalBalance = new BN(await web3.eth.getBalance(dataSource))

    await oracle.setResult(RESULT, {from: dataSource })

    const dataSourceBalance = new BN(await web3.eth.getBalance(dataSource))
    const finalBalanceHigh = dataSourceOriginalBalance.add(new BN(reward))
    const finalBalanceLow = finalBalanceHigh.sub(new BN(toWei('0.1')))
    
    dataSourceBalance.should.be.lt.BN(finalBalanceHigh)
    dataSourceBalance.should.be.gt.BN(finalBalanceLow)
  })

  it('cannot pay out reward when the result was set twice', async () => {
    await oracle.setResult(RESULT, {from: dataSource })
    await shouldFail (
      oracle.setResult(RESULT, { from: dataSource })
    )
  })

  it('isResultSet should be flipped after result was set', async () => {
    let isResultSet = await oracle.isResultSet('0x0')
    isResultSet.should.equal(false)

    await oracle.setResult(RESULT, {from: dataSource })
    isResultSet = await oracle.isResultSet('0x0')
    isResultSet.should.equal(true)
  })
})
