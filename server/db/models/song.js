const Sequelize = require("sequelize");
const { STRING, TEXT, INTEGER, BOOLEAN } = Sequelize;
const db = require("../db");

const Song = db.define("song", {
  URL: {
    type: STRING,
    isUrl: true,
    notNull: true,
  },
  name: {
    type: STRING,
  },
  description: {
    type: TEXT,
  },
  image: {
    type: STRING,
  },
  largeImage: {
    type: STRING,
  },
  queue: {
    type: BOOLEAN,
  },
  rank: {
    type: INTEGER,
  },
  videoId: {
    type: STRING,
  },
});

module.exports = Song;
