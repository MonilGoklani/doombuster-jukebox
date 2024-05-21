import axios from "axios";
import history from "../history";


const UPDATE_VOTE = "UPDATE_VOTE";

/**
 * ACTION CREATORS
 */
const _updateVoteError = (voteError) => ({ type: UPDATE_VOTE, voteError });

//Click on buton >> it calls a method called UPDATEVOTE
//It either needs a valye of -1, 1

//thunk creators
export const updateVote = (voteValue, userId, songId) => {
  return async (dispatch) => {
    try{
      const vote = (await axios.post(`/api/vote/`, { voteValue, userId, songId }))
      .data;
      dispatch(_updateVoteError(''))
      socket.emit('QueueUpdated')
    }catch(ex){
      dispatch(_updateVoteError(ex.response.data))
    }
  };
};

//reducer
export default function (state = '', action) {
  switch (action.type) {
    case UPDATE_VOTE:
      return action.voteError;
    default:
      return state;
  }
}
