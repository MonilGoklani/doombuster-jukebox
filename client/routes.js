import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
// import { Login, Signup } from "./components/Auth-Form";
import LandingPage from "./components/landingPage";
import selectSong from "./components/selectSong";
import trivia from "./components/trivia";
import Home from "./components/home";
import { me, loadSongs, loadPlaylists, fetchQueue } from "./store";
import PlayQueue from './components/playqueue'

/**
 * COMPONENT
 */
// comment
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
    socket.on("PlaylistAdded", async () => {
      console.log('playlist added')
      this.props.loadInitialData();
    });
  }

  render() {
    const { isLoggedIn,room } = this.props;
    // console.log('ROOM',room)
    return (
      <div id='main'>
        {isLoggedIn? (
          <div id='playerContainer'>
          <PlayQueue history={this.props.history}/>
          </div>
        ) : (
          ""
        )}
        {isLoggedIn ? (
          <Switch>
            <Route path="/home/:id" component={Home}/>
            <Route path="/select/:id" component={selectSong}/>
            <Route path="/trivia/:id" component={trivia}/>
            <Redirect to={`/home/${room}`} />
          </Switch>
        ) : (
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Redirect to={`/`} />
          </Switch>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state,otherProps) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
    isAdmin: state.auth.admin,
    room: state.auth.roomId,
    queue: state.queue,
    roomAdmin : state.auth.username,
    playlists: state.playlists
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
      dispatch(loadSongs());
      dispatch(loadPlaylists())
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
