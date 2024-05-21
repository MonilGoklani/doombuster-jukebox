import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import queue, { fetchQueue } from "../store/queue";
import { updateVote } from "../store/vote";
import {page} from '../store/page'
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import {
  ThumbUp,
  ThumbDown,
  ThumbUpSelected,
  ThumbDownSelected,
} from "./styledIcon";


// const styles = () => ({
//   root: {
//     backgroundColor: "black",
//     // backgroundColor:'#140e2b',
//     color: "white",
//     overflow: "hidden",
//     // width:'100%',
//     boxShadow: "0 3px 8px rgb(52 235 229 / 50%)",
//     fontFamily: "Gazelle",
//     // fontSize: "1.8em",
//     maxHeight: "3rem",
//     display: "flex",
//     justifyContent: "space-between",
//   },
// });

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      voteType: "",
    };
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  async componentDidMount() {
    const { room } = this.props;
    this.props.setPage()
    socket.on("RefreshQueue", async () => {
      await this.props.fetchQueue(room);
      console.log("new queue fetched after for websocket");
    });
    await this.props.fetchQueue(room);
  }

  async upVote(voteValue, userId, songId) {
    await this.props.updateVote(voteValue, userId, songId, this.props.room);
    if (this.props.voteError !== "") {
      this.handleOpen();
      this.setState({ voteType: "upvote" });
    }
  }

  async downVote(voteValue, userId, songId) {
    await this.props.updateVote(voteValue, userId, songId, this.props.room);
    if (this.props.voteError !== "") {
      this.handleOpen();
      this.setState({ voteType: "downvote" });
    }
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  render() {
    const { open, voteType } = this.state;
    const { upVote, downVote, handleClose } = this;
    const { userId, classes } = this.props;
    let { queue, votes } = this.props;
    // let topThree = queue.slice(0, 3);
    queue = queue.slice(3);
    //console.log("QUEUE", queue);
    const windowWidth = window.innerWidth;
    const iconSize = windowWidth > 700 ? 30 : 15;
    return (
      // <div id="queue">
      //   {/* <RoomDetails roomId = {room} /> */}
      //   <h1>queue</h1>
      //   {queue.map((song) => {
      //     return (
      //       <div id='queueItem' key={song.id}>
      //           <div style={{display:'flex'}}>
      //             <ThumbUp
      //               size={iconSize}
      //               voteType={this.state.voteType}
      //               onClick={() => upVote(1, userId, song.id)}
      //             />
      //             <ThumbDown
      //               size={iconSize}
      //               voteType={this.state.voteType}
      //               onClick={() => downVote(-1, userId, song.id)}
      //             />
      //             <div style={{opacity:'90%',paddingLeft:'1rem',maxWidth:'230px',overflow:'hidden'}}>{song.name}</div>
      //           </div>
      //           <div>Votes: {song.totalVotes}</div>
      //
      <div id="queue">
        {/* <RoomDetails roomId = {room} /> */}
        <h1>queue</h1>
        {queue.map((song) => {

          let userVote = song.votes.find((vote)=>vote.userId === userId)
          return (
              <div id="queueItem" key={song.id}>
                <div className="queue-liner">
                  <div key={song.id} className="queue-biz">
                    { !userVote ? (
                      <div className="thumbs">
                        <ThumbUp
                          size={iconSize}
                          voteType={this.state.voteType}
                          onClick={() => upVote(1, userId, song.id)}
                        />
                        <ThumbDown
                          size={iconSize}
                          voteType={this.state.voteType}
                          onClick={() => downVote(-1, userId, song.id)}
                        />
                      </div>
                    ) : userVote.voteValue === "1" ? (
                      <div className="thumbs">
                        <ThumbUpSelected
                          size={iconSize}
                          voteType={this.state.voteType}
                          onClick={() => upVote(1, userId, song.id)}
                        />
                        <ThumbDown
                          size={iconSize}
                          voteType={this.state.voteType}
                          onClick={() => downVote(-1, userId, song.id)}
                        />
                      </div>
                    ) : (
                      <div className="thumbs">
                        <ThumbUp
                          size={iconSize}
                          voteType={this.state.voteType}
                          onClick={() => upVote(1, userId, song.id)}
                        />
                        <ThumbDownSelected
                          size={iconSize}
                          voteType={this.state.voteType}
                          onClick={() => downVote(-1, userId, song.id)}
                        />
                      </div>
                    )}
                  </div>
                  <div className='queue-song'>
                    {song.name}
                  </div>
                </div>
                <div>Votes: {song.totalVotes}</div>
              </div>
          );
        })}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {voteType === "upvote"
              ? "Already Upvoted! Feel Free To Change Your Vote"
              : "Already Downvoted! Feel Free To Change Your Vote"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => handleClose()}>OK!</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapState = (state, otherProps) => {
  return {
    username: state.auth.username,
    room: otherProps.match.params.id,
    queue: state.queue,
    userId: state.auth.id,
    otherProps,
    voteError: state.voteError,
    votes:queue.votes
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    fetchQueue: (room) => dispatch(fetchQueue(room)),
    updateVote: async (voteValue, userId, songId, room) => {
      await dispatch(updateVote(voteValue, userId, songId));
      await dispatch(fetchQueue(room));
    },
    setPage:()=>dispatch(page())
  };
};

export default connect(mapState, mapDispatch)(Home);
