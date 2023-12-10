// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ccmp606 is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable
{
    // price of NFT token
    uint private price;

    constructor(
        address initialOwner,
        uint newPrice
    ) ERC721("Ccmp606", "TKN") Ownable(initialOwner) {
        price = newPrice;
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public payable {
        require(msg.value >= price, "Not enough ETH");

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // gets price of NFT token
    function getPrice() public view returns (uint) {
        return price;
    }

    // owner sets price of NFT token
    function setPrice(uint newPrice) public onlyOwner {
        price = newPrice;
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
