import { expect } from 'chai'

export async function expectEvent (eventName, asyncFn) {
  const txResult = await asyncFn
  expect(hasEvent(txResult, eventName)).to.equal(true)
}

export function hasEvent (txResult, eventName) {
  const { logs } = txResult
  const event = logs.find(e => e.event === eventName)
  return typeof event !== 'undefined'
}
