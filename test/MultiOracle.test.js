import expectRevert from './helpers/expectRevert'
import expectEvent from './helpers/expectEvent'
import { web3 } from './helpers/w3'

const MultiOracle = artifacts.require('MultiOracle')

const BigNumber = web3.BigNumber;

const should = require('chai')
	.use(require('chai-bignumber')(BigNumber))
	.should();

const RESULT = 'hello multiOracle'

contract('MultiOracle', (accounts) => {
	it('requires a non-null dataSource', async () => {
		const oracle = await MultiOracle.new()
	})
})