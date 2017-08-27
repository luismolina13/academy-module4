pragma solidity ^0.4.6;

contract Splitter {

    mapping (address => Split) splitMetadata;
    mapping (address => bool) participants;

    struct Split {
        address beneficiaryOne;
        address beneficiaryTwo;
    }

	event SplitRegistered(address from, address one, address two);
	event EtherSplit(address from, address one, address two, uint amount);

	function registerSplit(address beneficiaryOne, address beneficiaryTwo) {

	    Split memory split;
        split.beneficiaryOne = beneficiaryOne;
        split.beneficiaryTwo = beneficiaryTwo;

	    splitMetadata[msg.sender] = split;
	    participants[msg.sender] = true;

	    SplitRegistered(msg.sender, beneficiaryOne, beneficiaryTwo);
	}

	function sendSplit() payable {
	    require(participants[msg.sender]);
	    require(msg.value > 0);

	    uint amount = msg.value / 2;
	    Split memory split = splitMetadata[msg.sender];

	    split.beneficiaryOne.transfer(amount);
	    split.beneficiaryTwo.transfer(amount);

	    EtherSplit(msg.sender, split.beneficiaryOne, split.beneficiaryTwo,
	        amount);
	}
}
