import React, {useState,useEffect} from "react";
import { connect } from "react-redux";
import {roomDetails} from "../store/room"


const RoomDetails = (props) => {
  const room = props.roomId;


  useEffect(()=>{
    props.roomDetails(room)
  },[])

  return (
    <div>
      <p>Room: {props.room} </p>
      <p>Host: {props.admin}</p>
    </div>
  )
}

const mapState = (state) => {
  return {
    username: state.auth.username,
    room: state.roomdetail.room,
    admin: state.roomdetail.admin
  };
};

const mapDispatch = (dispatch, {history}) => {
  return {
    roomDetails: (roomId) => dispatch(roomDetails(roomId))
  }
};

export default connect(mapState,mapDispatch)(RoomDetails);