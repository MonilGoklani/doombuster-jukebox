const Sequelize = require('sequelize')
const { INTEGER } = Sequelize
const db = require('../db')
const User = require('./user.js')

const Room = db.define('room', {
  roomCode: {
    type: INTEGER,
    unique:true
  }
})

Room.findRoomByCode = async function(roomCode){
  roomCode=roomCode*1
  const room = await this.findOne({where: {roomCode:roomCode}})
  if(!room){
    const error = Error('Invalid Room Code');
    error.status = 401;
    throw error;
  }
  return room.id
}


//Room.beforeCreate(checkForExistingRoom)

module.exports = Room
