const router = require("express").Router();
const teamController = require("../controllers/teamController");

router.get("/", teamController.getTeams);

router.get("/:teamLink", teamController.getTeam);

router.post("/", teamController.saveTeam);

module.exports = router;
