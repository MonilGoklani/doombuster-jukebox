//https://opentdb.com/api.php?amount=50

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { page } from "../store/page";
import { me } from "../store/auth";

import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";

import { Button } from "@material-ui/core";
import axios from "axios";

const StyledButton = withStyles({
  root: {
    color: "white",
    backgroundColor: "black",
    border: '1px solid white',
    "&:hover": {
      backgroundColor: "white",
      color:'black'
    },
  },
  disabled :{
    color:"black",
    backgroundColor: 'grey'
  }
})(Button);

const StyledRadio = withStyles({
  root: {
    margin: "0",
    color: "white",
    padding: "0",
    fontFamily: "JMH",
  },
})(Radio);

export const Trivia = (props) => {
  // const [data,setData] = useState([])
  const [question, setQuestion] = useState({});
  const [score, setScore] = useState(0);
  const [radioValue, setRadioValue] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [retries, setRetries] = useState(0)
  const [open, setOpen] = useState(false);
  const [answerArray, setAnswerArray] = useState([]);
  const { username, room, setPage } = props;
  const totalRetries = 3
  

  useEffect(() => {
    setPage();
    loadQuestions();
  }, []);

  // console.log("SCORE", score);
  // console.log("GAMEWON", gameWon);
  function convertHTML(str) {
    let regex = /&quot;|&amp;|&#039;|&lt;|&gt;|&eacute;/g;
    return str.replace(regex, function (match, numStr) {
      switch (match) {
        case "&quot;":
          return '"';
        case "&amp;":
          return "&";
        case "&#039;":
          return "'";
        case "&lt;":
          return "<";
        case "&gt;":
          return ">";
        case "&eacute;":
          return "é";
        default:
          return "";
      }
    });
  }

  function loadQuestions() {
    axios
      .get(
        "https://opentdb.com/api.php?amount=50&category=12&difficulty=easy&type=multiple"
      )
      .then((response) => {
       // console.log(`data`, response.data.results);
        const num = Math.floor(Math.random() * 50);
        const question = response.data.results[num];
        console.log(`question: `, question);

        let answers = [convertHTML(question.correct_answer)];
        for (let i = 0; i < question.incorrect_answers.length; i++) {
          answers.push(convertHTML(question.incorrect_answers[i]));
        }

        for (let i = 0; i < answers.length; i++) {
          let randomNum = Math.floor(Math.random() * i);
          const temp = answers[i];
          answers[i] = answers[randomNum];
          answers[randomNum] = temp;
        }
        setQuestion(question);
        setAnswerArray(answers);
        setRadioValue("");
      });
  }

  const handleNext = async () => {
    if (question.correct_answer === radioValue.response) {
      setScore(score + 1);
      if (score >= 2) {
        let updatedUser = (
          await axios.put(`/api/users/${room}`, { username, gameWon: true })
        ).data;
        localStorage.setItem("vetoUsed", "0");
        setGameWon(true);
        setScore(0);
        if (updatedUser.gameWon === true) {
          props.updateWinner();
        }
      }
    } else {
      handleLoserPop();
      setScore(0);
      setRetries(retries+1)
      //console.log('RETRIES',retries)
    }
    loadQuestions();
  };

  const handleRadioChange = (ev) => {
    const response = ev.target.value;
    setRadioValue({ response });
  };

  const renderFeedback = () => {
    switch (score) {
      case 0:
        return "";
      case 1:
        return "Correct";
      case 2:
        return "One More";
      default:
        return "";
    }
  };

  const handleLoserPop = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const close = (retries) => {
    console.log('Retries',retries)
    if(retries>=totalRetries){
      localStorage.setItem("vetoUsed", "1")
    }
    props.close(props.room);
  };

  if (Object.keys(question).length !== 0) {
    question.question = convertHTML(question.question);
    question.correct_answer = convertHTML(question.correct_answer);
    question.incorrect_answers = question.incorrect_answers.map(
      (incorrect_answer) => {
        return convertHTML(incorrect_answer);
      }
    );
  }

  return (
    <div id='trivia-container'>
      {(!gameWon && retries<totalRetries)?<h2 id="trivia-instructions">answer 3 in a row to veto a song</h2>:""}
      <div id="trivia-master">
        {gameWon ? (
          <div className="activeTrivia">
            <h2>You Won! You can veto one song. Veto wisely.</h2>
            <StyledButton onClick={() => close(retries)}>Got it</StyledButton>
          </div>
        ) : retries>=totalRetries?(
          <div className="activeTrivia">
          <h2>Out Of Retries! Better Luck Next Time</h2>
          <StyledButton onClick={() => close(retries)}>Got it</StyledButton>
        </div>
        ):
        (
          <div className="activeTrivia">
            <h2>{question.question}</h2>
            <div id="answerAndScore">
              <form>
                <FormControl component="fieldset">
                  <RadioGroup
                    onChange={handleRadioChange}
                    defaultValue={radioValue}
                  >
                    {answerArray.map((answer, idx) => {
                      return (
                        <FormControlLabel
                          id='answers-options'
                          key={idx}
                          value={answer}
                          control={<StyledRadio />}
                          label={answer}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </form>
              <div id="score-div">
                <h2>SCORE</h2>
                <h2 id="score-board">{score}</h2>
                <h6 style={{ color: "#fe019a" }}>{renderFeedback()}</h6>
              </div>
            </div>
            <StyledButton disabled={!radioValue} onClick={() => handleNext()}>
              Next
            </StyledButton>
          </div>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="confirm-add-song"
          aria-describedby="confirm-add-song"
        >
          <DialogTitle id="error-repeat">Incorrect! You Have {totalRetries-retries} Retries Remaining.</DialogTitle>
        </Dialog>
      </div>
    </div>
  );
};

const mapState = (state, otherProps) => {
  //console.log(`state`, state);
  return {
    userId: state.auth.id,
    username: state.auth.username,
    room: otherProps.match.params.id,
    page: state.page,
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    updateWinner: () => dispatch(me()),
    setPage: () => dispatch(page()),
    close: (room) => history.push(`/home/${room}`),
  };
};

export default connect(mapState, mapDispatch)(Trivia);
