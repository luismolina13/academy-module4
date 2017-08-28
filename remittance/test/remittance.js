var Remittance = artifacts.require("./Remittance.sol");

contract('Remittance', function(accounts) {


  it("should send the eth to carol if both passwords are correct", function() {
    var remittance;
    var alice = accounts[0];
    var bob = accounts[1];
    var carol = accounts[2];

    var bobPwd = web3.sha3("hello");
    var carolPwd = web3.sha3("world");
    var alicePwd = web3.sha3(bobPwd, carolPwd);

    var amount = web3.toWei(20);
    var expectedBalanceCarol = web3.eth.getBalance(carol).toNumber() + amount;
    console.log(alicePwd);

    return Remittance.deployed().then(function(instance) {
      remittance = instance;
      return remittance.setPassword(alicePwd, {from: alice});
    }).then(function(txInfo) {
      return remittance.deposit({
        from: alice,
        value: amount
      });
    }).then(function(txInfo) {
      assert(web3.eth.getBalance(remittance.address).toNumber(), amount);
      return remittance.withdraw(alice, bobPwd, carolPwd, {from: carol});
    }).then(function(txInfo) {
      assert(web3.eth.getBalance(carol).toNumber(), expectedBalanceCarol);
    });
  });
});
