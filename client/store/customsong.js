import axios from 'axios'
import youtube from "../api/youtube";
import {fetchQueue} from './queue'

const ADD_CUSTOM_SONG = 'ADD_CUSTOM_SONG'

/**
 * ACTION CREATORS
 */
const _addCustomSong = (customSong) => ({type: ADD_CUSTOM_SONG, customSong})

/**
 * THUNK CREATORS
 */

export const addCustomSong = (url,room,history) => {
    return async (dispatch) => {
        const youtube_parser = (youtube_url)=> {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = youtube_url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
          }
        const customSong = (await youtube.get('/videos',{
            params:{
              id:youtube_parser(url)
            }
          })).data.items[0].snippet

          let queue = (await axios.get(`/api/queue/${room}`)).data;
          let rank
          if(queue.length<3){
            rank=queue.length+1
          }
          const newSong = (
            await axios.post(`/api/queue/${room}`, {
              name: customSong.title,
              description: customSong.description,
              image: customSong.thumbnails.medium.url,
              largeImage: customSong.thumbnails.high.url,
              videoId: youtube_parser(url),
              roomId: room,
              rank:rank
            })
          ).data;
          dispatch(fetchQueue(room));
          socket.emit("QueueUpdated");
          history.push(`/home/${room}`);
      }
  }


/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case ADD_CUSTOM_SONG:
      return action.customSong
    default:
      return state
  }
}
