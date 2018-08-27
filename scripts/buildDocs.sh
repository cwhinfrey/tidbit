rm -rf docs/docs
mkdir docs/docs
SOLC_ARGS='openzeppelin-solidity=$PWD/node_modules/openzeppelin-solidity' \
npx solidity-docgen ./ ./contracts --exclude ./Mocks ./docs
