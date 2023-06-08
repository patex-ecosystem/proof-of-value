pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProofOfValueActivityMining is Ownable, ReentrancyGuard {

    IERC20 public _rewardToken;  
    uint256 public _lastBlock;

    mapping(address => uint256) public _balances;
    mapping(address => bool) public _blackList;

    event Claim(address indexed account, uint256 amount);

    constructor(address rewardToken) {
        _rewardToken = IERC20(rewardToken);
    }

    function rewardAccounts(
        address[] calldata accounts, 
        uint256[] calldata amounts, 
        uint256 blockNumber
    ) external onlyOwner {
        require(accounts.length == amounts.length, "different array length"); 
        require(blockNumber >= _lastBlock, "block data exists"); 

        uint256 total = 0;
        
        _lastBlock = blockNumber;

        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "zero address");
            _balances[accounts[i]] += amounts[i];
            total += amounts[i];
        }

        require(total <= _rewardToken.balanceOf(address(this)), "insufficient balance");
    }

    function claim() external nonReentrant {
        address sender = msg.sender; 

        require(_balances[sender] > 0, "0 balance"); 
        require(!_blackList[sender], "black list");

        uint256 claimAmount = _balances[sender];

        _balances[sender] = 0;
        _rewardToken.transfer(sender, claimAmount);

        emit Claim(sender, claimAmount);
    }

    function adminAddBlackList(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "zero address");
            _blackList[accounts[i]] = true;
        }
    }

    function adminRemoveBlackList(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "zero address");
            _blackList[accounts[i]] = false;
        }
    }
}