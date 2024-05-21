import axios from 'axios'
import history from '../history'

const ROOM_DETAILS = 'ROOM_DETAILS'

export const _roomDetails = (roomdetails) => {
  return {
    type: ROOM_DETAILS,
    roomdetails
  }
};

export const roomDetails = (roomId)=>{
  return async (dispatch)=>{
    const roomdetails = (await axios.get(`/api/room/details/${roomId}`)).data
    dispatch(_roomDetails(roomdetails))
  }
}

export default function(state = {}, action) {
  switch (action.type) {
    case ROOM_DETAILS:
      return action.roomdetails
    default:
      return state
  }
}
