// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Registry is Ownable {

    address [] public allProjectTokens;
    mapping(string => address []) public projectTokensByCountry;
    mapping(string => address []) public projectTokensByCategory;

    constructor(){}

    function addAllProjectTokens(address [] memory projectTokens) external onlyOwner {
        allProjectTokens = projectTokens;
    }

    function addProjectTokenByCountry(string memory countryCode, address [] memory projectTokens) external onlyOwner {
        projectTokensByCountry[countryCode] = projectTokens;
    }

    function addProjectTokenByCategory(string memory category, address [] memory projectTokens) external onlyOwner {
        projectTokensByCategory[category] = projectTokens;
    }

    function getProjectTokenByCountry(string memory country) external view returns (address [] memory) {
        return projectTokensByCountry[country];
    }

    function getProjectTokenByCategory(string memory category) external view returns (address [] memory) {
        return projectTokensByCategory[category];
    }

    function findBestProjectTokens(string memory filter) external view returns (address [] memory) {
        uint filterLength = _strlen(filter);
        if (filterLength == 0) {
            return allProjectTokens;
        }
        require(filterLength == 5, "Invalid filter");
        string memory countryCode = _substring(filter, 0, 2);
        string memory category = _substring(filter, 2, 5);

        string memory emptyCategory = "XXX";
        string memory emptyCountry = "XX";

        if (keccak256(abi.encodePacked(category)) == keccak256(abi.encodePacked(emptyCategory))) {
            return projectTokensByCountry[countryCode];
        }

        if (keccak256(abi.encodePacked(countryCode)) == keccak256(abi.encodePacked(emptyCountry))) {
            return projectTokensByCategory[category];
        }

        address [] memory projectTokens = projectTokensByCountry[countryCode];
        address [] memory projectTokensByCategory = projectTokensByCategory[category];
        return _intersectArrays(projectTokens, projectTokensByCategory);
    }

    function _substring(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function _strlen(string memory s) internal pure returns (uint256) {
        uint256 len;
        uint256 i = 0;
        uint256 bytelength = bytes(s).length;
        for (len = 0; i < bytelength; len++) {
            bytes1 b = bytes(s)[i];
            if (b < 0x80) {
                i += 1;
            } else if (b < 0xE0) {
                i += 2;
            } else if (b < 0xF0) {
                i += 3;
            } else if (b < 0xF8) {
                i += 4;
            } else if (b < 0xFC) {
                i += 5;
            } else {
                i += 6;
            }
        }
        return len;
    }

    /**
   * Returns the intersection of two arrays. Arrays are treated as collections, so duplicates are kept.
   * @param A The first array
   * @param B The second array
   * @return The intersection of the two arrays
   */
    function _intersectArrays(address[] memory A, address[] memory B) internal pure returns (address[] memory) {
        uint length = A.length;
        bool[] memory includeMap = new bool[](length);
        uint newLength = 0;
        for (uint i = 0; i < length; i++) {
            if (_contains(B, A[i])) {
                includeMap[i] = true;
                newLength++;
            }
        }
        address[] memory newAddresses = new address[](newLength);
        uint j = 0;
        for (uint i = 0; i < length; i++) {
            if (includeMap[i]) {
                newAddresses[j] = A[i];
                j++;
            }
        }
        return newAddresses;
    }

    function _contains(address[] memory A, address a) internal pure returns (bool) {
        (, bool isIn) = indexOf(A, a);
        return isIn;
    }

    function indexOf(address[] memory A, address a) internal pure returns (uint256, bool) {
        uint256 length = A.length;
        for (uint256 i = 0; i < length; i++) {
            if (A[i] == a) {
                return (i, true);
            }
        }
        return (0, false);
    }

}
