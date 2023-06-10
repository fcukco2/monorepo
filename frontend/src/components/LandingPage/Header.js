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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

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
      open: false,
      categoryFilter: "XXX",
      countryFilter: "XX",
      amount: 0,
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

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleChangeCategory(event) {
    this.setState({ categoryFilter: event.target.value });
  }

  handleChangeCountry(event) {
    this.setState({ countryFilter: event.target.value });
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
            <Grid container justifyContent="flex-start">
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
              <Button onClick={() => this.handleClickOpen()}>Retire</Button>
            </Grid>
          </Toolbar>
        </Container>
        <Dialog open={this.state.open} onClose={() => this.handleClose()}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To retire tonnes of CO2, please enter the amount and provide
              optional filters.
            </DialogContentText>
            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Amount USDC"
                type="number"
                fullWidth
                variant="standard"
              />
            </FormControl>
            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <InputLabel id="demo-simple-select-label">Country</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.countryFilter}
                label="Country"
                onChange={(e) => this.handleChangeCountry(e)}
              >
                <MenuItem value={"XX"}>None</MenuItem>
                <MenuItem value={"BR"}>Brazil</MenuItem>
                <MenuItem value={"CD"}>Democratic Republic of Congo</MenuItem>
                <MenuItem value={"KH"}>Cambodia</MenuItem>
                <MenuItem value={"CN"}>China</MenuItem>
                <MenuItem value={"CO"}>Columbia</MenuItem>
                <MenuItem value={"CG"}>Congo</MenuItem>
                <MenuItem value={"ID"}>Indonesia</MenuItem>
                <MenuItem value={"KE"}>Kenya</MenuItem>
                <MenuItem value={"PE"}>Peru</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.categoryFilter}
                label="Category"
                onChange={(e) => this.handleChangeCategory(e)}
              >
                <MenuItem value={"XXX"}>None</MenuItem>
                <MenuItem value={"SOC"}>Soil Carbon</MenuItem>
                <MenuItem value={"ENE"}>Energy</MenuItem>
                <MenuItem value={"FOR"}>Forestry</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()}>Cancel</Button>
            <Button variant="contained" onClick={() => this.handleClose()}>
              Retire
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    );
  }
}

export default Header;
