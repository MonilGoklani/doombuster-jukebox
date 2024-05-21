const router = require("express").Router();
const {
  models: { User, Room },
} = require("../db");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    let roomId;
    if (req.body.roomOption === "newRoom") {
      const room = await Room.create({ roomCode: req.body.roomCode });
      roomId = room.id;
      user.admin = "TRUE";
    } else {
      roomId = await Room.findRoomByCode(req.body.roomCode);
    }
    user.roomId = roomId;
    await user.save();
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      console.log("ERROR MESSAGE**************", err.errors[0].message);
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.get("/me", async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

// router.get('/youtube/callback', async(req, res, next)=> {
//   try {
//     res.send(
//       `
//       <html>
//       <body>
//         <script>
//         window.localStorage.setItem('token', '${await User.authenticateGoogle(req.query.code)}');
//         window.document.location = '/';
//         </script>
//       </body>
//       </html>
//       `);
//   }
//   catch(ex){
//     next(ex);
//   }
// });
