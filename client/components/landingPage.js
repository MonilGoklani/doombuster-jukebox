import React from "react";
import { connect } from "react-redux";
import { authenticate } from "../store";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { grey, deepPurple, amber } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import axios from "axios";
import { Border } from "styled-icons/bootstrap";
import { PersonAddDisabled } from "@material-ui/icons";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: amber[500],
      contrastText: deepPurple[900],
    },
  },
});

const styles = (theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "60vh",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  radioButton: {
    display: "flex",
    justifyContent: "center",
    color: "white",
  },
  button: {
    margin: "1rem",
    width: "100px",
    backgroundColor: "#34ebe5",
    color: "black",
  },
  root: {
    color: "white",
  },
  textfield: {
    border: "1px dashed #34ebe5",
    padding: "5px",
    borderRadius: "5px",
  },
});

/**
 * COMPONENT
 */
class LandingPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      roomOption: "",
      roomOptionSelected: 0,
      roomCode: 0,
      formName: "login",
      roomAlreadyExists: 0,
      roomDoesNotExist: 0,
    };
    this.selectRoomOption = this.selectRoomOption.bind(this);
    this.selectFormName = this.selectFormName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitRoomOption = this.submitRoomOption.bind(this);
  }

  selectRoomOption(ev) {
    const roomOption = ev.target.value;
    this.setState({ roomOption });
  }

  selectFormName(ev) {
    ev.preventDefault();
    const formName = ev.target.value;
    this.setState({ formName });
  }

  async handleChange(ev) {
    const roomCode = ev.target.value;
    this.setState({ roomCode });
  }

  async submitRoomOption(roomCode) {
    try {
      this.setState({ roomOptionSelected: 1 });
      this.setState({ roomAlreadyExists: 0 });
      this.setState({ roomDoesNotExist: 0 });
      const res = (await axios.get(`/api/room/${roomCode}`)).data;
      if (this.state.roomOption === "newRoom" && res.roomId) {
        this.setState({ roomOptionSelected: 0 });
        this.setState({ roomCode: 0 });
        this.setState({ roomAlreadyExists: 1 });
      }
    } catch (ex) {
      if (this.state.roomOption === "enterRoom") {
        this.setState({ roomDoesNotExist: 1 });
        this.setState({ roomCode: 0 });
        this.setState({ roomOptionSelected: 0 });
      }
    }
  }

  render() {
    const { handleSubmit, error, classes } = this.props;
    const { selectRoomOption, selectFormName, handleChange, submitRoomOption } =
      this;
    const {
      roomOption,
      roomCode,
      formName,
      roomOptionSelected,
      roomAlreadyExists,
      roomDoesNotExist,
    } = this.state;
    return (
      <div className={classes.main}>
        <div id="appname">Doombuster</div>
        <p id="icon">h</p>
        {/* <img className = 'background-image' src ='../background.jpg' /> */}
        {!roomOptionSelected ? (
          <div id="form" className={classes.form}>
            <div className={classes.radioButton}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  onChange={selectRoomOption}
                  defaultValue={roomOption}
                >
                  <FormControlLabel
                    value="enterRoom"
                    control={<Radio style={{ color: "#f50057" }} />}
                    label="Enter Existing Room"
                  />
                  <FormControlLabel
                    value="newRoom"
                    control={<Radio style={{ color: "#f50057" }} />}
                    label="Create New Room"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            {roomOption ? (
              <div className={classes.textfield}>
                <TextField
                  style={{ textAlign: "center" }}
                  value={roomCode !== 0 ? roomCode : ""}
                  label="Enter Room Code"
                  onChange={(ev) => handleChange(ev)}
                />
              </div>
            ) : null}
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={() => submitRoomOption(roomCode)}
            >
              SUBMIT
            </Button>
            <FormHelperText className={classes.root}>
              {roomAlreadyExists
                ? "Room Code Already Exists, Please Enter A Different Code"
                : ""}
            </FormHelperText>
            <FormHelperText className={classes.root}>
              {roomDoesNotExist ? "Invalid Room Code" : ""}
            </FormHelperText>
          </div>
        ) : null}
        {roomOptionSelected ? (
          <form
            onSubmit={(ev) => handleSubmit(ev, roomOption, roomCode, formName)}
          >
            <div className={classes.form}>
              {/* {error?<TextField style={{textAlign:'center'}} value={roomCode!==0?roomCode:''} label='Enter Room Code' onChange={(ev)=>handleChange(ev)}/>:''} */}
              <TextField label="Enter Username" name="username" type="text" />
              <TextField
                label="Enter Password"
                name="password"
                type="password"
              />
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                type="submit"
                value={formName}
              >
                {formName === "signup" ? "Sign Up" : "Login"}
              </Button>
              <p>
                {formName === "signup"
                  ? "Already have an account?"
                  : "Dont have an account?"}{" "}
                <button
                  value={formName === "login" ? "signup" : "login"}
                  onClick={selectFormName}
                >
                  {formName === "signup" ? "Login" : "Register"}
                </button>
              </p>
              <FormHelperText className={classes.root}>
                {error && error.response && <div> {error.response.data} </div>}
              </FormHelperText>
            </div>
          </form>
        ) : null}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt, roomOption, roomCode, formName) {
      evt.preventDefault();
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      dispatch(
        authenticate(username, password, formName, roomCode, roomOption)
      );
    },
    async findRoom(roomCode) {
      console.log("roomCode", roomCode);
      const res = await axios.get(`/api/room/${roomCode}`);
    },
  };
};

export default withStyles(
  styles,
  theme
)(connect(mapState, mapDispatch)(LandingPage));
