// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC6147.sol";

contract ERC6147Test is ERC721, IERC6147 {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    struct GuardInfo {
        address guard;
        uint64 expires;
    }

    mapping(uint256 => GuardInfo) internal _guardInfo;

    function changeGuard(uint256 tokenId, address newGuard, uint64 expires) public virtual {
        require(expires > block.timestamp, "ERC6147: invalid expires");
        _updateGuard(tokenId, newGuard, expires, false);
    }

    function removeGuard(uint256 tokenId) public virtual {
        _updateGuard(tokenId, address(0), 0, true);
    }

    function transferAndRemove(address from, address to, uint256 tokenId) public virtual {
        safeTransferFrom(from, to, tokenId);
        removeGuard(tokenId);
    }

    function guardInfo(uint256 tokenId) public view virtual override returns (address, uint64) {
        if (_guardInfo[tokenId].expires >= block.timestamp) {
            return (_guardInfo[tokenId].guard, _guardInfo[tokenId].expires);
        } else {
            return (address(0), 0);
        }
    }

    function updateGuard(uint256 tokenId, address newGuard, uint64 expires, bool allowNull) public {
        _updateGuard(tokenId, newGuard, expires, allowNull);
    }

    function checkGuard(uint256 tokenId) public view returns (address) {
        return _checkGuard(tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        address guard;
        address new_from = from;
        if (from != address(0)) {
            guard = _checkGuard(tokenId);
            new_from = ownerOf(tokenId);
        }
        if (guard == address(0)) {
            require(
                _isApprovedOrOwner(_msgSender(), tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
        }
        _transfer(new_from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
        address guard;
        address new_from = from;
        if (from != address(0)) {
            guard = _checkGuard(tokenId);
            new_from = ownerOf(tokenId);
        }
        if (guard == address(0)) {
            require(
                _isApprovedOrOwner(_msgSender(), tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
        }
        _safeTransfer(from, to, tokenId, _data);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override {
        (address guard,) = guardInfo(tokenId);
        super._burn(tokenId);
        delete _guardInfo[tokenId];
        emit UpdateGuardLog(tokenId, address(0), guard, 0);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC6147).interfaceId || super.supportsInterface(interfaceId);
    }

    function _updateGuard(uint256 tokenId, address newGuard, uint64 expires, bool allowNull) internal {
        (address guard,) = guardInfo(tokenId);
        if (!allowNull) {
            require(newGuard != address(0), "ERC6147: new guard can not be null");
        }
        if (guard != address(0)) {
            require(guard == _msgSender(), "ERC6147: only guard can change itself");
        } else {
            require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC6147: caller is not owner nor approved");
        }

        if (guard != address(0) || newGuard != address(0)) {
            _guardInfo[tokenId] = GuardInfo(newGuard, expires);
            emit UpdateGuardLog(tokenId, newGuard, guard, expires);
        }
    }

    function _checkGuard(uint256 tokenId) internal view returns (address) {
        (address guard, ) = guardInfo(tokenId);
        address sender = _msgSender();
        if (guard != address(0)) {
            require(guard == sender, "ERC6147: sender is not the guard of the token");
            return guard;
        } else {
            return address(0);
        }
    }
}
