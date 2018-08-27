import expectRevert from './helpers/expectRevert'
import expectEvent from './helpers/expectEvent'
import { web3 } from './helpers/w3'

const PaidOracle = artifacts.require('PaidOracle')
const BigNumber = web3.BigNumber
const toBN = web3.utils.toBN

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
	beforeEach(async ()=> {
		oracle = await PaidOracle.new(dataSource, reward, {value: contractBalance})
	})

	it('requires a non-null dataSource', async () => {
		await expectRevert(
			PaidOracle.new(ZERO_ADDRESS, reward)
		)
	})

	it('Reward should be the contract balance if its less than the reward, otherwise return reward itself.', async () => {
		const contractBalance = await web3.eth.getBalance(oracle.address)
		const oracleReward = await oracle.getReward()
		const amount = Math.min(contractBalance, reward)
		oracleReward.should.be.bignumber.equal(amount)
	})

	it('cannot pay out reward when the result was set twice', async () => {
	  await oracle.setResult(RESULT, {from: dataSource })
	  await expectRevert (
	  	oracle.setResult(RESULT, { from: dataSource })
	  )
	})

})