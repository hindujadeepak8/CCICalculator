import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";

export default function App() {
  const [loadedCost, setLoadedCost] = useState("");
  const [billRate, setBillRate] = useState("");
  const [optionalLoad, setOptionalLoad] = useState(""); // percentage

  // Parse numbers for calculations. Empty optionalLoad is allowed.
  const loadedCostNum = parseFloat(loadedCost) || 0;
  const billRateNum = parseFloat(billRate) || 0;
  const optionalLoadNum =
    optionalLoad === "" ? null : Math.min(parseFloat(optionalLoad), 100); // protect from >100

  // Calculation logic
  let cci = "";
  if (billRateNum > 0) {
    let optionalLoadValue =
      optionalLoadNum !== null
        ? (optionalLoadNum / 100) * billRateNum
        : 0;

    let numerator =
      billRateNum - loadedCostNum - optionalLoadValue;
    cci = (numerator / billRateNum) * 100;
    cci = isNaN(cci) ? "" : cci.toFixed(2);
  }

  const formBoxStyle = {
    padding: 4,
    background: "#fff",
    borderRadius: 2,
    boxShadow: 3,
    minWidth: 350,
    marginTop: 8,
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          bgcolor: "#1976d2",
          color: "#fff",
          p: 3,
          textAlign: "center",
          mb: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          CCI Calculator
        </Typography>
      </Box>
      <Paper elevation={4} sx={formBoxStyle}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Loaded Cost Rate"
            value={loadedCost}
            onChange={(e) => {
              // Numbers and one dot, max 2 decimals
              let value = e.target.value.replace(/[^0-9.]/g, "");
              value = value.replace(/(\..*)\./g, "$1"); // only one '.'
              if (value.includes(".")) {
                const [intPart, decPart] = value.split(".");
                value = intPart + "." + (decPart || "").slice(0, 2);
              }
              setLoadedCost(value);
            }}
            placeholder="0.00"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{
              inputMode: "decimal",
              pattern: "^\\d+(\\.\\d{0,2})?$",
            }}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Bill Rate"
            value={billRate}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9.]/g, "");
              value = value.replace(/(\..*)\./g, "$1");
              if (value.includes(".")) {
                const [intPart, decPart] = value.split(".");
                value = intPart + "." + (decPart || "").slice(0, 2);
              }
              setBillRate(value);
            }}
            placeholder="0.00"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{
              inputMode: "decimal",
              pattern: "^\\d+(\\.\\d{0,2})?$",
            }}
            variant="outlined"
          />
        </Box>

        {/* Optional Load Percentage */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Optional Load (percent)"
            value={optionalLoad}
            onChange={(e) => {
              // Allow only numbers and one dot, up to 2 decimals, max 100
              let value = e.target.value.replace(/[^0-9.]/g, "");
              value = value.replace(/(\..*)\./g, "$1");
              if (value.includes(".")) {
                const [intPart, decPart] = value.split(".");
                value = intPart + "." + (decPart || "").slice(0, 2);
              }

              // Optionally, clamp max value to 100
              if (parseFloat(value) > 100) value = "100";
              setOptionalLoad(value);
            }}
            placeholder="e.g. 8"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">%</InputAdornment>
              ),
            }}
            inputProps={{
              inputMode: "decimal",
              pattern: "^\\d{0,3}(\\.\\d{0,2})?$",
              min: 0,
              max: 100,
            }}
            variant="outlined"
            helperText="Leave blank for no optional load"
          />
        </Box>

        <Box mt={3}>
          <Typography
            variant="h6"
            color="primary"
          >
            CCI:{" "}
            <span style={{ fontWeight: 600 }}>
              {billRate && loadedCost ? `${cci} %` : "--"}
            </span>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
