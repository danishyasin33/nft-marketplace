// Developers: 
// - @danish - 000508255
// - @maryam - 000516079

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Saskpolytech is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    // price of NFT token
    uint private price;

    // sets price of NFT
    constructor(uint newPrice) ERC721("saskpolytech", "YQR") {
        price = newPrice;
    }

    // Mints NFT token
    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        payable
    {
        require(msg.value >= price, "Not enough ETH");

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }


    // gets price of NFT token
    function getPrice () public view returns (uint) {
        return price;
    }

    // owner sets price of NFT token
    function setPrice (uint newPrice) public onlyOwner {
        price = newPrice;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // used to burn NFT token
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // used to get token URI
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}