// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
// 以下は、ERC721Royaltyを継承した新しいコントラクトを作成します。
contract RoyaltyNft is ERC721Royalty {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }
}
