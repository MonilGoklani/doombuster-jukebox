const router = require("express").Router();
const Playlist = require("../db/models/playlist");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    res.send(await Playlist.findAll());
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPlaylist = await Playlist.create(req.body)
    res.send(newPlaylist)
  } catch (err) {
    next(err);
  }
});

