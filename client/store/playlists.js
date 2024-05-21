import axios from 'axios'

const LOAD_PLAYLISTS = 'LOAD_PLAYLISTS'

/**
 * ACTION CREATORS
 */
const _loadPlaylists = (playlists) => ({type: LOAD_PLAYLISTS, playlists })

/**
 * THUNK CREATORS
 */

 export const loadPlaylists = () => {
   return async (dispatch) => {
    const playlists = (await axios.get('/api/playlists')).data
    return dispatch(_loadPlaylists(playlists))
   }
 }


/**
 * REDUCER
 */
export default function(state = [], action) {
  switch (action.type) {
    case LOAD_PLAYLISTS:
      return action.playlists
    default:
      return state
  }
}
