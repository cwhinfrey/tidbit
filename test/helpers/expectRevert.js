import { expect } from 'chai'
import asyncReturnErr from './asyncReturnErr'

export default async (asyncFn) => {
  const err = await asyncReturnErr(asyncFn)
  expect(
    typeof err !== 'undefined',
    'expected function to revert, but it succeeded'
  ).to.equal(true)
  if (typeof err !== 'undefined') {
    expect(
      err.message.search('revert') > -1,
      `expected error message "${err.message}" to contain "revert"`
    ).to.equal(true)
  }
}
