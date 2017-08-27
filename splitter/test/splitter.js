var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

  it("should split the ether between two accounts", function() {
    var splitter;
    var alice = accounts[0];
    var bob = accounts[1];
    var carol = accounts[2];

    var amount = web3.toWei(20);
    var expectedBalanceBob = web3.eth.getBalance(bob).toNumber() + amount / 2;
    var expectedBalanceCarol = web3.eth.getBalance(carol).toNumber() + amount / 2;

    return Splitter.deployed().then(function(instance) {
      splitter = instance;
      return splitter.registerSplit(bob, carol, {from: alice});
    }).then(function(txInfo) {
      return splitter.sendSplit({
        from: alice,
        value: amount
      });
    }).then(function(txInfo) {
      assert.equal(web3.eth.getBalance(bob).toNumber(), expectedBalanceBob);
      assert.equal(web3.eth.getBalance(carol).toNumber(), expectedBalanceCarol);
    });
  });
});
