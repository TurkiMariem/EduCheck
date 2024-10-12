module.exports = {
  contracts_build_directory: "../web_app/src/contracts",
  networks: {
    develop: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      gas: 6721975,          // Gas limit - you can adjust this based on your needs
    }, 
  },
  mocha: {
    // timeout: 100000
  },
  // Confiure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
       settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 5000
        }
      //  evmVersion: "byzantium"
       }
    }
  },
};
  
