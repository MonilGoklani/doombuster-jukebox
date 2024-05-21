const Sequelize = require("sequelize");
const { ENUM } = Sequelize;
const db = require("../db");


const Vote = db.define("vote", {
  voteValue: {
    type: ENUM(["-1", "1"]),
  },
});

module.exports = Vote;


/**
 * hooks
 */
const restrictDoubleVote= async (vote) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
const oldVote = await Vote.findOne({
  where:{
    songId:vote.songId,
    userId:vote.userId
  }
})
console.log(oldVote)
//console.log(oldVote.data)


if(oldVote){
  if(oldVote.voteValue*1 === vote.voteValue*1){
    return Promise.reject(new Error('Duplicate Vote'))
  }else{
    await oldVote.destroy()
  }
}

};

Vote.beforeCreate(restrictDoubleVote);
