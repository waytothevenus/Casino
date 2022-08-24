import React, { useState } from "react";
import Ruleta from "./Roulette";
import styled from "@emotion/styled";
import { TextField, Grid, Typography, Button, Box } from "@mui/material";
import { useField } from "../hooks/useField";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import CustomColor from "./NeutralButton";
import contractsService from '../services/contractsService';
import { loadBalance } from "../reducers/balanceReducer";
import { async } from "regenerator-runtime";

const CButton = ({ value, amount, change }) => {
  return (
    <Button
      style={{
        width: "10%",
      }}
      size="large"
      sx={{ m: 0.5 }}
      variant="contained"
      color="warning"
      type="button"
      onClick={() => change(amount)}
    >
      {value}
    </Button>
  );
};

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#FFFFFF",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#FFFFFF",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#FFFFFF",
    },
    "&:hover fieldset": {
      borderColor: "#FFFFFF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFFFFF",
    },
    "&.MuiInputBase-root": {
      color: "white",
    },
  },
});

const SelectAmount = ({ betAmount, balance, onChangeBet, changeBet }) => {
  return (
    <Box>
      <Grid container spacing={{ xs: 1, md: 0 }}>
        <Grid item xs={12} md={4}>
          <Grid container alignItems="center" justifyContent="center">
            <CssTextField
              key={"hola"}
              size="normal"
              id="outlined-number"
              label="Amount of Tokens"
              type="number"
              color="secondary"
              value={betAmount}
              InputProps={{ inputProps: { min: 1 } }}
              onChange={onChangeBet}
              InputLabelProps={{
                style: {
                  color: "white",
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container alignItems="center" justifyContent="center">
            <CButton
              value={"+10"}
              change={changeBet}
              amount={parseInt(betAmount + 10)}
            />
            <CButton
              value={"+100"}
              change={changeBet}
              amount={parseInt(betAmount + 100)}
            />
            <CButton
              value={"+1000"}
              change={changeBet}
              amount={parseInt(betAmount + 1000)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container alignItems="center" justifyContent="center">
            <CButton
              value={"X2"}
              change={changeBet}
              amount={parseInt(betAmount * 2)}
            />
            <CButton
              value={"1/2"}
              change={changeBet}
              amount={parseInt(betAmount / 2)}
            />
            <CButton
              value={"MAX"}
              change={changeBet}
              amount={parseInt(balance)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const RouletteGame = () => {
  const balance = useSelector(({ balance }) => {
    return balance;
  });
  const account = useSelector(({ account }) => {
    return (
      account
    )
  })
  const dispatch = useDispatch()
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const betAmount = useField("");
  const start = useField("");
  const end = useField("");
  const [lastResult, setlastResult] = useState("");

  const onWheelStop= async()=>{
    setMustSpin(false)
    await dispatch(loadBalance(account))
    if (lastResult.result === true){
      toast.success(`Congratulations, you have earned ${lastResult.tokensEarned} tokens!!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }

  const handleSpinClick = async(event) => {
    event.preventDefault();
    if (betAmount.value === ""){
      toast.error(`Please select an amount of tokens to buy`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
    try{
      const result =await contractsService.playRoulette(start.value, end.value, betAmount.value)
      setlastResult(result)
      setPrizeNumber(result.numberWon)
      setMustSpin(true)
    }catch(error){
      toast.error(`An error has occurred please try again later`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }}

  };

  const changeNumberBet = (begin, final) => {
    start.change(begin);
    end.change(final);

  };

  const auxChange = (amount) => {
    if (amount > balance) {
      toast.warn(
        `The amount of tokens to bet cant be higher than your balance`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      betAmount.change(balance);
    } else {
      betAmount.change(amount);
    }
  };

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center"></Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="center">
          <Ruleta
            newPrizeNumber={prizeNumber}
            mustSpin={mustSpin}
            functionallity={()=> onWheelStop()}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSpinClick}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="center">
                <SelectAmount
                  balance={balance}
                  betAmount={betAmount.value}
                  changeBet={auxChange}
                  onChangeBet={betAmount.onChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={4}>
                  <Grid container alignItems="center" justifyContent="center">
                    <Button
                      style={{
                        width: "80%",
                      }}
                      variant="contained"
                      color="error"
                      type="submit"
                      onClick={()=>changeNumberBet(1,7)}
                    >
                      1-7
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="center" justifyContent="center">
                    <Button
                      style={{
                        width: "80%",
                      }}
                      variant="contained"
                      color="success"
                      type="submit"
                      onClick={()=>changeNumberBet(0,0)}
                    >
                      0
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="center" justifyContent="center">
                    <CustomColor
                      backGround={"#111111"}
                      text={"white"}
                      display={"8-14"}
                      size={"large"}
                      type={"submit"}
                      width={"80%"}
                      functionallity={()=>changeNumberBet(8,14)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default RouletteGame;
