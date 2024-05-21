import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addToQueue } from "../store/queue";
import { loadSongs } from "../store/songs";
import { page } from "../store/page";
import AddPlaylist from "./addPlaylist";
import {addCustomSong} from "../store/customsong"
//import socketIOClient from "socket.io-client"

//material ui
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const styles = () => ({
  root: {
    color: "white",
    backgroundColor: "black",
    border: "1px solid white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
    width:'160px',
    marginLeft:'1rem'
  },
  input: {
    background: "#1a1a1a",
    margin: "1em 0 1em 0",
  },
});

/**
 * COMPONENT
 */

export const SongList = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedSong, setSong] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [add, setAdd] = useState(false);
  const [videoURL, setVideoURL] = useState("")
  const {
    username,
    songs,
    queue,
    room,
    playlists,
    addToQueue,
    loadSongs,
    setPage,
    customSong
  } = props;

  //console.log('**SONGS**',props)
  useEffect(() => {
    props.setPage();
  }, []);

  const filteredSongs = songs.filter((song) => {
    return song.snippet.title.toLowerCase().includes(search);
  });
  const repeatSong = (song) => {
    const inqueue = queue.find((ele) => ele.name === song.title);
    if (inqueue) {
      return true;
    } else {
      return false;
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //popup
  const handleClickOpen = (song) => {
    setSong({
      title: song.title,
      description: song.description,
      thumbnail: song.thumbnails.medium.url,
      largeThumbnail: song.thumbnails.high.url,
      videoId: song.resourceId.videoId,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const addPlaylist = () => {
    setAdd(true);
  };

  const handleVideoURL = (e) => {
    setVideoURL(e.target.value)
  }

  const addVideoToQueue = () =>{
    props.addCustomSong(videoURL,room,history)
  }

  return (
    <div>
      {!add ? (
        <div>
          <div id="options">
            <div id='options-main'>
              <h3>Add your favorite song using a Youtube Link</h3>
              <div id='custom-song'> 
              <TextField
                   id="custom-song-input"
                   size="small"
                   className={props.classes.input}
                   label="Enter Youtube URL"
                   variant="outlined"
                  onChange={(e) => handleVideoURL(e)}
                ></TextField>
                <Button className={props.classes.root} onClick={addVideoToQueue}>Add To Queue</Button>
              </div>
              <h2 style={{color:'white',fontFamily:'Plane Crash'}}>or</h2>
              <h3>Add a song from our curated list below </h3>
              <div id="select-playlist-container">
              <div id="search">
                <TextField
                  id="searchbar"
                  className={props.classes.input}
                  size="small"
                  name="searchbar"
                  label="Search in Playlist"
                  value={search}
                  variant="outlined"
                  onChange={(e) => handleSearch(e)}
                ></TextField>
              </div>
              <div id="select-playlist">
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  className={props.classes.root}
                >
                  Select A Playlist
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      return loadSongs("All"), handleMenuClose();
                    }}
                    style={{ fontWeight: "1000" }}
                  >
                    All Songs
                  </MenuItem>
                  {playlists.map((playlist) => (
                    <MenuItem
                      key={playlist.id}
                      onClick={() => {
                        return (
                          loadSongs(playlist.playlistName), handleMenuClose()
                        );
                      }}
                    >
                      {playlist.playlistName}
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={() => {
                      return addPlaylist(), handleMenuClose();
                    }}
                    style={{ color: "red" }}
                  >
                    ADD PLAYLIST
                  </MenuItem>
                </Menu>
              </div>
              </div>


            </div>
          </div>
          <div id="songList">
            {filteredSongs.map((song, idx) => {
              return (
                <div id="select-song-item" key={idx}>
                  <button onClick={() => handleClickOpen(song.snippet)}>
                    <img
                      src={song.snippet.thumbnails.medium.url}
                      alt={song.snippet.description}
                    />
                    <p className="choice-title">{song.snippet.title}</p>
                  </button>
                </div>
              );
            })}

            {/* //material ui confirm song popup box */}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="confirm-add-song"
              aria-describedby="confirm-add-song"
            >
              {/* //queue.length <= 10 && !repeatSong(selectedSong)? */}
              {repeatSong(selectedSong) ? (
                <div>
                  <DialogTitle id="error-repeat">
                    Poor Taste! JK. Song is already in queue. Please choose
                    another!
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={() => handleClose()}>OK</Button>
                  </DialogActions>
                </div>
              ) : queue.length > 10 ? (
                <div>
                  <DialogTitle id="error-full">
                    Poor Taste! JK. Queue is too full. Come back soon!
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={() => handleClose()}>OK</Button>
                  </DialogActions>
                </div>
              ) : (
                <div>
                  <DialogTitle id="add-song">
                    Add this song to the queue?
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="add-song-description">
                      {selectedSong.title}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        return (
                          addToQueue(room, selectedSong),
                          setPage(),
                          handleClose()
                        );
                      }}
                    >
                      Yes
                    </Button>
                    <Button onClick={handleClose}>Put it back</Button>
                  </DialogActions>
                </div>
              )}
            </Dialog>
          </div>
        </div>
      ) : (
        <AddPlaylist add={add} setAdd={setAdd} />
      )}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state, otherProps) => {
  return {
    username: state.auth.username,
    room: otherProps.match.params.id,
    songs: state.songs,
    queue: state.queue,
    playlists: state.playlists,
    customSong: state.customSong
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    // addToQueue: (room,song) => {
    //   socket.emit('SelectSong',room,song)
    //   history.push(`/home/${room}`)},
    addToQueue: (room, song) => dispatch(addToQueue(room, song, history)),
    loadSongs: (playlistSelected) => dispatch(loadSongs(playlistSelected)),
    setPage: () => dispatch(page()),
    addCustomSong: (url,room) => dispatch(addCustomSong(url,room,history))
  };
};

export default withStyles(styles)(connect(mapState, mapDispatch)(SongList));
