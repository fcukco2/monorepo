import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { Button, Typography, Grid } from "@mui/material";

export default function ConnectWallet({
  connectWallet,
  networkError,
  dismiss,
  isConnected,
  disconnectWallet,
  balance,
}) {
  return (
    <Grid container justifyContent="flex-end">
      {!isConnected ? (
        <Grid container justifyContent="flex-end">
          <Button
            className="btn btn-primary"
            type="button"
            variant="contained"
            onClick={connectWallet}
            textAlign="right"
          >
            Connect Wallet
          </Button>
        </Grid>
      ) : (
        <Grid container justifyContent="flex-end">
          <Typography>{balance}</Typography>
          <Button
            className="btn btn-warning"
            type="button"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
