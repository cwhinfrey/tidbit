import { shouldFail } from 'openzeppelin-test-helpers'
import { encodeCall } from 'zos-lib'
import bnChai from 'bn-chai'
import chai from 'chai'
chai
  .use(bnChai(web3.utils.BN))
  .should()

const { BN, soliditySha3 } = web3.utils

const Token = artifacts.require('MockToken')
const PaidOracle = artifacts.require('PaidOracle')

const RESULT = soliditySha3('hello oracle')

contract('PaidOracle', (accounts) => {
  const dataSource = accounts[2]
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const reward = web3.utils.toWei('10', 'ether')
  const contractBalance = web3.utils.toWei('100', 'ether')

  let oracle, initializeData, token
  beforeEach(async ()=> {
    oracle = await PaidOracle.new()
    token = await Token.new()

    initializeData = encodeCall(
      "initialize",
      ['address', 'address', 'uint256'],
      [token.address, dataSource, reward]
    )
    await web3.eth.sendTransaction({data: initializeData, to: oracle.address, from: accounts[0], gasLimit: 500000})
    await token.mint(oracle.address, contractBalance)
  })

  it('requires a non-null dataSource', async () => {
    const paidOracle = await PaidOracle.new()
    initializeData = encodeCall(
      "initialize",
      ['address', 'address', 'uint256'],
      [token.address, ZERO_ADDRESS, reward]
    )
    await shouldFail(
      paidOracle.sendTransaction({data: initializeData})
    )
  })

  it('reward should be the contract balance if its less than the reward, otherwise return reward itself.', async () => {
    const contractBalance = new BN(await token.balanceOf(oracle.address))
    const oracleReward = await oracle.getReward()
    let amount = contractBalance.lt(reward) ? contractBalance : reward
    oracleReward.should.eq.BN(amount)
  })

  it('should pay out reward', async () => {
    await oracle.setResult(RESULT, {from: dataSource })
    const dataSourceBalance = new BN(await token.balanceOf(dataSource))
    dataSourceBalance.should.be.eq.BN(reward)
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
