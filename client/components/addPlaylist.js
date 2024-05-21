import React,{useState} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {loadPlaylists} from '../store'
import { loadSongs } from "../store/songs";
import { TextField, Button, FormControl, FormControlLabel, FormHelperText} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'


const styles = () => ({
    root:{
        color: "white",
        backgroundColor: "black",
        border: '1px solid white',
        "&:hover": {
          backgroundColor: "white",
          color:'black'
        },
    },
    input:{
        background:'#33373d',
        margin:'1em 0 1em 0',
    }
})

export const AddPlaylist = (props) => {
console.log('PROPS',props)
const [playlistName,SetName] = useState('');
const [playlistUrl,SetUrl] = useState('')
const handleChange = (ev) =>{
    if(ev.target.name==='name'){
        SetName(ev.target.value)
    }
    if(ev.target.name==='url'){
        SetUrl(ev.target.value)
    }
}

const handleSubmit = async (ev) => {
    try{
        ev.preventDefault();
        const playlist = (await axios.post('/api/playlists',{playlistName,playlistUrl})).data
        props.setAdd(false);
        props.loadPlaylists();
        props.loadSongs(playlist.playlistName)
        socket.emit("PlaylistAdded");
    }catch(ex){
        console.log(ex)
    }
}
    return (
        <div id='addPlaylist'>
            <div id='playlist-name'>
                <TextField className={props.classes.input} size='small' name='name' label='Enter Playlist Name' value={playlistName} variant='outlined' onChange={(ev)=>handleChange(ev)}></TextField>
            </div>
           <div id='playlist-id'>
                <TextField style={{marginBottom:'0.2em'}} className={props.classes.input} size= 'small' name='url' label='Enter Playlist Id' value={playlistUrl} variant='outlined' onChange={(ev)=>handleChange(ev)}></TextField>    
           </div>
           <p style={{color:'white',marginBottom:'1em'}}>Example: PLZeFbqMoTRYQeCplrjdasjG7Uc8NMkj0p</p>
           <Button className = {props.classes.root} size='small' onClick = {handleSubmit}>Add Playlist</Button>
        </div>
    )
}

const mapDispatch = (dispatch) => {
    return{
        loadPlaylists: () => dispatch(loadPlaylists()),
        loadSongs: (playlistSelected) => dispatch(loadSongs(playlistSelected)),
    }
}

export default withStyles(styles)(connect(null,mapDispatch)(AddPlaylist))