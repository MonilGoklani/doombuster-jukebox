const router = require('express').Router()
const { models: {Room}} = require('../db');
const { findRoomByCode } = require('../db/models/room');
const User = require('../db/models/user');
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    res.send(await Room.create(req.body)); 
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const roomId = await Room.findRoomByCode(req.params.id)
    res.send({roomId})
  } catch (ex) {
    next(ex)
  }
})

router.get('/details/:id', async (req, res, next) => {
  try {
    const roomCode = await Room.findOne({
      where: {
        id: req.params.id
      }
    })
    const admin = await User.findOne({
      where: {
        roomId: req.params.id,
        admin: true
      }
    })
    res.send({room: roomCode.roomCode, admin: admin.username})
  } catch (ex) {
    next(ex)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Room.destroy({
      where: {
        roomCode: req.params.id
      }
    })
  } catch (err) {
    next(err)
  }
})