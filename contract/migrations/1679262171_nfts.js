var types = artifacts.require("Saskpolytech");
module.exports = function (_deployer) {
  _deployer.deploy(types, 2);
  // Use deployer to state migration tasks.
};
