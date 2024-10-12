const Institute = artifacts.require("Institute.sol");
const Conference = artifacts.require("Conference.sol");

module.exports = function (deployer) {
  deployer.deploy(Institute);
  deployer.deploy(Conference);
};
