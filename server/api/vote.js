const router = require("express").Router();
const Vote = require("../db/models/vote");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    const vote = await Vote.create(req.body);
    res.send(vote);
  } catch (err) {
    next(err);
  }
});

