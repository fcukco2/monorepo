import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ConnectWallet from "../ConnectWallet";
import { ethers } from "ethers";
import CO2Burner from "../../contracts/CO2Burner.json";
import contractAddress from "../../contracts/contract-address.json";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

// The next two methods are needed to start and stop polling data. While
// the data being polled here is specific to this example, you can use this
// pattern to read any data from your contracts.
//
// Note that if you don't need it to update in near real time, you probably
// don't need to poll it. If that's the case, you can just fetch it when you
// initialize the app, as we do with the token data.
const HARDHAT_NETWORK_ID = "80001";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.title = props.title;
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      isConnected: false,
    };

    this.state = this.initialState;
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._startPollingData();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this.co2Burner = new ethers.Contract(
      contractAddress.CO2Burner,
      CO2Burner.abi,
      this._provider.getSigner(0)
    );

    this.setState({ isConnected: true });
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    this._checkNetwork();

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  async _updateBalance() {
    const balance = await this._provider.getBalance(this.state.selectedAddress);
    this.setState({ balance: ethers.utils.formatEther(balance) });
  }

  async _switchChain() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  // This method checks if the selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      this._switchChain();
    }
  }

  render() {
    return (
      <AppBar
        position="static"
        color="primary"
        style={{ background: "#fff", color: "#000" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Grid container justifyContent="flex-start" alignItems="center" style={{paddingLeft: '24px'}}>
              <img src={'/co2terminator.png'} style={{width: '55px', marginRight: '10px'}}/>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  display: { md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                CO2 Terminator
              </Typography>
            </Grid>
            <Grid container justifyContent="flex-end">
              <ConnectWallet
                connectWallet={() => this._connectWallet()}
                networkError={this.state.networkError}
                dismiss={() => this._dismissNetworkError()}
                isConnected={this.state.isConnected}
                disconnectWallet={() => this._disconnectWallet()}
                balance={this.state.balance}
              />
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
}

export default Header;
