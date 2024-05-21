const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
router.use("/queue", require("./queue"));
router.use("/room", require("./room"));
router.use("/vote", require("./vote"));
router.use("/playlists", require('./playlists'));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
