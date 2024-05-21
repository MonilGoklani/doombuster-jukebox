import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout , page} from "../store";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";


const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  colorPrimary:{
    backgroundColor:'#050e4a'
  }
}));


const Navbar = (props) => {
  const classes = useStyles();
  const { handleClick, isLoggedIn, room, username, setPage, page} = props;
  return (
    <div id='navbar'>
      {isLoggedIn ? (
        <div>
          <AppBar position="fixed" className={classes.colorPrimary}>
            
            <Toolbar className={classes.root}>
              <Typography id='appname-nav'>
                <Link to={`/select/${room}`} id='icon-nav'>h</Link>
                <Link to={`/select/${room}`} id='name-nav' className='navtitles' style={{fontFamily:'Erosion'}}>doombuster</Link>
              </Typography>
              <div id='select-queue' className='navtitle-container'>
              {page==='select' || page==='trivia'?(
              <Typography className='navtitle-container'>
              <Link to={`/home/${room}`} className='navtitles'>queue</Link>
              </Typography>
              ):(
                <Typography>
                <Link to={`/select/${room}`} className='navtitles'>select a song</Link>
                </Typography>
              )}
              </div>
              {/* <Typography>
                <Link to={`/trivia/${room}`} className='navtitles'>trivia</Link>
              </Typography> */}
              <Typography>
                <a href="#" onClick={() => handleClick(room, username)} className='navtitles'>
                  logout
                </a>
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    username: state.auth.username,
    room: window.location.pathname.slice(-1) * 1,
    page: state.page
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick(room, username) {
      dispatch(logout(room, username));
    },
    setPage(){
      dispatch(page())
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);
