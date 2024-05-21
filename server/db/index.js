//this is the access point for all things database related!

const db = require("./db");

const User = require("./models/user");
const Room = require("./models/room");
const Song = require("./models/song");
const Vote = require("./models/vote");
const Playlist = require('./models/playlist')

//associations could go here!
User.belongsTo(Room);
Song.belongsTo(User);
Song.belongsTo(Room, {onDelete: "CASCADE"});
Room.hasMany(Song);

//associations added by Jared
Vote.belongsTo(Song);
Vote.belongsTo(User);
User.hasMany(Vote);
Song.hasMany(Vote);

//sync and seed....
const syncAndSeed = async () => {
  await db.sync({ force: true });
  const users = await Promise.all([
    User.create({ username: "cody@email.com", password: "123", admin: true }),
    User.create({ username: "murphy@email.com", password: "123",admin: true }),
  ]);
  const [cody, murphy] = users;

  const room = await Room.create({ roomCode: 1234 });
  const room2 = await Room.create({ roomCode: 2222 });
  cody.roomId = room.id;
  murphy.roomId = room2.id;
  await cody.save();
  await murphy.save();

  const playlists = await Promise.all([
    Playlist.create({playlistName:'Top50-2021',playlistUrl:'PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU'}),
    Playlist.create({playlistName:'Top50-2020',playlistUrl:'PLfWTbASpwTDiVOkVmOU2QA97pFtR0fXj6'}),
    Playlist.create({playlistName:'Top50-2019',playlistUrl:'PLLNMtg6QEY4ePU7aQg5zCYx08HU3bNCgp'}),
    Playlist.create({playlistName:'EDM',playlistUrl:'PLPbMT4wSxX89gUYpgYMrmOqsupKMRR5Rj'}),
    Playlist.create({playlistName:'Rock',playlistUrl:'RDCLAK5uy_mfut9V_o1n9nVG_m5yZ3ztCif29AHUffI'}),
    Playlist.create({playlistName:'Reggae',playlistUrl:'RDGMEM29nh-so2GiiVvCzzeO3LJQ'}),
    Playlist.create({playlistName:'Soundbath',playlistUrl:'PL_4s4N3ooC9T0Roc-lnB_nYESCSPzh-nB'}),
  ])

  return {
    users: {
      cody,

      murphy,
    },
  };
};

module.exports = {
  db,
  syncAndSeed,
  models: {
    User,
    Room,
    Song,
    Vote,
    Playlist
  },
};
