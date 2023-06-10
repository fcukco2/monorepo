import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import CO2Burner from "../../contracts/CO2Burner.json";
import contractAddress from "../../contracts/contract-address.json";
import usdc from "../../contracts/usdc.json";
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
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const HARDHAT_NETWORK_ID = "80001";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.title = props.title;
    this.initialState = {
      tokenData: undefined,
      selectedAddress: undefined,
      balance: undefined,
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
    this.setState({
      selectedAddress: userAddress,
    });
    this._initializeEthers();
    this._startPollingData();
  }

  async _initializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this.co2Burner = new ethers.Contract(
      contractAddress.CO2Burner,
      CO2Burner.abi,
      this._provider.getSigner(0)
    );

    this.usdc = new ethers.Contract(
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      usdc,
      this._provider.getSigner(0)
    );

    this.setState({ isConnected: true });
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    this._checkNetwork();
    this._initialize(selectedAddress);
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
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

  async handleRetire() {
    await this._connectWallet();
    const amountEth = this.state.amount * 10 ** 6;
    const approvedAmount = await this.usdc.allowance(
      this.selectedAddress,
      contractAddress.CO2Burner
    );
    if (approvedAmount < amountEth) {
      const approval = await this.usdc.approve(
        contractAddress.CO2Burner,
        amountEth
      );
      await approval.wait();
      console.log("Approval tx hash: " + approval.hash);
    }
    const tx = await this.co2Burner.burnCO2(
      this.state.amount,
      this.state.countryFilter + this.state.categoryFilter
    );
    await tx.wait();
    console.log("Burner tx hash: " + tx.hash);
    this.setState({ open: false });
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
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              style={{ paddingLeft: "24px" }}
            >
              <img
                src={"/co2terminator.png"}
                style={{ width: "55px", marginRight: "10px" }}
              />
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
                CO₂ Terminator
              </Typography>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => this.handleClickOpen()}
              >
                Retire
              </Button>
            </Grid>
          </Toolbar>
        </Container>
        <Dialog open={this.state.open} onClose={() => this.handleClose()}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To retire tonnes of CO₂, please enter the amount and provide
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
            <Button variant="contained" onClick={() => this.handleRetire()}>
              Retire
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    );
  }
}

export default Header;
