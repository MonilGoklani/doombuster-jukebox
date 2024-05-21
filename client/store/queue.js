import axios from "axios";
import history from "../history";

const FETCH_QUEUE = "FETCH_QUEUE";
const ADD_SONG_TO_QUEUE = "ADD_SONG_TO_QUEUE";
const DELETE_SONG_FROM_QUEUE = "DELETE_SONG_FROM_QUEUE";
// const DELETE_FROM_QUEUE = 'DELETE_FROM_QUEUE' //EMPTY--NEEDS WORK ON THUNK

//action creators
export const _fetchQueue = (queue) => {
  return {
    type: FETCH_QUEUE,
    queue,
  };
};

//thunk creators
export const fetchQueue = (room) => {
  return async (dispatch) => {
    let queue = (await axios.get(`/api/queue/${room}`)).data;
    const totalVotes = queue.map((song) => {
      return song.votes.reduce((accum, curr) => {
        accum += curr["voteValue"] * 1;
        return accum;
      }, 0);
    });
    queue.forEach((song, idx) => {
      song["totalVotes"] = totalVotes[idx];
    });
      let topThree = queue.filter(song=>song.rank)
      topThree.sort((a,b)=>a.rank-b.rank)
      let remainingQueue = queue.filter(song=>!song.rank)
      remainingQueue.sort((a, b) => b.totalVotes - a.totalVotes)
      queue = [...topThree,...remainingQueue]
    dispatch(_fetchQueue(queue));
  };
};

export const addToQueue = (room, song, history) => {
  return async (dispatch) => {
    let queue = (await axios.get(`/api/queue/${room}`)).data;
    let rank
    if(queue.length<3){
      rank=queue.length+1
    }
    const newSong = (
      await axios.post(`/api/queue/${room}`, {
        name: song.title,
        description: song.description,
        image: song.thumbnail,
        largeImage: song.largeThumbnail,
        videoId: song.videoId,
        roomId: room,
        rank:rank
      })
    ).data;
    dispatch(fetchQueue(room));
    socket.emit("QueueUpdated");
    history.push(`/home/${room}`);
  };
};

export const deleteSongFromQueue = (song, room, nextSong) => {
  return async (dispatch) => {
    await axios.delete(`/api/queue/${song.id}`); // deletes song that just got over
    if(nextSong){
      await axios.put(`/api/queue/${nextSong.id}`)
    }else{
      await axios.put(`/api/queue/0`)
    }
     // re-assigns top 3 ranks. Rank2->Rank1, Rank3->Rank2 and top song in queue is Rank 3
    dispatch(fetchQueue(room)) 
    socket.emit("QueueUpdated"); 
  };
};

//reducer
export default function (state = [], action) {
  switch (action.type) {
    case FETCH_QUEUE:
      return action.queue;
    default:
      return state;
  }
}
