const Sequelize = require("sequelize");
const { STRING, INTEGER, BOOLEAN } = Sequelize;
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Room = require("./room.js");

const SALT_ROUNDS = 5;

const User = db.define("user", {
  username: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: STRING,
  },
  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: "FALSE",
  },
  gameWon: {
    type: BOOLEAN,
    defaultValue: 'FALSE'
  }
});

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT);
};

/**
 * classMethods
 */
// User.authenticate = async function({ username, password},roomId,roomOption){
//   // console.log('RoomId',roomId)
//   // console.log('RoomOption',roomOption)
//     const user = await this.findOne({where: { username }})
//     if (!user || !(await user.correctPassword(password))) {
//       const error = Error('Incorrect username/password');
//       error.status = 401;
//       throw error;
//     }
//     if(roomOption==='newRoom')user.admin=true
//     if(roomOption==='enterRoom' && user.roomId!==roomId)user.admin=false
//     user.roomId=roomId
//     await user.save()
//     return user.generateToken();
// };

User.authenticate = async function ({
  username,
  password,
  roomOption,
  roomCode,
}) {
  // console.log('RoomId',roomId)
  // console.log('RoomOption',roomOption)
  const user = await this.findOne({ where: { username } });
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect username/password");
    error.status = 401;
    throw error;
  }
  let roomId;
  if (roomOption === "newRoom") {
    const room = await Room.create({ roomCode: roomCode * 1 });
    roomId = room.id;
  } else {
    roomId = await Room.findRoomByCode(roomCode * 1);
  }
  if (roomOption === "newRoom") user.admin = true;
  if (roomOption === "enterRoom" && user.roomId !== roomId) user.admin = false;
  user.roomId = roomId;
  await user.save();
  return user.generateToken();
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const user = User.findByPk(id);
    if (!user) {
      throw "nooo";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

User.authenticateGoogle = async function (code) {
  //step 1: exchange code for token
  console.log("CODE", code);
  let response = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:8080/auth/youtube/callback",
    },
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  const { data } = response;
  if (data.error) {
    const error = Error(data.error);
    error.status = 401;
    throw error;
  }
  const token = response.data.access_token;
  console.log("******TOKEN*******", token);
  // response = await axios.post('https://www.googleapis.com/youtube/v3/playlists?part=snippet',{
  //   snippet: {
  //   title: "Doombuster_Playlist",
  //   }
  // },{
  //   headers: {
  //     accept : 'application/json',
  //     'Content-Type' : 'application/json',
  //     Authorization : `Bearer ${token}`
  //   }
  // })
  response = await axios.post(
    "https://www.googleapis.com/youtube/v3/playlists",
    {
      snippet: {
        title: "Doombuster_Playlist",
      },
    },
    {
      params: {
        part: "snippet",
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let song = await axios.post(
    "https://www.googleapis.com/youtube/v3/playlistItems",
    {
      snippet: {
        playlistId: response.data.id,
        resourceId: {
          kind: "youtube#video",
          videoId: "fHI8X4OXluQ",
        },
      },
    },
    {
      params: {
        part: "snippet",
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // //step 2: use token for user info
  // response = await axios.get('https://api.github.com/user', {
  //   headers: {
  //     authorization: `token ${ data.access_token }`
  //   }
  // });
  // const { login, id } = response.data;

  // //step 3: either find user or create user
  // let user = await User.findOne({ where: { githubId: id, username: login } });
  // if(!user){
  //   user = await User.create({ username: login, githubId: id });
  // }
  // //step 4: return jwt token
  // return user.generateToken();
};

/**
 * hooks
 */
const hashPassword = async (user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => {
  users.forEach(hashPassword);
});


// User.prototype.getPeeps = async function(){
//   const peeps = await User.findAll({
//     where: {
//       roomId: this.roomId
//     }
//   })
//   return peeps.filter(peep=>peep.username != this.username);
// }

User.logoutProtocol = async function({user,room}){
  const currentAdmin = await User.findOne({
    where: {
      username: user
    }
  })
  currentAdmin.roomId = null;
  currentAdmin.admin = false;
  await currentAdmin.save()
  const newAdmin = await User.findAll({
       where: {
         roomId: room
       }
  }).data[0]
  newAdmin.admin= true;
  await newAdmin.save()
  return newAdmin;
}