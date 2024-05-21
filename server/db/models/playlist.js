const Sequelize = require('sequelize')
const { STRING } = Sequelize
const db = require('../db')

const Playlist = db.define('playlist', {
  playlistName: {
    type: STRING
  },
  playlistUrl: {
    type: STRING
  }
})

module.exports = Playlist
