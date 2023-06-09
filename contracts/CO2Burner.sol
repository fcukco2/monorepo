// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Registry.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/INatureCarbonTonne.sol";
import "./interfaces/ITCO2.sol";

contract CO2Burner {
    Registry public immutable registry;
    IERC20 public immutable stablecoin;
    IUniswapV2Router02 public immutable dexRouter;
    address public immutable nctToken;

    event Retired(address indexed retiree, address indexed token, uint tcoAmount, uint usdcAmount);

    constructor(address _registry, address _stablecoin, address _nctToken, address _dexRouter) {
        registry = Registry(_registry);
        stablecoin = IERC20(_stablecoin);
        nctToken = _nctToken;
        dexRouter = IUniswapV2Router02(_dexRouter);
    }

    function burnProjectToken(address projectToken, uint stableCoinAmount) external returns (uint tco2AmountBurned, uint usdcAmountBurned){
        address[] memory path = new address[](2);
        path[0] = address(stablecoin);
        path[1] = address(nctToken);

        uint[] memory amounts = dexRouter.getAmountsOut(stableCoinAmount, path);
        uint amountIn = amounts[0];
        uint amountOut = amounts[1];

        stablecoin.transferFrom(msg.sender, address(this), stableCoinAmount);
        stablecoin.approve(address(dexRouter), amountIn);
        dexRouter.swapExactTokensForTokens(stableCoinAmount, amountOut, path, address(this), block.timestamp);

        uint[] memory redeemAmounts = new uint[](1);
        redeemAmounts[0] = amountOut;

        address[] memory tco2s = new address[](1);
        tco2s[0] = projectToken;
        INatureCarbonTonne(nctToken).redeemMany(tco2s, redeemAmounts);
        uint projectTokenBalance = IERC20(projectToken).balanceOf(address(this));

        ITCO2(projectToken).retire(projectTokenBalance);
        emit Retired(msg.sender, projectToken, projectTokenBalance, stableCoinAmount);
        return (projectTokenBalance, stableCoinAmount);
    }

}
