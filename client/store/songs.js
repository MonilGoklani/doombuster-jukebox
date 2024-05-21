import axios from 'axios'
import youtube from "../api/youtube";

const LOAD_SONGS = 'LOAD_SONGS'

/**
 * ACTION CREATORS
 */
const _loadSongs = (songs) => ({type: LOAD_SONGS, songs})

/**
 * THUNK CREATORS
 */

export const loadSongs = (playlistSelected) => {
    return async (dispatch) => {
      let response
      let allSongs = []
      
      //console.log('Video',video)
      const playlists = (await axios.get('/api/playlists')).data
      if(playlistSelected==='All'){
        playlists.map(async playlist=>{
          response = await youtube.get("/playlistItems",{
            params: {
              playlistId:playlist.playlistUrl
            }
          })
          allSongs = [...allSongs,...response.data.items]
          dispatch(_loadSongs(allSongs))
        })
      }else{
        const selectedPlaylist = playlists.find(playlist=>playlist.playlistName===playlistSelected)
        const playlistId = selectedPlaylist?selectedPlaylist.playlistUrl:"PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU"
        response = await youtube.get("/playlistItems", {
          params: {
            playlistId:playlistId
          },
        })
        allSongs = [...allSongs,...response.data.items]
        dispatch(_loadSongs(allSongs))
      }
  }
}


/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case LOAD_SONGS:
      return action.songs
    default:
      return state
  }
}
