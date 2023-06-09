// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockSubgraph {
    event Retired(address indexed retiree, address indexed token, uint tcoAmount, uint usdcAmount);

    constructor() {
      emit Retired(msg.sender, 0x62896F42CF1371B268Db56E50D67C34F3eb1aD7a, 1e18, 2e6);
      emit Retired(msg.sender, 0xB8802C009dd265B38E320214a7720EBd7A488827, 2e18, 4e6);
      emit Retired(msg.sender, 0xB00110CC12cDC8F666f33F4e52e4957Ff594282f, 4e18, 16e6);
    }

    function emitEvent(address retiree, address token, uint tcoAmount, uint usdcAmount) public returns (bool) {
      emit Retired(retiree, token, tcoAmount, usdcAmount);
      return true;
    }

}