// TODO: Fix these tests. Wrong initialize funciton is being called in beforeEach hook.

// import expectRevert from '../helpers/expectRevert'
// import expectEvent from '../helpers/expectEvent'
// import { web3 } from '../helpers/w3'
// 
// const PaidOracle = artifacts.require('PaidOracle')
// const BigNumber = require('bignumber.js');
// 
// const should = require('chai')
//   .use(require('chai-bignumber')(BigNumber))
//   .should();
// 
// const RESULT = 'hello oracle'
// 
// contract('PaidOracle', (accounts) => {
//   const dataSource = accounts[2]
//   const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
//   const reward = web3.utils.toWei('10', 'ether')
//   const contractBalance = web3.utils.toWei('100', 'ether')
// 
//   let oracle
//   beforeEach(async ()=> {
//     oracle = await PaidOracle.new()
//     await oracle.initialize(dataSource, reward, {value: contractBalance})
//   })
// 
//   it.only('requires a non-null dataSource', async () => {
//     const paidOracle = await PaidOracle.new()
//     await expectRevert(
//       paidOracle.initialize(ZERO_ADDRESS, reward)
//     )
//   })
// 
//   it('reward should be the contract balance if its less than the reward, otherwise return reward itself.', async () => {
//     const contractBalance = await web3.eth.getBalance(oracle.address)
//     const oracleReward = await oracle.getReward()
//     const amount = Math.min(contractBalance, reward)
//     oracleReward.should.be.bignumber.equal(amount)
//   })
// 
//   it('should pay out reward', async () => {
//     const dataSourceOriginalBalance = await web3.eth.getBalance(dataSource)
//     dataSourceOriginalBalance.should.be.bignumber.equal(web3.utils.toWei('1000000', 'ether'))
// 
//     await oracle.setResult(RESULT, {from: dataSource })
// 
//     const dataSourceBalance = await web3.eth.getBalance(dataSource)
//     '1000010'.should.be.bignumber.equal(web3.utils.fromWei(dataSourceBalance, 'ether'), 2, BigNumber.ROUND_UP)
//   })
// 
//   it('cannot pay out reward when the result was set twice', async () => {
//     await oracle.setResult(RESULT, {from: dataSource })
//     await expectRevert (
//       oracle.setResult(RESULT, { from: dataSource })
//     )
//   })
// 
//   it('isResultSet should be flipped after result was set', async () => {
//     let isResultSet = await oracle.isResultSet(0)
//     isResultSet.should.equal(false)
// 
//     await oracle.setResult(RESULT, {from: dataSource })
//     isResultSet = await oracle.isResultSet(0)
//     isResultSet.should.equal(true)
//   })
// })
