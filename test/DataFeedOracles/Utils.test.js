const { padLeft, BN} = web3.utils

function numberToBytes32(number) {
  return padLeft(number, 64)
}

function bytes32ToNumString(bytes32str) {
    bytes32str = bytes32str.replace(/^0x/, '');
    var bn = new BN(bytes32str, 16).fromTwos(256);
    return bn.toString();
}

function getMedian(array) {
  const len = array.length;
  return len % 2 == 0 ? (array[len/2] + array[len/2 - 1]) / 2 : array[len/2]
}

module.exports = {
  bytes32ToNumString,
  getMedian,
  numberToBytes32
}
