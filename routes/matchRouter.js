const router = require("express").Router();
const matchController = require("../controllers/matchController");

router.get("/", matchController.getMatches);

router.get("/:teamLink", matchController.getTeamMatches);

router.post("/", matchController.saveMatch);

module.exports = router;
