// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract RoyaltyNftTest is ERC721Royalty {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }
    // Expose the internal function _setDefaultRoyalty as an external function for testing
    function setDefaultRoyaltyForTest(address receiver, uint96 feeNumerator) external {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // Expose the internal function _setTokenRoyalty as an external function for testing
    function setTokenRoyaltyForTest(uint256 tokenId, address receiver, uint96 feeNumerator) external {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // Expose the internal function _resetTokenRoyalty as an external function for testing
    function resetTokenRoyaltyForTest(uint256 tokenId) external {
        _resetTokenRoyalty(tokenId);
    }
}
